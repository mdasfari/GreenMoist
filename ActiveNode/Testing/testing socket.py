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


import socket
ai = socket.getaddrinfo("http://10.10.10.57:3000/interface/record", 3000)
addr = ai[0][-1]

print("ai: ", ai)

# Create a socket and make a HTTP request
s = socket.socket()
s.connect(addr)
s.send(b'{"id":12,"Serial":"ES665544","Value":2500,"ProcessType":0}')
# Print the response
print(s.recv(512))