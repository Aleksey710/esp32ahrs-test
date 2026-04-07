#ifndef QMC5883L_TEST_H
#define QMC5883L_TEST_H
//----------------------------------------------------------------------
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
//----------------------------------------------------------------------

void qmc5883l_test(void *pvParameters);

void qmc5883l_test_start(const int cpuId);
//----------------------------------------------------------------------
#endif // QMC5883L_TEST_H
