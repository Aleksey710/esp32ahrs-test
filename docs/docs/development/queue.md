ВАЖНО

👉 ты передаёшь копию структуры, не указатель
&data   // правильно

⏱ Варианты таймаута
1. Блокироваться пока не отправится
xQueueSend(ws_queue, &data, portMAX_DELAY);
2. Не блокироваться (реалтайм)
xQueueSend(ws_queue, &data, 0);

👉 если очередь полная → данные потеряются

3. С таймаутом
xQueueSend(ws_queue, &data, pdMS_TO_TICKS(10));

⚡ ДЛЯ ISR (если из прерывания)
BaseType_t xHigherPriorityTaskWoken = pdFALSE;
xQueueSendFromISR(ws_queue, &data, &xHigherPriorityTaskWoken);
portYIELD_FROM_ISR(xHigherPriorityTaskWoken);

💥 ТИПИЧНЫЕ ОШИБКИ
❌ ошибка 1 — отправка указателя
xQueueSend(ws_queue, data, ...)   // ❌
❌ ошибка 2 — mismatch размера

Если очередь создана не так:
xQueueCreate(10, sizeof(pointer))   // ❌

❌ ошибка 3 — очередь не создана
Проверь:

if (!ws_queue) {
    ESP_LOGE(TAG, "Queue not created!");
}
