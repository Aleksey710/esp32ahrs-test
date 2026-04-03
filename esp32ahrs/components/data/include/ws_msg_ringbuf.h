#ifndef WS_MSG_RINGBUF_H
#define WS_MSG_RINGBUF_H
//----------------------------------------------------------------------
#include <inttypes.h>

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
typedef struct
{
    int id;
    // Ws_msg_data_t data;
    //---------------
    char str[WS_RINGBUF_MAX_DATA_SIZE];
    size_t len;
} Ws_msg_t;
//----------------------------------------------------------------------

extern RingbufHandle_t ws_msg_ringbuf;

//----------------------------------------------------------------------
Ws_msg_t *alloc_ws_msg(void);
void free_ws_msg(Ws_msg_t *msg);
void ws_msg_ringbuf_setup(void);
//----------------------------------------------------------------------
#endif // WS_MSG_RINGBUF_H
