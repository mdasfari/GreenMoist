#include "State.h"


State::State()
{
}


State::State(std::string stateID) : _stateID(stateID)
{
}

State::~State()
{

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
	_stateChanged = false;
}

void State::Enter()
{
	
}

void State::Exit()
{

}

void State::Update()
{

}

void State::Record()
{

}

bool State::IsStateChanged()
{
	return _stateChanged;
}

bool State::getConditionStatus()
{
	return _stateConditionValue;
}