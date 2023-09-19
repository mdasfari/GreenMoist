from gmClasses import getBoardSerialNumber
import bluetooth
from drivers.ble_simple_peripheral import BLESimplePeripheral

BleQueue = []

ble = bluetooth.BLE()
        
# Create an instance of the BLESimplePeripheral class with the BLE object
sp = BLESimplePeripheral(ble, "GreenMoistAN")
        
# Define a callback function to handle received data
def on_rx(data):
    print("Data received: ", data)  # Print the received data
    if data == b'IDENTIFY':  # Check if the received data is "toggle"
        print("Prepare and send Serial Number")
        print(sp.send("SERIAL_NUMBER"))
        BleQueue.append(getBoardSerialNumber())
    if data == b'ACKNOWLEDGE':  
        BleQueue.append("CREDENTIAL")
    if data[:4] == b'SSID':
        BleQueue.append("ONBOARD")
    if data[:3] == b'PWD':
        BleQueue.append("CONNECTED")
    if data == b'AUTHORIZED':  
        BleQueue.append("CREDENTIAL")
      
armed = False

        
while True:
    if sp.is_connected():  # Check if a BLE connection is established
        if not armed:
            sp.on_write(on_rx)  # Set the call
            armed = True
        
        if (len(BleQueue) > 0):
            print("Queue Has Data")
            command = BleQueue[0]
            print(command)
            print(sp.send(command))
            BleQueue.pop(0)
