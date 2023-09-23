import gmClasses as gmc

filename = 'app.cfg'
appConfig = gmc.AppConfiguration(filename)

while not appConfig.readConfigurationFile():
    # the configuration file is missing,
    # run BLE to connect to the server
    appConfig.ble_BroadcastDevice()

(nc,err) = appConfig.connect(1, 3)

if nc.status() != 3:
    raise RuntimeError('network connection failed')
else:
    print('connected')
    status = nc.ifconfig()
    print( 'ip = ' + status[0] )

# -------------------------------------

print(appConfig.Host)

url = f'http://{appConfig.Host}/interface/task/4'

result = gmc.executeUrl(url, 'GET')
print(result[-1])


if result[0].split(" ")[2] == "OK":
    with open("task.cfg", "w") as fileHandle:
        fileHandle.write(result[-1])
    print("File saved")
    
