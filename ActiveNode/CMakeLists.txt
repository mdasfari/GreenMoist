add_executable(ActiveNode
        program.cpp
        StateMachine/StateMachine.cpp
        StateMachine/Base/State.cpp
        StateMachine/States/ActionState.cpp
        StateMachine/States/StatusState.cpp
        )

# pull in common dependencies
target_link_libraries(ActiveNode pico_stdlib hardware_adc)

# create map/bin/hex/uf2 file etc.
pico_add_extra_outputs(ActiveNode)

# add url via pico_set_program_url
example_auto_set_url(ActiveNode)