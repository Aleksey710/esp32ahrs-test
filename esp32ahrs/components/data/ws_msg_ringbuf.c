#include "ws_msg_ringbuf.h"

#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/ringbuf.h"

#include "esp_log.h"
#include "esp_err.h"

//----------------------------------------------------------------------
#define TAG "WS_RINGBUF"
//----------------------------------------------------------------------
RingbufHandle_t ws_msg_ringbuf = NULL;

static uint8_t ws_msg_ringbuf_storage[WS_MSG_RINGBUF_SIZE_ALIGNED];
static StaticRingbuffer_t ws_msg_ringbuf_struct;
//----------------------------------------------------------------------

static Ws_msg_t ws_msg_pool[WS_MSG_RINGBUF_ITEMS];
static bool ws_msg_pool_used[WS_MSG_RINGBUF_ITEMS];
//----------------------------------------------------------------------
Ws_msg_t *alloc_ws_msg(void)
{
    Ws_msg_t *msg = NULL;

    for (int i = 0; i < WS_MSG_RINGBUF_ITEMS; i++)
    {
        if (!ws_msg_pool_used[i])
        {
            ws_msg_pool_used[i] = true;
            msg = &ws_msg_pool[i];
            break;
        }
    }

    if (!msg)
    {
        ESP_LOGE(TAG, "Pool empty");
    }

    return msg;
}
//----------------------------------------------------------------------
void free_ws_msg(Ws_msg_t *msg)
{
    int index = msg - ws_msg_pool;
    ws_msg_pool_used[index] = false;
}
//----------------------------------------------------------------------
void ws_msg_ringbuf_setup(void)
{
    // ws_msg_ringbuf = xRingbufferCreate(
    //     2048,
    //     RINGBUF_TYPE_NOSPLIT);

    ws_msg_ringbuf = xRingbufferCreateStatic(
        WS_MSG_RINGBUF_SIZE_ALIGNED,
        RINGBUF_TYPE_NOSPLIT,
        ws_msg_ringbuf_storage,
        &ws_msg_ringbuf_struct);

    if (!ws_msg_ringbuf)
    {
        ESP_LOGE(TAG, "Failed to create ringbuffer");
    }
}
//----------------------------------------------------------------------
