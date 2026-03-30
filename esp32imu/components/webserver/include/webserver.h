
#ifndef WEBSERVER_H
#define WEBSERVER_H
//----------------------------------------------------------------------
#include "freertos/FreeRTOS.h" // ВСЕГДА ПЕРВЫЙ
#include "freertos/queue.h"
#include "freertos/task.h"

//----------------------------------------------------------------------
static QueueHandle_t ws_queue;

typedef struct
{
    int16_t ax, ay, az;
    int16_t gx, gy, gz;
    //
    int16_t x, y, z;
    int16_t roll, pitch, yaw;

    int64_t timestamp;

} mpu_data_t;

//----------------------------------------------------------------------
void start_webserver(QueueHandle_t queue);
//----------------------------------------------------------------------
#endif // WEBSERVER_H