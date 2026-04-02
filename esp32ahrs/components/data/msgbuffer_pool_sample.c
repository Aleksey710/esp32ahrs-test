#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/message_buffer.h"
#include <string.h>
#include <stdio.h>

//----------------------------------------------------------------------
#define POOL_SIZE 10
#define MAX_DATA_SIZE 64

typedef struct {
    int id;
    int len;
    char data[MAX_DATA_SIZE];
} Message_t;

//----------------------------------------------------------------------
static Message_t pool[POOL_SIZE];
static bool used[POOL_SIZE];

static MessageBufferHandle_t msgbuf;

//----------------------------------------------------------------------
// simple allocator (оставляем как есть)
Message_t* alloc_msg(void)
{
    for (int i = 0; i < POOL_SIZE; i++) {
        if (!used[i]) {
            used[i] = true;
            return &pool[i];
        }
    }
    return NULL;
}

//----------------------------------------------------------------------
void free_msg(Message_t *msg)
{
    int index = msg - pool;
    used[index] = false;
}

//----------------------------------------------------------------------
void producer_task(void *arg)
{
    int counter = 0;

    while (1) {
        Message_t *msg = alloc_msg();

        if (!msg) {
            printf("Pool empty\n");
            vTaskDelay(pdMS_TO_TICKS(100));
            continue;
        }

        snprintf(msg->data, MAX_DATA_SIZE, "Msg #%d", counter);
        msg->id = counter;
        msg->len = strlen(msg->data) + 1;

        // 👉 отправляем САМО СООБЩЕНИЕ, а не указатель
        if (xMessageBufferSend(
                msgbuf,
                msg,
                sizeof(Message_t),
                pdMS_TO_TICKS(100)
            ) != sizeof(Message_t))
        {
            printf("Send failed\n");
            free_msg(msg);
        }
        else
        {
            printf("Sent: %s\n", msg->data);
        }

        counter++;
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

//----------------------------------------------------------------------
void consumer_task(void *arg)
{
    Message_t msg;

    while (1) {

        size_t received = xMessageBufferReceive(
            msgbuf,
            &msg,
            sizeof(msg),
            portMAX_DELAY
        );

        if (received == sizeof(Message_t)) {
            printf("Received: %s\n", msg.data);

            // после копирования можно вернуть в pool
            // (но важно: мы уже не используем указатели из буфера)
            for (int i = 0; i < POOL_SIZE; i++) {
                if (pool[i].id == msg.id) {
                    free_msg(&pool[i]);
                    break;
                }
            }
        }
    }
}

//----------------------------------------------------------------------
void app_main(void)
{
    msgbuf = xMessageBufferCreate(2048);

    if (msgbuf == NULL) {
        printf("Failed to create message buffer\n");
        return;
    }

    xTaskCreate(producer_task, "producer", 4096, NULL, 5, NULL);
    xTaskCreate(consumer_task, "consumer", 4096, NULL, 5, NULL);
}
