#pragma once
#include <map>
#include <string>
#include "State.h"

class StateMachine
{
private:
	std::map<std::string, State> _allStates;

public:
	StateMachine();
	~StateMachine();
};

