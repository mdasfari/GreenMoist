#include "ActionState.h"

ActionState::ActionState(std::string stateID) : State(stateID)
{
    
}

ActionState::~ActionState()
{

}


void ActionState::Enter()
{
    State::Enter();
}

void ActionState::Exit()
{
    State::Exit();
}

void ActionState::Update()
{
    State::Update();
}