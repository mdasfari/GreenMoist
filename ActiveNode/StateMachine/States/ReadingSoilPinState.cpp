#include "ReadingSoilPinState.h"

ReadingSoilPinState::ReadingSoilPinState(std::string stateID) : State(stateID)
{
}

ReadingSoilPinState ::~ReadingSoilPinState()
{

}


void ReadingSoilPinState::Enter()
{
    State::Enter();
}

void ReadingSoilPinState::Exit()
{
    State::Exit();
}

void ReadingSoilPinState::Update()
{
    State::Update();
}