idf_component_register(
    SRCS 
        #"ADXL345.c"
        #"adxl345_test.c"

    INCLUDE_DIRS
        "include" 

    REQUIRES 
        freertos
        driver

        config
        data
        i2c
        #adxl345

)
   
