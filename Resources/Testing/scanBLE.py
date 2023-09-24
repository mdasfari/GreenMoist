import bluetooth

ble = bluetooth.Bluetooth()
ble.start_scan(-1)

while True:
	print(ble.get_adv())

