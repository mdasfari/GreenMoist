#include <iostream>
#include <string>
#include "StateMachine/States/ReadingSoilPinState.h"

int main()
{
    ReadingSoilPinState*  newState;

    newState =  new ReadingSoilPinState();

    newState->setStateID("Reading Temprature");


    std::cout << "Hello World!!!\n\n";

    std::cout << newState->getStateID() << "\n";
    return 0;
}