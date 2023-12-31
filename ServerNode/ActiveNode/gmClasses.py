# Version 1.62
import network
import socket
import time
import json
import machine 
import ubinascii
import bluetooth
import json
import math
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
    PreviousValue = 0
    Value = 0
    ProcessWorkflow = None
    ProcessSerial = None
    NextProcessSerial = None
    SerialOutRawData = False
    BroadcastValue = False
    DebugMessage = None
   
    def __init__(self, serialOutRawData, broadcastValue, debugMessage):
        self.SerialOutRawData = serialOutRawData
        self.BroadcastValue = broadcastValue
        self.DebugMessage = debugMessage
        
    def __str__(self):
        return f"Process: {self.ProcessSerial} - Value: {self.Value} ({self.PreviousValue}) - Next Process: {self.NextProcessSerial}, Message: {self.DebugMessage}"

# General supporting function
def getProcessSerial(itm):
    return itm[1]

# the following code is copied and rearranged from the following URL
# https://forum.micropython.org/viewtopic.php?t=6034
def getBoardSerialNumber():
    return ubinascii.hexlify(machine.unique_id()).upper().decode('utf-8')

def getTheDataSize(responseData):
    start = responseData.find("Content-Length")
    end = responseData.find("\r\n", start) + 2
    responseElement = responseData[start:end].split(":")
    contentSize = int(responseElement[1])
    return contentSize

def executeUrl(url, webMethod, dataInput = None):
    lineBreak = '\r\n'
    charset = 'utf-8'
    _,_,host,path = url.split('/', 3)
    host_part = host.split(':')
    
    server = host_part[0]
    port = int(host_part[1])
    
    print(f"Connecting to {url}")
    
    addressInfo = socket.getaddrinfo(server, port)
    sendSock = socket.socket()

    print(f"Connection Address {addressInfo[0][-1]}")

    try:
        sendSock.connect(addressInfo[0][-1])
        print(f"Connected")
    except Exception as err:
        print("error: ", err, " Type: ", type(err))
        return None
    
    request = ""
    requestParts = []
    requestParts.append(f'{webMethod} /{path} HTTP/1.0')
    requestParts.append(f'Host: {host}')

    if dataInput:
        requestParts.append('Content-Type: application/json')
        requestParts.append(f'Content-Length: {len(dataInput)}')
        requestParts.append("")
        requestParts.append(dataInput)
    
    for part in requestParts:
        request = request + part + lineBreak
    
    request = request + lineBreak    
    
    httpCommand = bytes(request, charset)
    sendSock.write(httpCommand)

    data = ''
    chunk = 0
    while True:
        packet = sendSock.recv(1024).decode()
        if packet:
            data = data + str(packet, charset)
            chunk = chunk + 1
        else:
            break
    
    sendSock.close()
    dataSize = len(data) - getTheDataSize(data)
    data_parts = data[:dataSize-2].split(lineBreak)
    data_parts.append(data[dataSize:])

    return data_parts #(status, result)

class WirelessNetwork:
    SSID: None
    PWD: None
    
    def __init(self, ssid, pwd):
        self.SSID = ssid
        self.PWD = pwd

class Device:
    DeviceID: None
    Name: None
    
    def __init__(self, deviceID, name):
        self.DeviceID = deviceID
        self.Name = name
        
    def __str__(self):
        return f"{self.Name} ({self.DeviceID})"

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
    Device = None
    Version = None
    OSUpdate = False
    Host = None
    Network = None
    ExecuteQueue = []
    
    def __init__(self, AppConfigFile):
        self.ConfigFilename = AppConfigFile
    
    def resetUpdateflag(self, status):
        self.OSUpdate = status
        self.writeConfiguration()
    
    def readConfigurationFile(self):
        returnResult = False
        try:
            with open(self.ConfigFilename, "r") as configFile:
                appData = json.loads(configFile.read())
                self.Version = appData['Version']
                self.OSUpdate = appData['OSUpdate']
                self.Device = Device(appData['Device']['DeviceID'], appData['Device']['Name'])
                self.Host = Host(appData['Host']['Hostname'], appData['Host']['Port'])
                self.Network = appData['Network']
                returnResult = True
        except Exception as err:
            print("error: ", err, " Type: ", type(err))
            returnResult = False
            
        return returnResult
    
    def writeConfiguration(self):
        returnResult = False
        try:
            with open(self.ConfigFilename, "w") as configFile:
                configData = json.dumps({"Version": self.Version
                              , "Device": {"DeviceID": self.Device.DeviceID, "Name": self.Device.Name}
                              , "Host": {"Hostname": self.Host.Hostname, "Port": self.Host.Port}
                              , "Network":self.Network
                              , "OSUpdate": self.OSUpdate})
                configFile.write(configData)
                returnResult = True
        except Exception as err:
            print("error: ", err, " Type: ", type(err))
            returnResult = False
        finally:
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
            
        except Exception as ex:
            Err = ex
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
            if data[:5] == b'INET:':
                newAppConfig = json.loads(str(data[5:], 'utf-8'))
                self.Version = newAppConfig['Version']
                self.OSUpdate = newAppConfig['OSUpdate']
                self.Device = Device(newAppConfig['Device']['DeviceID'], newAppConfig['Device']['Name'])
                self.Host = Host(newAppConfig['Host']['Hostname'], newAppConfig['Host']['Port'])
                self.Network = newAppConfig['Network']
                
        # Start an infinite loop
        if sp.is_connected():  # Check if a BLE connection is established
            sp.on_write(on_rx)  # Set the call

class NodeTask:
    TaskID = None
    Name = None
    Host = None
    Device = None
    Active = None    
    Processes = []
    
    def __init__(self, filename, host, device):
        self.Host = host
        self.Device = device
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
                self.Processes.append(TaskProcess(taskData['Processes'][id], self.TaskID, self.Name, self.Host, self.Device))
                
            self.Active = True
    
    def __str__(self):
        return f"{self.Name} ({self.TaskID})[{len(self.Processes)}]"
    
    def getFirstProcessID(self):
        if len(self.Processes) > 0:
            return 0
        return -1

    def getProcessIDByProcessSerial(self, processSerial):
        resultProcess = None
        
        for index in range(len(self.Processes)):
            if self.Processes[index].ProcessSerial == processSerial:
                resultProcess = index
                break
        return resultProcess

    def setActive(self, state):
        self.Active = state
    
class TaskProcess:
    Host = None
    Device = None
    ProcessID = None
    TaskID = None
    TaskName = None
    ProcessSerial = None
    ProcessType = None
    Name = None
    Pin = None
    PinType = None
    SerialOutRawData = None
    BroadcastValue = None
    ThresholdLow = None
    ThresholdHigh = None
    ChangeRange = None
    TrueProcessType = None
    TrueProcessID = None
    TrueDebugMessage = None
    FalseProcessType = None
    FalseProcessID = None
    FalseDebugMessage = None
    ActionType = None
    
    def __init__(self, process, taskID, taskName, host, device):
        self.Host = host
        self.Device = device
        self.ProcessID = process['ProcessID']
        self.TaskID = taskID
        self.TaskName = taskName
        self.ProcessSerial = process['ProcessSerial']
        self.ProcessType = process['ProcessType']
        self.Name = process['Name']
        self.Pin = process['Pin']
        self.PinType = process['PinType']
        self.SerialOutRawData = process['SerialOutRawData']
        self.BroadcastValue = process['BroadcastValue']
        self.ThresholdLow = process['ThresholdLow']
        self.ThresholdHigh = process['ThresholdHigh']
        self.ChangeRange = process['ChangeRange']
        self.TrueProcessType = process['TrueProcessType']
        self.TrueProcessID = process['TrueProcessID']
        self.TrueDebugMessage = process['TrueDebugMessage']
        self.FalseProcessType = process['FalseProcessType']
        self.FalseProcessID = process['FalseProcessID']
        self.FalseDebugMessage = process['FalseDebugMessage']
        self.ActionType = process['ActionType']
    
    def __str__(self):
        return f'{self.Name} ({self.ProcessSerial}), Pin:{self.Pin}'
    
    def getJson(self):
        return json.dumps({"DeviceID": self.Device.DeviceID
                , "ProcessID": self.ProcessID
                , "TaskID": self.TaskID
                , "ProcessSerial": self.ProcessSerial
                , "ProcessType": self.ProcessType
                , "Name": self.Name
                , "Pin": self.Pin
                , "PinType": self.PinType
                , "SerialOutRawData": self.SerialOutRawData
                , "BroadcastValue": self.BroadcastValue
                , "ThresholdLow": self.ThresholdLow
                , "ThresholdHigh": self.ThresholdHigh
                , "ChangeRange": self.ChangeRange                    
                , "TrueProcessType": self.TrueProcessType
                , "TrueProcessID": self.TrueProcessID
                , "TrueDebugMessage": self.TrueDebugMessage
                , "FalseProcessType": self.FalseProcessType
                , "FalseProcessID": self.FalseProcessID
                , "FalseDebugMessage": self.FalseDebugMessage
                , "ActionType": self.ActionType})
    
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
        
        externalOutcome.ProcessSerial = self.ProcessSerial
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
        externalOutcome.PreviousValue = externalOutcome.Value
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
        externalOutcome.PreviousValue = externalOutcome.Value
        if self.ActionType:
            externalOutcome.Value = 1
        else:
            externalOutcome.Value = 0
        
        if self.readPinRawValue() != externalOutcome.Value:
            print("Button switched")
            self.activePin.value(externalOutcome.Value)
        
        externalOutcome.ProcessWorkflow = self.TrueProcessType
        externalOutcome.NextProcessSerial = self.TrueProcessID
        externalOutcome.DebugMessage = self.TrueDebugMessage

    def runNotificationProcess(self, externalOutcome):
        data = {"DeviceID": self.Device.DeviceID
                , "ProcessID": self.ProcessID
                , "ProcessType": self.ProcessType
                , "Pin": self.Pin
                , "PinType": self.PinType
                , "DebugMessage": self.TrueDebugMessage
                , "Value": externalOutcome.Value
                , "ThresholdLow": self.ThresholdLow
                , "ThresholdHigh": self.ThresholdHigh}
        
        if (self.BroadcastValue):
            # responseData = executeUrl(remoteServerConnection, f"http://{self.Host}/interface/record", "POST", json.dumps(data))
            print("Data sent to server")
                
        return externalOutcome
    