#include "StateMachine.h"

StateMachine::StateMachine() 
{
    _allStates.clear();
}

StateMachine::~StateMachine()
{

}

void StateMachine::add(State state)
{
    _allStates.insert({state.getStateID(), state});
}

void StateMachine::remove(std::string stateID)
{
    _allStates.erase(stateID);
}

void StateMachine::clear()
{
    _allStates.clear();
}

std::map<std::string, State>::iterator StateMachine::begin()
{
    return _allStates.begin();
}

std::map<std::string, State>::iterator StateMachine::end()
{
    return _allStates.end();
}

size_t StateMachine::count()
{
    return _allStates.size();
}

bool StateMachine::isEmpty()
{
    return _allStates.empty();
}

// State Getter and Setter
void StateMachine::changeState(std::string newStateID)
{
    State* currentState = &_allStates[_currentStateID];
    State* newState = &_allStates[newStateID];

    //_allStates[_currentStateID].Exit();
    //_allStates[newStateID].Enter();

    currentState->Exit();
    newState->Enter();

    _currentStateID = newStateID;
}

std::string StateMachine::getCurrentStateID()
{
    return _currentStateID;
}

State StateMachine::getCurrentState()
{
    return _allStates[_currentStateID];
}

void StateMachine::Update()
{
    _allStates[_currentStateID].Update();
}

State* StateMachine::operator[] (const std::string key)
{
    if(_allStates.find(key) != _allStates.end())
        return &_allStates[key];
    else
        return nullptr;
}

std::vector<std::string> StateMachine::getKeys()
{
    std::vector<std::string> keys;

    for (const auto& state : _allStates)
        keys.push_back(state.first);

    return keys;
}