#include "i2c.h"

#include <string.h>
#include <stdlib.h>
#include <inttypes.h>

#include "esp_log.h"

// форматирование float для JSON
// #define FMT_F "%.2f"
//----------------------------------------------------------------------
void i2c_master_init(void)
{

    // xTaskCreatePinnedToCore(i2c_task, "i2c_task", 4096, (void *)i2c_queue, 6, NULL, 1);
}
//----------------------------------------------------------------------
