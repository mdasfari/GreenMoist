from gmClasses import AppConfiguration


filename = 'app.cfg'
appConfig = AppConfiguration(filename)


configRead = appConfig.readConfigurationFile()
print("Read Configuration file: ", configRead)

if configRead:
    (nc,err) = appConfig.connect(0, 3) # 0 for work, 1 for personal
    
    if nc.status() != 3:
        raise RuntimeError('network connection failed')
    else:
        print('connected')
        status = nc.ifconfig()
        print( 'ip = ' + status[0] )

# ------------------------------------------------------------------
import socket

def StartWebServer(webClients, port):
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
            
            newUpdate = {"Command":"Update", "Task":queryString[1]}
            print(newUpdate)
            appConfig.ExecuteQueue.append(newUpdate);

            print(f"Request Data: {request}")
            cl.send(f'{queryString[2]} 200 OK\r\nContent-type: text/html\r\n\r\n')
            
        except OSError as e:
            print(f"{e} - Type: {typeof(e)}")
            print('connection closed')
        finally:
            print('finally')
            cl.close()

import _thread

_thread.start_new_thread(StartWebServer,(1, 80))

