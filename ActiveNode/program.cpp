#include <iostream>
#include <string>
#include <windows.h>
#include "StateMachine/StateMachine.h"
#include "StateMachine/States/ReadingSoilPinState.h"

int main()
{
    StateMachine _taskFSM;

    ReadingSoilPinState  newState("Nada Mohammad baba afafi");

    _taskFSM.add(newState);
    _taskFSM.add(ReadingSoilPinState("Maya Mohammad baba afafi"));
    _taskFSM.add(ReadingSoilPinState("Maya"));
    _taskFSM.add(ReadingSoilPinState("Nada"));

    std::cout << "Green Moise Active Node\n=======================\n\n";
    std::cout << "States Count: " << _taskFSM.count() << "\n";

    for(const auto& key : _taskFSM.getKeys())
    {
        std::cout << "Key: " << key << "\n";
    }
    /*
    for(auto stat : _taskFSM)
    {
        std::cout << stat.second.getStateID();
    }
    */
    std::cout << "\n";
    std::cout << "Test: " << _taskFSM["Nada"]->getStateID() << "\n";

    while (!(GetKeyState('Q') & 0x8000))
    {
        _taskFSM.Update();
    }

    return 0;
}