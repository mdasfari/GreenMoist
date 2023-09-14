import gmClasses as gmc

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
    

print(tsk.Processes)