#include "MPU6050.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// #include <math.h>
#include <mpu6050.h>
// #include "freertos/FreeRTOS.h"
// #include "freertos/task.h"

#include "esp_log.h"
#include "esp_err.h"

#include "driver/i2c_master.h"

#include "config.h"

#include "accelerometer_data.h"
#include "gyroscope_data.h"
#include "IMU_data.h"

#include "ws_msg_ringbuf.h"

//--------------------------------
// не менять последовательность //
#include "i2c_device_private.h" //
#include "i2c_device.h"         //
//--------------------------------
#include "i2c_devices.h"

//----------------------------------------------------------------------
#define TAG "MPU6050"
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// { "cmd": "add_sensor", "type": "MPU6050", "addr": 104 }
//----------------------------------------------------------------------
mpu6050_dev_t mpu6050_dev = {0};
//----------------------------------------------------------------------
static esp_err_t MPU6050_init(i2c_device_t *i2c_dev)
{
    ESP_LOGI(TAG, "MPU init at 0x%02X", i2c_dev->dev_cfg.device_address);

    ESP_ERROR_CHECK(mpu6050_init_desc(&mpu6050_dev,
                                      I2C_DEV_ADDR_MPU6050_LOW,
                                      0,
                                      I2C_SDA_GPIO,
                                      I2C_SCL_GPIO));

    // while (1)
    // {
    //     esp_err_t res = i2c_dev_probe(&mpu6050_dev.i2c_dev, I2C_DEV_WRITE);
    //     if (res == ESP_OK)
    //     {
    //         ESP_LOGI(TAG, "Found MPU60x0 device");
    //         break;
    //     }

    //     ESP_LOGE(TAG, "MPU60x0 not found");
    //     vTaskDelay(pdMS_TO_TICKS(1000));
    // }

    i2c_dev->ctx = &mpu6050_dev;

    return ESP_OK;
}
//----------------------------------------------------------------------
static esp_err_t MPU6050_read(i2c_device_t *i2c_dev, void *data)
{
    mpu6050_dev_t dev = *((mpu6050_dev_t *)(i2c_dev->ctx));

    float temp;
    mpu6050_acceleration_t accel = {0};
    mpu6050_rotation_t rotation = {0};

    ESP_ERROR_CHECK(mpu6050_get_temperature(&dev, &temp));
    ESP_ERROR_CHECK(mpu6050_get_motion(&dev, &accel, &rotation));

    ESP_LOGI(TAG, "**********************************************************************");
    // ESP_LOGI(TAG, "Acceleration: x=%.4f   y=%.4f   z=%.4f", accel.x, accel.y, accel.z);
    // ESP_LOGI(TAG, "Rotation:     x=%.4f   y=%.4f   z=%.4f", rotation.x, rotation.y, rotation.z);
    // ESP_LOGI(TAG, "Temperature:  %.1f", temp);

    const size_t json_str_len = 256;
    char json_str[json_str_len];

    Gyroscope_unit_data_t g;
    g.x = rotation.x;
    g.y = rotation.y;
    g.z = rotation.z;

    // gyroscope_data2json(json_str, json_str_len, &g);
    // ESP_LOGI(TAG, "Gyroscope: %s", json_str);

    Accelerometer_unit_data_t a;
    a.x = accel.x;
    a.y = accel.y;
    a.z = accel.z;

    // accelerometer_data2json(json_str, json_str_len, &a);
    // ESP_LOGI(TAG, "Accelerometer: %s", json_str);

    IMU_data_t imu;
    imu.g = g;
    imu.a = a;

    IMU_data2json(json_str, json_str_len, &imu);
    ESP_LOGI(TAG, "IMU: %s", json_str);

    //--------------------
    /*
        mpu_data_t test_data;

        xQueueSend(ws_queue, &test_data, portMAX_DELAY);
    */
    //--------------------

    Ws_msg_t *msg = alloc_ws_msg();

    if (msg)
    {
        ESP_LOGI(TAG, "ws_msg allocated");
        // msg->data.len = accelerometer_data2json(msg->data.data,WS_RINGBUFF_MAX_DATA_SIZE, a);
        // msg->data.len = gyroscope_data2json(msg->data.data, WS_RINGBUF_MAX_DATA_SIZE, &g);
        msg->len = IMU_data2json(msg->str, WS_RINGBUF_MAX_DATA_SIZE, &imu);
    }

    if (xRingbufferSend(ws_msg_ringbuf, msg, sizeof(*msg), pdMS_TO_TICKS(100)) != pdTRUE)
    {
        ESP_LOGE(TAG, "Send failed");
        free_ws_msg(msg);
        return ESP_FAIL;
    }

    //--------------------

    return ESP_OK;
}
//----------------------------------------------------------------------
// Создание backend - структуры с персонализированными функциями драйвера
static const i2c_device_backend_t _MPU6050_backend = {
    .init = MPU6050_init,
    .read = MPU6050_read};
//----------------------------------------------------------------------
esp_err_t MPU6050_setup(i2c_device_t *i2c_dev)
{
    ESP_LOGI(TAG, "start setup");

    i2c_dev->type_name = "MPU6050";
    i2c_dev->backend = &_MPU6050_backend;

    // MPU6050_init(i2c_dev, &mpu6050_dev);
    ESP_ERROR_CHECK(i2c_dev->backend->init(i2c_dev));

    return ESP_OK;
}