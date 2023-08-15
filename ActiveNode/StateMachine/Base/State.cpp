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

void State::Setup()
{

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