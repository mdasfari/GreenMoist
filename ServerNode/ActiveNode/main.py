import network
import socket
import bluetooth
import json
import time
from drivers.ble_simple_peripheral import BLESimplePeripheral

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
    
    def resetUpdateflag(self):
        self.OSUpdate = False
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
                self.Version = newAppConfig.Version
                self.Device = Device(newAppConfig.DeviceID, newAppConfig.Name)
                self.Host = Host(newAppConfig.Host, newAppConfig.Port)
                self.Network = [WirelessNetwork(newAppConfig.SSID, newAppConfig.PWD)]
                
        # Start an infinite loop
        if sp.is_connected():  # Check if a BLE connection is established
            sp.on_write(on_rx)  # Set the call

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

def program():
    filename = 'app.cfg'
    appConfig = AppConfiguration(filename)
    while not appConfig.readConfigurationFile():
        print("Configuration File is missing, run BLE advertisment")
        # the configuration file is missing,
        # run BLE to connect to the server
        appConfig.ble_BroadcastDevice()
    
    print("configuration loaded")
    (nc,err) = appConfig.connect(0, 3)
    if err:
        print("error: ", err, " Type: ", type(err))
        return
    if nc:
        if nc.status() != 3:
            raise RuntimeError('network connection failed')
        else:
            print('connected')
            status = nc.ifconfig()
            print( 'ip = ' + status[0])
        
        if appConfig and appConfig.OSUpdate:
            print("Found system update")
            result = True
            
            try:
                # download the new program and classes
                print("Downloading new version of the activenode classes")
                url = f'http://{appConfig.Host}/interface/firmware/gmClasses'
                response = executeUrl(url, 'GET')
                if response[0].split(" ")[2] == "OK":
                    print("classes downloaded, attempt to replace the file")
                    with open("gmClasses.py", "w") as fileHandle:
                        fileHandle.write(response[-1])
                else:
                    print(f"response from the server {response[0].split(" ")[2]}")
                    result = False
                
                print("Downloading new version of the activenode main program")
                url = f'http://{appConfig.Host}/interface/firmware/activenode'
                response = executeUrl(url, 'GET')
                if response[0].split(" ")[2] == "OK":
                    print("main program downloaded, attemp to replace the file")
                    with open("activenode.py", "w") as fileHandle:
                        fileHandle.write(response[-1])
                else:
                    print(f"response from the server {response[0].split(" ")[2]}")
                    result = False
            except Exception as err:
                print("error: ", err, " Type: ", type(err))
                result = False
            
            # Reset the OS Flag
            if result:
                print("Update successful.")
                appConfig.resetUpdateflag()
        else:
            print("No system update found")

        nc.disconnect()

    print("Loading Active Node main program.")
    exec(open('activenode.py').read())

if __name__ == "__main__":
    program()