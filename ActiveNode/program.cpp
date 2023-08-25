#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "hardware/adc.h"


int main() {
    stdio_init_all();

    printf("ADC Reading GPIO15\n");
    
    adc_init();

    // Make sure GPIO is high-impedance, no pullups etc
    adc_gpio_init(15); //State::getPinNumber()
    // Select ADC input 0 (GPIO15)
    adc_select_input(0);

    while(true)
    {
        const float conversion_factor = 3.3f / (1 << 12);
        uint16_t result = adc_read();
        printf("Raw value: 0x%03x, voltage: %f V\n", result, result * conversion_factor);
        sleep_ms(500);
    }
}