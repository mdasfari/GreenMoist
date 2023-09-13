import gmClasses as gmc
import json
import socket

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
if tsk:
    for process in tsk.Processes:
        print(process['Name'])



###
### person = '{"name": "Bob","age": 12,"children": [{"name": "Job","age": 12},{"name": "Cop","age": 10},{"name": "Hob","age": 8},:{"name":"Mob","age": 6}]}'
### # personJson = json.dumps(person)
### personJson = json.loads(person)
### print(personJson['children'][3])

# con = '' # json.loads(appCon)

# with open('task.cfg', 'r') as file:
#    task = json.loads(file.read())
    
# print(task['Processes'][0])

# json.dump(file.read(), con)
# appCon = file.read()

# json.dump(appCon, con)



# print (con["network\ssid"])

# appConfig = gmc.AppConfiguration(nc)

# print(appConfig)
# json.dump(appConfig, indent=0)

