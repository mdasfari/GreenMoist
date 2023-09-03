#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "hardware/adc.h"

#define ADC_NUM 0
#define ADC_PIN (26 + ADC_NUM)
#define ADC_VREF 3.3
#define ADC_RANGE (1 << 12)
#define ADC_CONVERT (ADC_VREF / (ADC_RANGE - 1))

const uint SOIL_LEVEL_PIN = 26;
const uint WATER_LEVEL_PIN = 27;

const uint WATER_PUMP = 15;


int main() {
    stdio_init_all();

    
    
    adc_init();
    
    gpio_init(WATER_PUMP);
    gpio_set_dir(WATER_PUMP, GPIO_OUT);


    // Make sure GPIO is high-impedance, no pullups etc
    // Water Level Pin
    adc_gpio_init(WATER_LEVEL_PIN); //State::getPinNumber()
    // Soil Moisture Level Pin
    adc_gpio_init(SOIL_LEVEL_PIN); //State::getPinNumber()

    uint analogReadPin {0};
    uint gpoPin {0};

    sleep_ms(2000);

    printf("ADC Reading GPIO15\n");
    printf("GPO\tRaw value\tHex value\tVoltage\n");

    while(true)
    {
        gpoPin = 26 + analogReadPin;

        // Select ADC input 0 (GPIO26) or higher
        adc_select_input(analogReadPin);

        const float conversion_factor = 3.3f / (1 << 12);
        uint16_t result = adc_read();

        // printf("GPO: %d Raw value: %d, Hex value: 0x%03x, voltage: %f V\n", gpoPin, result, result, result * conversion_factor);
        printf("%d\t%d\t0x%03x\t%f\n", gpoPin, result, result, result * conversion_factor);
        sleep_ms(500);

        if (result >= 2800 && result <= 3500)
        {
            adc_select_input(1);
            result = adc_read();

            if (result >= 1800 && result <= 3000)
            {
                gpio_put(WATER_PUMP, 1);
            } 
            else 
            {
                gpio_put(WATER_PUMP, 0);
                printf("Water Tank Empty\n");
            }
        } else 
        {
            gpio_put(WATER_PUMP, 0);
        }

/*
        ++analogReadPin;

        if (analogReadPin > 3)
            analogReadPin = 0;
*/
    }
}