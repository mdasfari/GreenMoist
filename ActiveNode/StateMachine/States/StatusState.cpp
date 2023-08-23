#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "hardware/adc.h"
#include "StatusState.h"

StatusState::StatusState(std::string stateID, int monitorPin, pinValue thresholdLow, pinValue thresholdHigh) : State(stateID)
{
    State::setPinNumber(monitorPin);
    _thresholdLow = thresholdLow;
    _thresholdHigh = thresholdHigh;
}

StatusState::~StatusState()
{

}

void StatusState::Setup()
{
    _stateConditionValue = false;

    printf("ADC Example, measuring GPIO26\n");

    adc_init();

    // Make sure GPIO is high-impedance, no pullups etc
    adc_gpio_init(15); //State::getPinNumber()
    // Select ADC input 0 (GPIO26)
    adc_select_input(0);
}

void StatusState::Enter()
{
    State::Enter();
}

void StatusState::Exit()
{
    State::Exit();
}

void StatusState::Update()
{
    State::Update();
    
    
    //while (1) {
        // 12-bit conversion, assume max value == ADC_VREF == 3.3 V
        const float conversion_factor = 3.3f / (1 << 12);
        uint16_t result = adc_read();
        printf("Raw value: 0x%03x, voltage: %f V\n", result, result * conversion_factor);
        sleep_ms(500);
    //}


    // Read Pin Value
    /*_stateConditionValue = (_thresholdLow >= _pinValue && _thresholdHigh <= _pinValue);
    if(_stateConditionValue)
        _stateChanged = true;
    */
}

void StatusState::Record()
{

}