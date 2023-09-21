import gmClasses as gmc


filename = 'app.cfg'
appConfig = gmc.AppConfiguration(filename)

while not appConfig.readConfigurationFile():
    # the configuration file is missing,
    # run BLE to connect to the server
    appConfig.ble_BroadcastDevice()

(nc,err) = appConfig.connect(0, 3)

if nc.status() != 3:
    raise RuntimeError('network connection failed')
else:
    print('connected')
    status = nc.ifconfig()
    print( 'ip = ' + status[0] )

filename = 'task.cfg'
tsk = gmc.NodeTask(filename, appConfig.Host, appConfig.Device)
if not tsk:
    print("Error Unable to continue, Task file is not available")
    while True:
        pass

#   ProcessID, TaskID, ProcessSerial, ProcessType, Name
# , Pin, PinType, SerialOutRawData, BroadcastValue, ThresholdLow, ThresholdHigh
# , TrueProcessType, TrueProcessID, TrueDebugMessage
# , FalseProcessType, FalseProcessID, FalseDebugMessage
# , ActionType
#while True:

maxWait = 3
processID = tsk.getFirstProcessID()
NumberOfProcesses = len(tsk.Processes)
outcome: gmc.ProcessOutcome = None
print(f"Task {tsk.Name} ({tsk.TaskID}) Started")
while processID != -1:
    # process = tsk.Processes[processID]
    print(f"Running Process: {tsk.Processes[processID].Name}")
    # A single process start here, depending on the type the execution will run
    # The infinit loop in case of loop required
    tsk.Processes[processID].initPin()
    while True:
        # One of the process type will hapeand
        # First one Status
        outcome = tsk.Processes[processID].Run(outcome)
        
        if(outcome):
            # print all information to debug session
            if outcome.SerialOutRawData:
                print(f"Process Pin:{tsk.Processes[processID].Pin} raw value: {outcome.Value}")
            
            # processing the outcome of the process already executed
            if outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.Loop:
                continue
            elif outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.NextProcess:
                processID = processID + 1
            elif outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.GoToProcessSerial:
                processID = tsk.getProcessByProcessSerial(outcome.NextProcessSerial)
            elif outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.Exit:
                pass
        else:
            maxWait = maxWait - 1
        
        if maxWait == -1:
            break
        
        if processID > NumberOfProcesses - 1:
            processID = 0
    
    if not outcome or outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.Exit:
        break
    
    # Check if any waiting instruction on the queue
    if (len(appConfig.ExecuteQueue) > 0):
        # Execute the waiting instruction
        pass    

print(f"Task {tsk.Name} ({tsk.TaskID}) Finished")
    
    
    