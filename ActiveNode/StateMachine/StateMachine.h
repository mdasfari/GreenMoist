#pragma once
#include <map>
#include <string>
#include <vector>
#include "Base/State.h"

class StateMachine 
{
private:
	std::map<std::string, State> _allStates;
	std::string _currentStateID;

public:
	StateMachine();
	~StateMachine();

	// Map functions 
	void add(State state);
	void remove(std::string stateID);
	void clear();

	std::vector<std::string> getKeys();

	std::map<std::string, State>::iterator begin();
	std::map<std::string, State>::iterator end();

	size_t count();
	bool isEmpty();

	// State Getter and Setter
	void changeState(std::string newStateID);
	std::string getCurrentStateID();
	State getCurrentState();

	void Update();

	// Operator
	State* operator[] (const std::string key);
};

