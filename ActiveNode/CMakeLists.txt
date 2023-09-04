cmake_minimum_required(VERSION 3.13)

include(../pico_sdk_import.cmake)

project(ActiveNode C CXX ASM)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

pico_sdk_init()

add_executable(ActiveNode 
                program.cpp)

pico_enable_stdio_usb(ActiveNode 1)
pico_enable_stdio_uart(ActiveNode 1)

# create map/bin/hex/uf2 file etc.
# ${CMAKE_PROJECT_NAME}
pico_add_extra_outputs(ActiveNode)

# include Directories
include_directories(./)

# pull in common dependencies
target_link_libraries(ActiveNode pico_stdlib hardware_adc pico_cyw43_arch_lwip_threadsafe_background)