#ifndef WS_MSG_H
#define WS_MSG_H
//----------------------------------------------------------------------
#include <inttypes.h>

#include "freertos/FreeRTOS.h" // ВСЕГДА ПЕРВЫЙ
#include "freertos/queue.h"
#include "freertos/task.h"
#include "freertos/ringbuf.h"
#include "freertos/semphr.h"

#include "config.h"
//----------------------------------------------------------------------
// typedef struct
// {
//     char data[WS_RINGBUF_MAX_DATA_SIZE];
//     size_t len;
// } Ws_msg_data_t;
//----------------------------------------------------------------------
static QueueHandle_t ws_msg_queue;
//----------------------------------------------------------------------
typedef struct
{
    // int16_t ax, ay, az;
    float ax, ay, az;

    // int16_t gx, gy, gz;
    float gx, gy, gz;
    //
    // int16_t x, y, z;
    float x, y, z;

    // int16_t roll, pitch, yaw;
    float roll, pitch, yaw;

    // при форматировании не более 12 аргументов. Этот 13й
    //  uint64_t timestamp;

    // Use the correct format specifier macro :
    // For int64_t(signed), use % " PRId64 ".
    // For uint64_t(unsigned), use % " PRIu64 ".

    // % f
    // % lf // (в printf НЕ нужен, это для scanf)
    // % Lf // long double

} mpu_data_t;

// typedef struct
// {
//     const char *str;
//     size_t len;
// } Ws_msg_t;
//----------------------------------------------------------------------
void ws_msg_queue_setup(void);

//----------------------------------------------------------------------
#endif // WS_MSG_H
