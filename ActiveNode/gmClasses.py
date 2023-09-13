import network
import time
import json
import machine 

class ProcessType:
    Status = 0
    Action = 1
    Record = 2    

class PinType:
    Analog = 0
    PulseWidthModulation = 1
    Logical = 2
    

class ProcessWorkflow:
    Loop = 0
    NextProcess = 1
    GoToProcessSerial = 2
    Exit = 3
    
class ExecutionType:
    TurnOff = 0
    TurnOn = 1

class AppConfiguration:
    Host = None
    Network = None
    def __init__(self, AppConfigFile):
        with open(AppConfigFile, "r") as configFile:
            appData = json.loads(configFile.read())
            self.Host = appData['Host']
            self.Network = appData['Network']

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
        
class NodeTask:
    TaskID = None
    Name = None
    Processes = [] 
    def __init__(self, filename):
        with open(filename, "r") as taskFile:
            taskData = json.loads(taskFile.read())
            self.TaskID = taskData['TaskID']
            self.Name = taskData['Name']
            self.Processes = taskData['Processes']
    
    def __str__(self):
        return f"{self.Name} ({self.TaskID})[{len(self.Processes)}]"
    
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
        if self.PinType == PinType.Analog:
            self.activePin = machine.ADC(self.Pin - 26)
        else:
            if self.ProcessType == ProcessType.Status:
                pinPolarity = machine.Pin.IN
            else:
                pinPolarity = machine.Pin.OUT
            
            self.activePin = machine.Pin(self.Pin, pinPolarity)

    def readPinRawValue(self):
        pinValue = 0
        
        if self.PinType == PinType.Analog:
            pinValue = self.activePin.read_u16()
        else:
            pinValue = self.activePin.value()
        
        return pinValue