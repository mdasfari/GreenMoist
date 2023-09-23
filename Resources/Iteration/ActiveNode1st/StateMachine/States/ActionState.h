#pragma once
#include "../Base/State.h"
class ActionState :
    public State
{
public:
    ActionState(std::string stateID);
    ~ActionState();
    void virtual Enter();
    void virtual Exit();
    void virtual Update();
};

