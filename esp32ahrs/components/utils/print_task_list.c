#include "print_task_list.h"

//----------------------------------------------------------------------
#include "esp_log.h"
#include "nvs_flash.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

//----------------------------------------------------------------------
static const char *TAG = "FreeRTOS tasks";

//----------------------------------------------------------------------
// 	📌 Покажет:
//	сколько CPU времени съела каждая задача
//	% загрузки
static void print_run_time_stats(void)
{
	char buffer[512];

	vTaskGetRunTimeStats(buffer);

	ESP_LOGI(TAG, "%s", buffer);
}
//----------------------------------------------------------------------
static void print_free_stack(void)
{
	UBaseType_t free_stack = uxTaskGetStackHighWaterMark(NULL);

	ESP_LOGI(TAG, "Free stack: %d bytes", (free_stack * 4));
}
//----------------------------------------------------------------------
static void print_task_list(void *arg)
{
	char buffer[512];

	while (1)
	{
		vTaskList(buffer);

		ESP_LOGI(TAG, "Task Name    State   Prio   Stack   Num\n%s\n", buffer);

		vTaskDelay(pdMS_TO_TICKS(1000));
	}
}
//----------------------------------------------------------------------
void debug_task(void *arg)
{
	char buf[512];

	while (1)
	{

		ESP_LOGI(TAG, "\n=== TASK LIST ===");

		vTaskList(buf);

		ESP_LOGI(TAG, "%s\n", buf);

		ESP_LOGI(TAG, "Free heap: %lu", esp_get_free_heap_size());
		ESP_LOGI(TAG, "Min heap:  %lu", esp_get_minimum_free_heap_size());

		ESP_LOGI(TAG, "Stack BLE task: %d bytes", uxTaskGetStackHighWaterMark(NULL) * 4);

		vTaskDelay(pdMS_TO_TICKS(1000));
	}
}
//----------------------------------------------------------------------
void print_task_list_task_start(const int cpuId)
{
	// ESP_LOGI(TAG, "Connected");

	xTaskCreatePinnedToCore(print_task_list, "print_task_list", 4096, NULL, 5, NULL, cpuId);

	xTaskCreatePinnedToCore(debug_task, "debug_task", 4096, NULL, 5, NULL, cpuId);
}
//----------------------------------------------------------------------
