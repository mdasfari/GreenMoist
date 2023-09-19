import network
import socket
import time
import json
import machine 
import ubinascii
import bluetooth
from drivers.ble_simple_peripheral import BLESimplePeripheral

class ProcessTypes:
    Status = 0
    Action = 1
    Notification = 2    

class PinTypes:
    Analog = 0
    PulseWidthModulation = 1
    Logical = 2
    

class ProcessWorkflowTypes:
    Loop = 0
    NextProcess = 1
    GoToProcessSerial = 2
    Exit = 3
    
class ExecutionTypes:
    TurnOff = 0
    TurnOn = 1

class ProcessOutcome:
    Value = 0
    ProcessWorkflow = None
    NextProcessSerial = None
    SerialOutRawData = False
    BroadcastValue = False
    DebugMessage = None
   
    def __init__(self, serialOutRawData, broadcastValue, debugMessage):
        self.SerialOutRawData = serialOutRawData
        self.BroadcastValue = broadcastValue
        self.DebugMessage = debugMessage

# General supporting function
def getProcessSerial(itm):
    return itm[1]

# the following code is copied and rearranged from the following URL
# https://forum.micropython.org/viewtopic.php?t=6034
def getBoardSerialNumber():
    return ubinascii.hexlify(machine.unique_id()).upper().decode('utf-8')

class Host:
    Hostname = None
    Port = None
    
    def __init__(self, hostname, port):
        self.Hostname = hostname
        self.Port = port
    def __str__(self):
        return f"{self.Hostname}:{self.Port}"

class AppConfiguration:
    ConfigFilename = None
    Host = None
    Network = None
    BleQueue = []
    
    def __init__(self, AppConfigFile):
        self.ConfigFilename = AppConfigFile
    
    def readConfigurationFile(self):
        returnResult = False
        try:
            with open(self.ConfigFilename, "r") as configFile:
                appData = json.loads(configFile.read())
                self.Host = Host(appData['Host']['Hostname'], appData['Host']['Port'])
                self.Network = appData['Network']
                returnResult = True
        except Exception as err:
            print("error: ", err, " Type: ", type(err))
            returnResult = False
            
        return returnResult

    def connect(self, networkID, max_wait = 10):
        wlan = None
        Err = None
        try:
            wlan = network.WLAN(network.STA_IF)
            wlan.active(True)
            wlan.connect(self.Network[networkID]["ssid"], self.Network[networkID]["pwd"])
            
            while max_wait > 0:
                if wlan.status() < 0 or wlan.status() >= 3:
                    break
            max_wait -= 1
            print('waiting for connection...')
            time.sleep(1)
            
        except Exception:
            Err = Exception
        finally:
            return (wlan, Err)
        
    def ble_BroadcastDevice(self):
        # the folowing function used two library which I did not wrote
        # I used it as it is for create a BLE communication
        # the communication protocol in def on_rx(data): and this function is my coding
        # Source: https://electrocredible.com/raspberry-pi-pico-w-bluetooth-ble-micropython/
        
        # Create a Bluetooth Low Energy (BLE) object
        ble = bluetooth.BLE()
        
        # Create an instance of the BLESimplePeripheral class with the BLE object
        sp = BLESimplePeripheral(ble, "GreenMoistAN")
        
        # Define a callback function to handle received data
        def on_rx(data):
            print("Data received: ", data)  # Print the received data
            if data == b'IDENTIFY':  # Check if the received data is "toggle"
                self.BleQueue.append(getBoardSerialNumber())
            if data == b'ACKNOWLEDGE':  
                self.BleQueue.append("CREDENTIAL")
            if data[:4] == b'SSID':
                self.BleQueue.append("ONBOARD")
            if data[:3] == b'PWD':
                self.BleQueue.append("CONNECTED")
            if data == b'AUTHORIZED':  
                self.BleQueue.append("CREDENTIAL")
                
        # Start an infinite loop
        if sp.is_connected():  # Check if a BLE connection is established
            sp.on_write(on_rx)  # Set the call
                
        while True:
            if sp.is_connected():  # Check if a BLE connection is established
                if (len(self.BleQueue) > 0):
                    command = self.BleQueue[0]
                    print(command)
                    sp.send(command)
                    self.BleQueue.pop(0)

class NodeTask:
    TaskID = None
    Name = None
    Host = None
    Processes = []
    
    def __init__(self, filename, host):
        self.Host = host
        with open(filename, "r") as taskFile:
            taskData = json.loads(taskFile.read())
            self.TaskID = taskData['TaskID']
            self.Name = taskData['Name']
            
            indexArray = []
            for index in range(len(taskData['Processes'])):
                indexArray.append((index, taskData['Processes'][index]['ProcessSerial']))
            indexArray.sort(key=getProcessSerial)
            
            for index in range(len(indexArray)):
                id = indexArray[index][0]
                self.Processes.append(TaskProcess(taskData['Processes'][id]))
    
    def __str__(self):
        return f"{self.Name} ({self.TaskID})[{len(self.Processes)}]"
    
    def getFirstProcessID(self):
        if len(self.Processes) > 0:
            return 0
        return -1
        
    def getProcessIDByProcessSerial(self, processSerial):
        resultProcess = None
        
        for index in range(Len(self.Processes)):
            if self.Processes[index].ProcessSerial == processSerial:
                resultProcess = self.Processes[index].ProcessID
                break
        return resultProcess
    
class TaskProcess:
    ProcessID = None
    TaskID = None
    ProcessSerial = None
    ProcessType = None
    Name = None
    Pin = None
    PinType = None
    SerialOutRawData = None
    BroadcastValue = None
    ThresholdLow = None
    ThresholdHigh = None
    TrueProcessType = None
    TrueProcessID = None
    TrueDebugMessage = None
    FalseProcessType = None
    FalseProcessID = None
    FalseDebugMessage = None
    ActionType = None
    
    def __init__(self, process):
        self.ProcessID = process['ProcessID']
        self.TaskID = process['TaskID']
        self.ProcessSerial = process['ProcessSerial']
        self.ProcessType = process['ProcessType']
        self.Name = process['Name']
        self.Pin = process['Pin']
        self.PinType = process['PinType']
        self.SerialOutRawData = process['SerialOutRawData']
        self.BroadcastValue = process['BroadcastValue']
        self.ThresholdLow = process['ThresholdLow']
        self.ThresholdHigh = process['ThresholdHigh']
        self.TrueProcessType = process['TrueProcessType']
        self.TrueProcessID = process['TrueProcessID']
        self.TrueDebugMessage = process['TrueDebugMessage']
        self.FalseProcessType = process['FalseProcessType']
        self.FalseProcessID = process['FalseProcessID']
        self.FalseDebugMessage = process['FalseDebugMessage']
        self.ActionType = process['ActionType']
    
    def __str__(self):
        return f'{self.Name} ({self.ProcessSerial}), Pin:{self.Pin}'
    
    def initPin(self):
        pinPolarity = None
        if self.PinType == PinTypes.Analog:
            self.activePin = machine.ADC(self.Pin - 26)
        else:
            if self.ProcessType == ProcessTypes.Status:
                pinPolarity = machine.Pin.IN
            else:
                pinPolarity = machine.Pin.OUT
            self.activePin = machine.Pin(self.Pin, pinPolarity)

    def readPinRawValue(self):
        pinValue = 0
        
        if self.PinType == PinTypes.Analog:
            pinValue = self.activePin.read_u16()
        else:
            pinValue = self.activePin.value()
        
        return pinValue
    
    def Run(self, externalOutcome):
        if not externalOutcome:
            externalOutcome = ProcessOutcome(self.SerialOutRawData, self.BroadcastValue, None)
        
        externalOutcome.SerialOutRawData = self.SerialOutRawData
        externalOutcome.BroadcastValue = self.BroadcastValue
            
        if self.ProcessType == ProcessTypes.Status:
            self.runStatusProcess(externalOutcome)
        elif self.ProcessType == ProcessTypes.Action:
            self.runActionProcess(externalOutcome)
        else:
            self.runNotificationProcess(externalOutcome)
        
        return externalOutcome
            
    def runStatusProcess(self, externalOutcome):
        # result.SerialOutRawData = serialOutRawData
        # BroadcastValue
        externalOutcome.Value = self.readPinRawValue()
        if externalOutcome.Value >= self.ThresholdLow and externalOutcome.Value <= self.ThresholdHigh:
            externalOutcome.ProcessWorkflow = self.TrueProcessType
            externalOutcome.NextProcessSerial = self.TrueProcessID
            externalOutcome.DebugMessage = self.TrueDebugMessage
        else:
            externalOutcome.ProcessWorkflow = self.FalseProcessType
            externalOutcome.NextProcessSerial = self.FalseProcessID
            externalOutcome.DebugMessage = self.FalseDebugMessage

        return externalOutcome
    
    def runActionProcess(self, externalOutcome):
        # in this procedure and according to the data saved
        # the function will execute based on the process type
        if self.ActionType:
            externalOutcome.Value = 1
        else:
            externalOutcome.Value = 0
            
        self.activePin.value(externalOutcome.Value)
        externalOutcome.ProcessWorkflow = self.TrueProcessType
        externalOutcome.NextProcessSerial = self.TrueProcessID
        externalOutcome.DebugMessage = self.TrueDebugMessage

    def runNotificationProcess(self, externalOutcome):
        sock = socket.getaddrinfo(self.Host.Hostname, self.Host.Port)
        addr = sock[0][-1]
        
        # Create a socket and make a HTTP request
        s = socket.socket()
        s.connect(addr)
        s.send(b"GET / HTTP/1.0\r\n\r\n")
        
        # Print the response
        print(s.recv(1024))
    