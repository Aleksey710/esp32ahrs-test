#ifndef ADXL345_TEST_H
#define ADXL345_TEST_H
//----------------------------------------------------------------------
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
//----------------------------------------------------------------------

void adxl345_test(void *pvParameters);
void adxl345_test_start(const int cpuid);
//----------------------------------------------------------------------
#endif // ADXL345_TEST_H
