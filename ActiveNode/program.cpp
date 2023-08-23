#include <string>

#include <stdio.h>
#include "pico/stdlib.h"

#include "StateMachine/StateMachine.h"
#include "StateMachine/States/StatusState.h"

#define CHECK_SOIL "CHECK_SOIL" 
#define CHECK_WATER "CHECK_WATER" 

int main()
{
    StateMachine _taskFSM;

    StatusState  soilState(CHECK_SOIL, 15, 100, 500);
    //soilState.setTrueState(CHECK_WATER);
    _taskFSM.add(soilState);

    _taskFSM.setIdleStateID(CHECK_SOIL);
    _taskFSM.changeState(CHECK_SOIL);

    //StatusState  waterState(CHECK_WATER, 25, 100, 500);
    //_taskFSM.add(waterState);

    // Testing FSM
    /* std::cout << "Green Moise Active Node\n=======================\n\n";
    std::cout << "States Count: " << _taskFSM.count() << "\n";

    for(auto stat : _taskFSM)
    {
        std::cout << stat.second.getStateID();
    }

    std::cout << "\n";
    std::cout << "Test: " << _taskFSM["Nada"]->getStateID() << "\n";
    */

    stdio_init_all();
    printf("Green Moise Active Node\n=======================\n\n");
    printf("States Count: " + _taskFSM.count());
    printf("\n");


    for(auto stat : _taskFSM)
    {
        printf(stat.second.getStateID().c_str());
        printf("\n");
    }

    printf("\n");

    while (true) // this for windows testing (!(GetKeyState('Q') & 0x8000))
    {
        _taskFSM.Update();
    }

    return 0;
}