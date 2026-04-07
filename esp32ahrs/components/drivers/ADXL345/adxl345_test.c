#include "adxl345_test.h"

#include <stdio.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

#include <adxl345.h>
#include <string.h>

#include "config.h"
#include "i2c_devices.h"

#include "accelerometer_data.h"
#include "gyroscope_data.h"
#include "IMU_data.h"
#include "AHRS_data.h"

#include "ws_msg_ringbuf.h"
#include "ws_msg.h"

//----------------------------------------------------------------------
#include <chrono>
#include <sdkconfig.h>
#include <vector>

#include "driver/gpio.h"

#include "adxl345.hpp"

#include "i2c.hpp"
#include "interrupt.hpp"
#include "logger.hpp"
#include "task.hpp"

using namespace std::chrono_literals;

// This example is designed to be run on a board with an ADXL345 connected via I2C.
// Update the I2C pins and address as needed for your hardware.
//
// Example wiring for ESP32:
// ESP32          | ADXL345
// -------------------------
// 3.3V           | VCC
// GND            | GND
// SDA (GPIO21)   | SDA
// SCL (GPIO22)   | SCL
// ALERT (GPIO35) | INT1
//
// You can use the ESP-IDF menuconfig to set the I2C pins and the alert pin.

//----------------------------------------------------------------------

static const char *TAG = "adxl345_test";
//----------------------------------------------------------------------
adxl345_t adxl345_dev;

//----------------------------------------------------------------------
void adxl345_init(void *pvParameters)
{
  ESP_LOGI(TAG, "Starting ADXL345 example!");

  //! [adxl345 example]
  // I2C configuration
  espp::I2c i2c({
      .port = I2C_NUM_0,
      .sda_io_num = (gpio_num_t)I2C_SDA_GPIO,
      .scl_io_num = (gpio_num_t)I2C_SCL_GPIO,
  });

  std::error_code ec;

  //////////////////////
  /// ADXL345 Configuration
  //////////////////////

  // Create the ADXL345 instance
  // NOTE: auto_init defaults to true, so we don't have to call initialize ourselves.
  espp::Adxl345 accel(espp::Adxl345::Config{
      .device_address = espp::Adxl345::DEFAULT_ADDRESS,
      .range = espp::Adxl345::RANGE_2G,
      .data_rate = espp::Adxl345::RATE_100_HZ,
      .write = std::bind(&espp::I2c::write, &i2c, std::placeholders::_1, std::placeholders::_2,
                         std::placeholders::_3),
      .read = std::bind(&espp::I2c::read, &i2c, std::placeholders::_1, std::placeholders::_2,
                        std::placeholders::_3),
      .log_level = espp::Logger::Verbosity::WARN,
  });

  // Disable measurement mode initially, so we can configure interrupts and such
  accel.set_measurement_mode(false, ec);

  // Configure the ADXL345
  accel.set_fifo_mode(espp::Adxl345::FifoMode::STREAM, ec); // discard old data when FIFO is full
  accel.set_fifo_num_samples(1, ec);                        // set FIFO to trigger watermark interrupt on every sample
  accel.set_low_power(false, ec);                           // disable low power mode
  accel.set_sleep_mode(false, ec);                          // disable sleep mode
  accel.set_auto_sleep(false, ec);                          // disable auto sleep mode

  bool active_high = false;
  accel.set_interrupt_polarity(active_high, ec); // set interrupt polarity to active high
  // configure the interrupt to trigger on watermark on INT1 pin
  accel.set_interrupt_mapping(espp::Adxl345::InterruptType::WATERMARK,
                              espp::Adxl345::InterruptPin::INT1, ec);
  // enable the watermark interrupt
  accel.configure_interrupt(espp::Adxl345::InterruptType::WATERMARK, true, ec);

  //////////////////////
  /// Interrupt handling
  //////////////////////

  static auto start = std::chrono::high_resolution_clock::now();
  auto callback = [&](const espp::Interrupt::Event &event)
  {
    std::error_code ec;
    // clear the interrupt source
    [[maybe_unused]] auto interrupt_status = accel.get_interrupt_source(ec);
    if (ec)
    {
      ESP_LOGI(TAG, "Error getting interrupt source: %s", ec.message());
    }
    auto now = std::chrono::high_resolution_clock::now();
    // we got a data ready interrupt, read the data and print it
    auto data_vec = accel.read_all(ec);
    if (ec)
    {
      ESP_LOGI(TAG, "Error reading ADXL345: %s", ec.message());
      return;
    }
    for (int i = 0; i < data_vec.size(); ++i)
    {
      auto &data = data_vec[i];
      // get the offset in time from now that hte sample was taken
      auto sample_time = now - 10ms * (data_vec.size() - i - 1);
      // convert to seconds
      auto elapsed = std::chrono::duration<float>(sample_time - start).count();

      Accelerometer_unit_data_t a;
      a.x = data.x;
      a.y = data.y;
      a.z = data.z;
      char a_json_str[50];
      accelerometer_data2json(a_json_str, 50, &(data->a));
      // Print the data in g's
      // fmt::print("{:.3f}, {:.4f}, {:.4f}, {:.4f}\n", elapsed, data.x, data.y, data.z);

      ESP_LOGI(TAG, "ADXL345: %s", a_json_str);
    }
  };

  espp::Interrupt::PinConfig accel_int = {
      .gpio_num = (gpio_num_t)CONFIG_EXAMPLE_ALERT_GPIO,
      .callback = callback,
      .active_level = espp::Interrupt::ActiveLevel::LOW,
      .interrupt_type = espp::Interrupt::Type::FALLING_EDGE,
      .pullup_enabled = true,
      .pulldown_enabled = false,
      .filter_type = espp::Interrupt::FilterType::PIN_GLITCH_FILTER,
  };

  espp::Interrupt interrupt({
      .isr_core_id = 1,
      .interrupts = {accel_int},
      .task_config =
          {
              .name = "Interrupt task",
              .stack_size_bytes = 6192,
              .priority = 5,
          },
      .log_level = espp::Logger::Verbosity::WARN,
  });
}
//----------------------------------------------------------------------
void qmc5883l_test(void *pvParameters)
{
  //////////////////////
  /// Get the data
  //////////////////////

  // Print CSV header
  // fmt::print("%time (s), x (g), y (g), z (g)\n");

  // Enable measurement mode
  accel.set_measurement_mode(true, ec);

  while (1)
  {
    auto start_time = std::chrono::high_resolution_clock::now();
    auto active_states = interrupt.get_active_states();

    ESP_LOGI(TAG, "Instantaneous state of pins: {}", active_states);
    auto interrupt_status = accel.get_interrupt_source(ec);

    if (ec)
      ESP_LOGE(TAG, "Error getting interrupt source: {}", ec.message());
    else

      ESP_LOGI(TAG, "Interrupt source: 0x{:02X}", interrupt_status);

    auto data_vec = accel.read_all(ec);

    if (ec)
      ESP_LOGE(TAG, "Error reading all data: {}", ec.message());
    else
      ESP_LOGI(TAG, "Read {} samples from ADXL345: {}", data_vec.size(), data_vec);

    interrupt_status = accel.get_interrupt_source(ec);

    if (ec)
      ESP_LOGE(TAG, "Error getting interrupt source: {}", ec.message());
    else
      ESP_LOGI(TAG, "Interrupt source: 0x{:02X}", interrupt_status);

    std::this_thread::sleep_until(start_time + 100ms);

    vTaskDelay(pdMS_TO_TICKS(250));
  }
}
//----------------------------------------------------------------------
void adxl345_test_start(const int cpuId)
{
  adxl345_init();

  xTaskCreatePinnedToCore(adxl345_test, "adxl345_test", configMINIMAL_STACK_SIZE * 4, NULL, 5, NULL, cpuId);
}
