#pragma once
#include "../Base/State.h"

typedef int pinValue;

class StatusState :
    public State
{
private:
    // Variables
    pinValue _pinValue;
    // Threshold
	pinValue _thresholdLow;
	pinValue _thresholdHigh;

public:
    StatusState(std::string stateID, int monitorPin, pinValue thresholdLow, pinValue thresholdHigh);
    ~StatusState();
    void virtual Setup();
    void virtual Enter();
    void virtual Exit();
    void virtual Update();
    void virtual Record();
};

