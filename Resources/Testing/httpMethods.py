import socket
from gmClasses import AppConfiguration

def executeUrl(url, webMethod, dataInput = None):
    lineBreak = '\r\n'
    charset = 'utf-8'
    _,_,host,path = url.split('/', 3)
    host_part = host.split(':')
    
    server = host_part[0]
    port = int(host_part[1])
    
    addressInfo = socket.getaddrinfo(server, port)
    sock = socket.socket()

    sock.connect(addressInfo[0][-1])
    
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
    print(request)
    
    httpCommand = bytes(request, charset)
    sock.write(httpCommand)
    # print("socket result:" + res)
    # <socket state=0 timeout=-1 incoming=0 off=0>
    data = ''
    chunk = 0
    while True:
        packet = sock.recv(1024)
        if packet:
            data = data + str(packet, charset)
            chunk = chunk + 1
            print(chunk)
        else:
            break
    
    sock.close()
    
    data_parts = data.split(lineBreak)
    
    #status = data_parts[0]
    #if (status[-2:] == 'OK'):
    #    contentType = data_parts[2].split(':')[1]
    #    length = int(data_parts[3].split(':')[1])
    #    date = data_parts[5].split(':')[1]
    #    result = data_parts[-1]
    #else:
    #    result = None
    return data_parts #(status, result)

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
        
dataResult = executeUrl("http://192.168.19.50:3000/interface/status", 'GET')
print(dataResult)
#print("Header:-----------------")
#print(f"Status: {dataResult[0]}")
#print("Data:-------------------")
#print(dataResult[-1])

dataResult = executeUrl("http://192.168.19.50:3000/interface/record", 'POST', '{"Command":"Hello","Cost":200}')
print(dataResult)
#print("Header:-----------------")
#print(f"Status: {dataResult[0]}")
#print("Data:-------------------")
#print(dataResult[-1])

