### MPU6050

https://components.espressif.com/components/espressif/mpu6050/versions/1.2.1/readme
https://github.com/espressif/esp-bsp/blob/master/examples/display_sensors/main/main.c


https://components.espressif.com/components/esp-idf-lib/mpu6050/versions/2.1.3/examples/default?language=
https://github.com/esp-idf-lib/mpu6050
https://github.com/esp-idf-lib/mpu6050/blob/main/examples/default/main/main.c




# Example for `mpu6050` driver

## What it does

This example initializes an MPU-6050 connected on the I2C bus and then displays the accelerometer and gyroscope data in gravity and degrees per second in an endless loop.

**NOTE:**
Example is tested on ESP-IDF v4.4, v5.1 and ESP32 Wrover Module

## Wiring

Connect `SCL` and `SDA` pins to the following pins with appropriate pull-up
resistors.

| Name                                    | Description           | Defaults   |
| --------------------------------------- | --------------------- | ---------- |
| `CONFIG_EXAMPLE_MPU6050_I2C_MASTER_SCL` | GPIO number for `SCL` | `esp32` 22 |
| `CONFIG_EXAMPLE_MPU6050_I2C_MASTER_SDA` | GPIO number for `SDA` | `esp32` 21 |
| `CONFIG_EXAMPLE_MPU6050_I2C_CLOCK_HZ`   | I2C Clock Freq        | 100000     |


## Logs

```
I (316) cpu_start: Starting scheduler on PRO CPU.
I (0) cpu_start: Starting scheduler on APP CPU.
I (0) mpu6050_test: mpu6050 config: addr 0x68, sda 21, scl 22, clk, 100000 port 1
I (4341) mpu6050_test: mpu6050 connection successfull.
I (4341) mpu6050_test: **********************************************************************
I (4341) mpu6050_test: Rotation:     x=-246   y=-356   z=-52
I (4351) mpu6050_test: Acceleration: x=-16016   y=-644   z=-784
I (4351) mpu6050_test: Temperature:    33
I (5361) mpu6050_test: **********************************************************************
