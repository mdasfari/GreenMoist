# Version 1.61
import gmClasses as gmc
import machine
import socket
import _thread
import time

### *******************************************************
### *******************************************************
### ***													***
### ***					IMPORTANT NOTE					***
### ***		 If you want to break the execution and 	***
### ***		 re-run the code again. please consider		***
### ***		 restarting the device by unpluging it		***
### ***		 from the power source. the other thread	***
### ***		 keep running in the memory even if you 	***
### ***		 interrupt the process from the execution	***
### ***													***
### *******************************************************
### *******************************************************

filename = 'app.cfg'
appConfig = gmc.AppConfiguration(filename)

while not appConfig.readConfigurationFile():
    # the configuration file is missing,
    # run BLE to connect to the server
    print("Configuration File is missing, run BLE advertisment")
    appConfig.ble_BroadcastDevice()

print("configuration loaded")
(nc,err) = appConfig.connect(0, 3)
if (err):
    print("error: ", err, " Type: ", type(err))
if nc.status() != 3:
    raise RuntimeError('network connection failed')
else:
    print('connected')
    status = nc.ifconfig()
    print( 'ip = ' + status[0] )

# ------------------------------------------------

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

def downloadNewTask(url):
    result = False
    
    response = gmc.executeUrl(url, 'GET')
    
    if response[0].split(" ")[2] == "OK":
        with open("task.cfg", "w") as fileHandle:
            fileHandle.write(response[-1])
        result = True
            
    return result

def mainProgram():
    maxWait = 3
    previousProcessID = -1
    processID = tsk.getFirstProcessID()
    NumberOfProcesses = len(tsk.Processes)
    outcome: gmc.ProcessOutcome = None
    debugMessageDelay = 0.5
    print(f"Task {tsk.Name} ({tsk.TaskID}) Started")
    while processID != -1:
        if not tsk.Active:
            continue
        # process = tsk.Processes[processID]
        print(f"Running Process: {tsk.Processes[processID].Name}")
        # A single process start here, depending on the type the execution will run
        # The infinit loop in case of loop required
        while True:
            # One of the process type will hapeand
            # First one Status
            # print(f"Process: {processID}, Previous: {previousProcessID}")
            if previousProcessID != processID:
                tsk.Processes[processID].initPin()
                previousProcessID = processID
            
            outcome = tsk.Processes[processID].Run(outcome)
            
            if(outcome):
                # print all information to debug session
                if outcome.SerialOutRawData:
                    # print(f"Process Pin:{tsk.Processes[processID].Pin} raw value: {outcome.Value}")
                    print(outcome)
                
                # processing the outcome of the process already executed
                if outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.Loop:
                    print("Process Workflow: Loop")
                    time.sleep(debugMessageDelay)
                    continue
                elif outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.NextProcess:
                    print("Process Workflow: NextProcess")
                    processID = processID + 1
                elif outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.GoToProcessSerial:
                    print("Process Workflow: GoToProcessSerial")
                    processID = tsk.getProcessIDByProcessSerial(outcome.NextProcessSerial)
                elif outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.Exit:
                    print("Process Workflow: Exit")
                    processID = -1
            else:
                maxWait = maxWait - 1
            
            if maxWait == -1:
                break
            
            if processID > NumberOfProcesses - 1:
                processID = 0
            
            time.sleep(debugMessageDelay)
        
        if not outcome or outcome.ProcessWorkflow == gmc.ProcessWorkflowTypes.Exit:
            break
        
        # Check if any waiting instruction on the queue
        if (len(appConfig.ExecuteQueue) > 0):
            # Execute the waiting instruction
            pass    

    print(f"Task {tsk.Name} ({tsk.TaskID}) Finished")

def StartWebServer():
    addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]
    sock = socket.socket()
    sock.bind(addr)
    sock.listen(1)

    print('listening on', addr)

    # Listen for connections
    while True:
        cl = None
        try:
            cl, addr = sock.accept()
            request = cl.recv(1024).decode()
            queryString = request.split('\r\n')[0].split(" ")

            # check what command?
            restartBoard = False
            requestParts = queryString[1].split("/")
            if requestParts[2] == "task":
                newRequest = f'http://{appConfig.Host}{queryString[1]}'
                print(f"new Request: {newRequest}")
                tsk.setActive(False)
                if downloadNewTask(newRequest):
                    print("Task accepted")
                    restartBoard = True
                cl.send(f'{queryString[2]} 201 OK\r\nContent-type: text/html\r\n\r\n')
            elif requestParts[2] == "update":
                appConfig.resetUpdateflag(True)
                cl.send(f'{queryString[2]} 201 OK\r\nContent-type: text/html\r\n\r\n')
                restartBoard = True
            else:
                cl.send(f'{queryString[2]} 405 OK\r\nContent-type: text/html\r\n\r\n')

            time.sleep(1)
            cl.close()

            if restartBoard:
                time.sleep(2)
                machine.reset()

        except OSError as e:
            print(f"{e} - Type: {typeof(e)}")
            print('connection closed')
        finally:
            cl.close()

if __name__ == "__main__":
    _thread.start_new_thread(mainProgram, ())
    
    # mainProgram()
    
    StartWebServer()
    
