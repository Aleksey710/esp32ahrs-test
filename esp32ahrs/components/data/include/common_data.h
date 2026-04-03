#ifndef COMMON_DATA_H
#define COMMON_DATA_H
//----------------------------------------------------------------------
#include <inttypes.h>

#include "config.h"
//----------------------------------------------------------------------
// ESP32 имеет аппаратный FPU только для float(32 - bit)
// float → работает на аппаратуре(быстро)
// double → считается программно(медленно)
//----------------------------------------------------------------------
// #define GYROSCOPE_DATA_TYPE int16_t
#define GYROSCOPE_DATA_TYPE float
// #define GYROSCOPE_DATA_TYPE double
//----------------------------------------------------------------------
// #define ACCELEROMETER_DATA_TYPE int16_t
#define ACCELEROMETER_DATA_TYPE float
// #define ACCELEROMETER_DATA_TYPE double
//----------------------------------------------------------------------
// #define MAGNETOMETER_DATA_TYPE int16_t
#define MAGNETOMETER_DATA_TYPE float
// #define MAGNETOMETER_DATA_TYPE double
//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
#endif // COMMON_DATA_H
