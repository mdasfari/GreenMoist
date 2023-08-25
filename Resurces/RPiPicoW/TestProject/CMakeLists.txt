cmake_minimum_required(VERSION 3.13)
include(pico_sdk_import.cmake)
project(picow_blink C CXX ASM)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

pico_sdk_init()

add_executable(picow_blink
                picow_blink.c)

pico_enable_stdio_usb(picow_blink 1)
pico_enable_stdio_uart(picow_blink 1)
pico_add_extra_outputs(picow_blink)

target_link_libraries(picow_blink
                pico_stdlib              # for core functionality
                # pico_cyw43_arch_none     # we need Wifi to access the GPIO, but we don't need anything else
                )
