import gmClasses as gmc

from machine import Pin

filename = 'app.cfg'
appConfig = gmc.AppConfiguration(filename)
(nc,err) = appConfig.connect(0, 3)

if nc.status() != 3:
    raise RuntimeError('network connection failed')
else:
    print('connected')
    status = nc.ifconfig()
    print( 'ip = ' + status[0] )

filename = 'task.cfg'
tsk = gmc.NodeTask(filename)
if not tsk:
    print("Error Unable to continue, Task file is not available")

#   ProcessID, TaskID, ProcessSerial, ProcessType, Name
# , Pin, PinType, SerialOutRawData, BroadcastValue, ThresholdLow, ThresholdHigh
# , TrueProcessType, TrueProcessID, TrueDebugMessage
# , FalseProcessType, FalseProcessID, FalseDebugMessage
# , ActionType
#while True:

NumberOfProcesses = len(tsk.Processes)
processID = 0
runningValue = None

while processID != -1:
    print('Task Started')
    process = gmc.TaskProcess(tsk.Processes[processID])
    
    if process.ProcessType == gmc.ProcessType.Status:
        process.initPin()
        runningValue = process.readPinRawValue()
    else:
        pass

    if process.SerialOutRawData:
        print(runningValue)
    
    
    

    processID = processID + 1
    if processID >= NumberOfProcesses:
        processID = -1
        
    print('Task Finished')  

