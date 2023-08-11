#pragma once
#include "../Base/State.h"
class ReadingSoilPinState :
    public State
{

public:
    ReadingSoilPinState();
    ~ReadingSoilPinState();
    void virtual Enter();
    void virtual Exit();
    void virtual Update();
};

