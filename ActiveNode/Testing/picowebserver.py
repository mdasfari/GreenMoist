import socket
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
        

addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]

s = socket.socket()
s.bind(addr)
s.listen(1)

print('listening on', addr)

# Listen for connections
while True:
    try:
        requestData = ''
        cl, addr = s.accept()
        print('client connected from', addr)
        
        chunk = 0
        while True:
            print(f"Step: {chunk}")
            request = cl.recv(1024).decode()
            print(f"{chunk} - {request}")
            if request:
                requestData = requestData + request
                print(chunk)
            else:
                break
                
        
        print("Data:------------------------")
        print(requestData)
        

        cl.send('HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n')
        cl.send('<p>This is the end of the response</p>')
        cl.close()
        print("Connection Closed")

    except OSError as e:
        cl.close()
        print('connection closed')