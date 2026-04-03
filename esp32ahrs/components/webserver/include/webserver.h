#ifndef WEBSERVER_H
#define WEBSERVER_H
//----------------------------------------------------------------------
#include <inttypes.h>

#include "freertos/FreeRTOS.h" // ВСЕГДА ПЕРВЫЙ
#include "freertos/queue.h"
#include "freertos/task.h"

#include "ws_msg.h"
//----------------------------------------------------------------------

//----------------------------------------------------------------------
void start_webserver(const int cpuid);
//----------------------------------------------------------------------
#endif // WEBSERVER_H