#include "mpu6050_test.h"

#include <stdio.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include "freertos/ringbuf.h"
#include <esp_err.h>
#include <esp_log.h>
#include <mpu6050.h>

#include "config.h"
#include "i2c_devices.h"

#include "accelerometer_data.h"
#include "gyroscope_data.h"
#include "IMU_data.h"
#include "AHRS_data.h"

#include "ws_msg_ringbuf.h"
#include "ws_msg.h"
//----------------------------------------------------------------------

static const char *TAG = "mpu6050_test";

//----------------------------------------------------------------------

//----------------------------------------------------------------------
void mpu6050_test(void *pvParameters)
{
    mpu6050_dev_t dev = {0};

    ESP_ERROR_CHECK(mpu6050_init_desc(&dev,
                                      I2C_DEV_ADDR_MPU6050_LOW,
                                      0,
                                      I2C_SDA_GPIO,
                                      I2C_SCL_GPIO));

    while (1)
    {
        esp_err_t res = i2c_dev_probe(&dev.i2c_dev, I2C_DEV_WRITE);
        if (res == ESP_OK)
        {
            ESP_LOGI(TAG, "Found MPU60x0 device");
            break;
        }
        ESP_LOGE(TAG, "MPU60x0 not found");
        vTaskDelay(pdMS_TO_TICKS(1000));
    }

    ESP_ERROR_CHECK(mpu6050_init(&dev));

    ESP_LOGI(TAG, "Accel range: %d", dev.ranges.accel);
    ESP_LOGI(TAG, "Gyro range:  %d", dev.ranges.gyro);

    //-------------
    while (1)
    {
        // if (!ws_msg_ringbuf)
        if (ws_msg_ringbuf == NULL)
        {
            ESP_LOGE(TAG, "ws_msg_ringbuf NULL!");
            vTaskDelay(pdMS_TO_TICKS(1000));
            continue;
        }
        //-------------
        float temp;
        mpu6050_acceleration_t accel = {0};
        mpu6050_rotation_t rotation = {0};

        ESP_ERROR_CHECK(mpu6050_get_temperature(&dev, &temp));
        ESP_ERROR_CHECK(mpu6050_get_motion(&dev, &accel, &rotation));
        // ESP_LOGI(TAG, "**********************************************************************");
        // ESP_LOGI(TAG, "Acceleration: x=%.4f   y=%.4f   z=%.4f", accel.x, accel.y, accel.z);
        // ESP_LOGI(TAG, "Rotation:     x=%.4f   y=%.4f   z=%.4f", rotation.x, rotation.y, rotation.z);
        // ESP_LOGI(TAG, "Temperature:  %.1f", temp);

        Gyroscope_unit_data_t g;
        g.x = rotation.x;
        g.y = rotation.y;
        g.z = rotation.z;

        Accelerometer_unit_data_t a;
        a.x = accel.x;
        a.y = accel.y;
        a.z = accel.z;

        IMU_data_t imu;
        imu.g = g;
        imu.a = a;

        AHRS_data_t ahrs;
        ahrs.imu = imu;

        // size_t json_str_len = 256;
        // char json_str[json_str_len];

        // json_str_len = gyroscope_data2json(json_str, json_str_len, &g);
        // ESP_LOGI(TAG, "Gyroscope: %s", json_str);

        // json_str_len = accelerometer_data2json(json_str, json_str_len, &a);
        // ESP_LOGI(TAG, "Accelerometer: %s", json_str);

        // IMU_data2json(json_str, json_str_len, &imu);
        // ESP_LOGI(TAG, "IMU: %s", json_str);

        // AHRS_data2json(json_str, json_str_len, &ahrs);
        // ESP_LOGI(TAG, "AHRS: %s", json_str);

        //--------------------
        // Ws_msg_t ws_msg = {.data = json_str,
        //                    .len = json_str_len};
        // xQueueSend(ws_msg_queue, &ws_msg, portMAX_DELAY);
        //--------------------
        //--------------------
        Ws_msg_t *msg = alloc_ws_msg();

        if (msg)
        {
            // msg->len = accelerometer_data2json(msg->data.data,WS_RINGBUFF_MAX_DATA_SIZE, a);
            // msg->len = gyroscope_data2json(msg->data.data, WS_RINGBUF_MAX_DATA_SIZE, &g);
            // msg->len = IMU_data2json(msg->str, WS_RINGBUF_MAX_DATA_SIZE, &imu);
            msg->len = AHRS_data2json(msg->str, WS_RINGBUF_MAX_DATA_SIZE, &ahrs);

            if (xRingbufferSend(ws_msg_ringbuf,
                                &msg,
                                sizeof(msg),       // ✅ передаём адрес указателя
                                pdMS_TO_TICKS(100) // ✅ размер указателя
                                ) != pdTRUE)
            {
                ESP_LOGE(TAG, "Send failed");
                free_ws_msg(msg);

                vTaskDelay(pdMS_TO_TICKS(1));
                continue;
            }
        }

        vTaskDelay(pdMS_TO_TICKS(20));

        //--------------------
        vTaskDelay(pdMS_TO_TICKS(1));
    }
}
//----------------------------------------------------------------------
void mpu6050_test_start(const int cpuId)
{
    ESP_ERROR_CHECK(i2cdev_init());

    // xTaskCreate(mpu6050_test, "mpu6050_test", configMINIMAL_STACK_SIZE * 6, NULL, 5, NULL);
    // xTaskCreatePinnedToCore(mpu6050_test, "mpu6050_test", configMINIMAL_STACK_SIZE * 6, NULL, 5, NULL, cpuId);
    xTaskCreatePinnedToCore(mpu6050_test, "mpu6050_test", 4096, NULL, 5, NULL, cpuId);
    // xTaskCreatePinnedToCore(mpu6050_test, "mpu6050_test", 8192, NULL, 5, NULL, cpuId);
    // xTaskCreatePinnedToCore(mpu6050_test, "mpu6050_test", 16284, NULL, 5, NULL, cpuId);
}
