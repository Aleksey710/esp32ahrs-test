#ifndef BLUETOOTHE_H
#define BLUETOOTHE_H
//----------------------------------------------------------------------
#include <inttypes.h>

#include <stdio.h>
#include <string.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

#include "esp_system.h"
#include "esp_log.h"

//----------------------------------------------------------------------

//----------------------------------------------------------------------
void ble_init(const int cpuId);
//----------------------------------------------------------------------
#endif // BLUETOOTHE_H
