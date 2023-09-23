#include "State.h"


State::State()
{
}


State::State(std::string stateID) : _stateID(stateID)
{
#ifdef __DEBUG__
    printf("State %s Constructed\n", stateID);
#endif
}

State::~State()
{
#ifdef __DEBUG__
    printf("State %s Destructed\n", stateID);
#endif
}

void State::setPinNumber(int pin)
{
	_pinNumber = pin;
}

std::string State::getStateID()
{
	return _stateID;
}

/*
void State::setStateID(std::string value)
{
	_stateID = value;
}
*/

std::string State::getTrueState()
{
	return _trueState;
}

void State::setTrueState(std::string trueState)
{
	_trueState = trueState;
}

std::string State::getFalseState()
{
	return _falseState;
}

void State::setFalseState(std::string falseState)
{
	_falseState = falseState;
}

void State::Setup()
{
#ifdef __DEBUG__
    printf("State %s Setup called\n", _stateID);
#endif

	_stateChanged = false;
}

void State::Enter()
{
	#ifdef __DEBUG__
    printf("State %s Enter called\n", _stateID);
#endif
}

void State::Exit()
{
#ifdef __DEBUG__
    printf("State %s Exit called\n", _stateID);
#endif
}

void State::Update()
{
#ifdef __DEBUG__
    printf("State %s Update called\n", _stateID);
#endif
}

void State::Record()
{
#ifdef __DEBUG__
    printf("State %s Record called\n", _stateID);
#endif
}

bool State::IsStateChanged()
{
	return _stateChanged;
}

bool State::getConditionStatus()
{
	return _stateConditionValue;
}