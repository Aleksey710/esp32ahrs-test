#ifndef CONFIG_H
#define CONFIG_H
//----------------------------------------------------------------------
#include <inttypes.h>

#include "config_fs.h"
#include "config_i2c.h"
#include "config_wifi.h"
#include "config_bluetooth.h"

//----------------------------------------------------------------------
#define VERSION "2026-03"
//----------------------------------------------------------------------
// форматирование float для JSON
#define FMT_F "%.4f"

//----------------------------------------------------------------------
#define WS_RINGBUF_MAX_DATA_SIZE 256

#define WS_MSG_RINGBUF_ITEMS 16

#define WS_MSG_RINGBUF_SIZE (WS_MSG_RINGBUF_ITEMS * sizeof(Ws_msg_t *))
// Выравнивание
#define WS_MSG_RINGBUF_SIZE_ALIGNED ((WS_MSG_RINGBUF_SIZE + 3) & ~3)
//----------------------------------------------------------------------
#endif // CONFIG_H
