#pragma once
#include <string>

class State
{
private:
	std::string _stateID;
	int _pinNumber;

	// State Condition Control
	std::string _trueState;
	std::string _falseState;

protected:
	// Internal variables
	void setPinNumber(int pin);
	bool _stateChanged;
	bool _stateConditionValue;
public:
	State();
	State(std::string stateID);
	~State();
	std::string getStateID();
	int getPinNumber();
	// void setStateID(std::string value);
	bool getConditionStatus();

	// Next State
	std::string getTrueState();
	void setTrueState(std::string trueState);
	std::string getFalseState();
	void setFalseState(std::string falseState);

	// Vertual Functions
	void virtual Setup();
	void virtual Enter();
	void virtual Exit();
	void virtual Update();
	void virtual Record();
	bool virtual IsStateChanged();
};

