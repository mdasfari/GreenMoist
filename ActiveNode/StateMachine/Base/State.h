#pragma once
#include <string>

class State
{
private:
	std::string _stateID;
	int _pinNumber;

	// Threshold
	float _thresholdLow;
	float _thresholdHigh;

	// Next State
	std::string _nextState;

	// Internal variables
	bool _stateChanged;
public:
	State();
	State(std::string stateID);
	~State();
	std::string getStateID();
	int getPinNumber();
	// void setStateID(std::string value);

	// Vertual Functions
	void virtual Setup();
	void virtual Enter();
	void virtual Exit();
	void virtual Update();
	void virtual Record();
	bool virtual IsStateChanged();
};

