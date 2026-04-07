#include "qmc5883l_test.h"

#include <stdio.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include "freertos/ringbuf.h"

#include <esp_err.h>
#include <esp_log.h>

#include <qmc5883l.h>
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

static const char *TAG = "qmc5883l_test";
//----------------------------------------------------------------------
qmc5883l_t qmc5883l_dev;

//----------------------------------------------------------------------
void qmc5883l_test(void *pvParameters)
{
    memset(&qmc5883l_dev, 0, sizeof(qmc5883l_t));

    ESP_ERROR_CHECK(i2cdev_init());
    ESP_ERROR_CHECK(qmc5883l_init_desc(&qmc5883l_dev, QMC5883L_I2C_ADDR_DEF, 0, I2C_SDA_GPIO, I2C_SCL_GPIO));

    // 50Hz data rate, 128 samples, -2G..+2G range
    ESP_ERROR_CHECK(qmc5883l_set_config(&qmc5883l_dev, QMC5883L_DR_50, QMC5883L_OSR_128, QMC5883L_RNG_2));

    while (1)
    {
        // *Measurement result, milligauss typedef struct
        qmc5883l_data_t data;
        if (qmc5883l_get_data(&qmc5883l_dev, &data) == ESP_OK)
        {
            /* float is used in printf(). you need non-default configuration in
             * sdkconfig for ESP8266, which is enabled by default for this
             * example. see sdkconfig.defaults.esp8266
             */

            // Gyroscope_unit_data_t g;
            // g.x = rotation.x;
            // g.y = rotation.y;
            // g.z = rotation.z;

            // Accelerometer_unit_data_t a;
            // a.x = accel.x;
            // a.y = accel.y;
            // a.z = accel.z;

            // IMU_data_t imu;
            // imu.g = g;
            // imu.a = a;

            AHRS_data_t ahrs;
            // ahrs.imu = imu;

            ahrs.m.x = data.x;
            ahrs.m.y = data.y;
            ahrs.m.z = data.z;

            ESP_LOGI(TAG, "Magnetic data: X:%.2f mG, Y:%.2f mG, Z:%.2f mG", ahrs.m.x, ahrs.m.y, ahrs.m.z);
        }
        else
        {
            ESP_LOGI(TAG, "Could not read QMC5883L data");
        }

        vTaskDelay(pdMS_TO_TICKS(250));
    }
}
//----------------------------------------------------------------------
void qmc5883l_test_start(const int cpuId)
{
    xTaskCreatePinnedToCore(qmc5883l_test, "qmc5883l_test", configMINIMAL_STACK_SIZE * 4, NULL, 5, NULL, cpuId);
}