idf_component_register(
    SRCS 
        "QMC5883.c"
        "qmc5883l_test.c"

    INCLUDE_DIRS
        "include" 

    REQUIRES 
        freertos
        driver

        config
        data
        i2c
        qmc5883l

)
   
