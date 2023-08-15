#pragma once
#include "../Base/State.h"
class ReadingSoilPinState :
    public State
{
public:
    ReadingSoilPinState(std::string stateID);
    ~ReadingSoilPinState();
    void virtual Enter();
    void virtual Exit();
    void virtual Update();
};

