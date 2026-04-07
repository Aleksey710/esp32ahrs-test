cmake_minimum_required(VERSION 3.5)
include($ENV{IDF_PATH}/tools/cmake/project.cmake)

set(EXTRA_COMPONENT_DIRS "")  # очистить на всякий случай

list(APPEND EXTRA_COMPONENT_DIRS
    ${CMAKE_SOURCE_DIR}/components/esp_littlefs
    ${CMAKE_SOURCE_DIR}/components/esp-idf-lib
    #${CMAKE_SOURCE_DIR}/components/esp-cpp/espp/adxl345
    ${CMAKE_SOURCE_DIR}/components/drivers
)

# set(EXTRA_COMPONENT_DIRS
#     ${CMAKE_SOURCE_DIR}/components/esp_littlefs
#     ${CMAKE_SOURCE_DIR}/components/esp-idf-lib
#     ${CMAKE_SOURCE_DIR}/components/esp-cpp/espp/adxl345
#     ${CMAKE_SOURCE_DIR}/components/drivers
# )

project(esp32ahrs)
