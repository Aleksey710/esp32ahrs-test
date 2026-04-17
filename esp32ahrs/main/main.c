#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "esp_log.h"
#include "nvs_flash.h"

#include "fs.h"

#include "print_task_list.h"
#include "wifi.h"
#include "webserver.h"
#include "i2c.h"

#include "ws_msg.h"
#include "ws_msg_ringbuf.h"

// #include "processing_task.h"
//----------------------------------------------------------------------
#include <mpu6050.h>
#include "mpu6050_test.h"

#include <qmc5883l.h>
#include "qmc5883l_test.h"

// #include <adxl345.h>
// #include "adxl345_test.h"

#include "bluetooth.h"
//----------------------------------------------------------------------
QueueHandle_t i2c_queue;

static const char *TAG = "MAIN ";
//----------------------------------------------------------------------
void app_main(void)
{
    ESP_LOGI(TAG, "************************************************************************");
    ESP_LOGI(TAG, "***                    START                                         ***");
    ESP_LOGI(TAG, "************************************************************************");
    //------------------------------------------------------------------
    // Очередь для передачи данных между задачами
    // перейти на ring buffer / stream buffer(лучше для телеметрии)
    i2c_queue = xQueueCreate(10, sizeof(int));

    ws_msg_queue_setup();

    ws_msg_ringbuf_setup();

    //------------------------------------------------------------------
    // Без него не работает Bt, WiFi и fs
    ESP_ERROR_CHECK(nvs_flash_init());
    //------------------------------------------------------------------
    int cpuId;
    //------------------------------------------------------------------
    // --- CORE 0 ---
    cpuId = 0;

    ESP_LOGI(TAG, "CORE %d initing", cpuId);

    //------------------
    littlefs_init(); //
    // spiffs_init(); //
    //------------------

    wifi_init();

    ble_init(cpuId);

    start_webserver(cpuId);

    //     xTaskCreatePinnedToCore(webserver_task, "webserver_task", 8192, NULL, 5, NULL, 0);
    // xTaskCreatePinnedToCore(ws_server_task, "ws_task", 8192, NULL, 5, NULL, 0);

    //------------------------------------------------------------------
    // --- CORE 1 ---
    cpuId = 1;
    ESP_LOGI(TAG, "CORE %d initing", cpuId);

    // i2c_init(cpuId);
    /*
    xTaskCreatePinnedToCore(i2c_task, "i2c_task", 4096, (void*)i2c_queue, 6, NULL, 1);
    xTaskCreatePinnedToCore(processing_task, "processing_task", 4096, (void*)i2c_queue, 5, NULL, 1);
    */
    //------------------------------------------------------------------
    // mpu6050_test
    mpu6050_test_start(cpuId);

    // qmc5883l_test_start(cpuId);

    // adxl345_test_start(cpuId);

    //------------------------------------------------------------------
    // print_task_list_task_start(cpuId);
    //------------------------------------------------------------------
}
//----------------------------------------------------------------------
