#ifndef MPU6050_TEST_H
#define MPU6050_TEST_H
//----------------------------------------------------------------------
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
//----------------------------------------------------------------------

void mpu6050_test(void *pvParameters);
void mpu6050_test_start(const int cpuid);
//----------------------------------------------------------------------
#endif // MPU6050_TEST_H
