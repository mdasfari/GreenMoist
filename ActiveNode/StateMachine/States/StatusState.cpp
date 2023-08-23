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

    // Read Pin Value
    _stateConditionValue = (_thresholdLow >= _pinValue && _thresholdHigh <= _pinValue);
    if(_stateConditionValue)
        _stateChanged = true;
}

void StatusState::Record()
{

}