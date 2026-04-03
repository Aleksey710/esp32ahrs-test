#include "ws_msg.h"

#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"

#include "esp_log.h"

#include "ws_msg_ringbuf.h"
//----------------------------------------------------------------------
void ws_msg_queue_setup(void)
{
    ws_msg_queue = xQueueCreate(10, sizeof(Ws_msg_t));
    // ws_queue = xQueueCreate(10, sizeof(mpu_data_t));
}
//----------------------------------------------------------------------