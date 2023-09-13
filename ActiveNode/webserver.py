import network
import socket
import time

import machine

led = machine.Pin(15, machine.Pin.OUT)

ssid = 'Al-Faisal'
password = 'c1tyt@qa'

# ssid = 'LowZoneGamma'
# password = 'WKV@62YQJG$7'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

#f = open('index.html', 'r')
#html = f.read()
#f.close()

max_wait = 10
while max_wait > 0:
    if wlan.status() < 0 or wlan.status() >= 3:
        break
    max_wait -= 1
    print('waiting for connection...')
    time.sleep(1)

if wlan.status() != 3:
    raise RuntimeError('network connection failed')
else:
    print('connected')
    status = wlan.ifconfig()
    print( 'ip = ' + status[0] )

addr = socket.getaddrinfo('0.0.0.0', 80)[0][-1]

s = socket.socket()
s.bind(addr)
s.listen(1)

print('listening on', addr)

html = """<!DOCTYPE html>
<html>
    <head> <title>Pico W</title> </head>
    <body> <h1>Pico W</h1>
        <p>%s</p>
    </body>
</html>
"""

# Listen for connections
while True:
    try:
        requestData = ''
        cl, addr = s.accept()
        print('client connected from', addr)
        
        while True:
            request = cl.recv(1024).decode()
            
            if not request:
                break;
            else:
                requestData = requestData + request
            
        print(requestData)
        

        response = html
        #print(response)

        cl.send('HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n')
        cl.send(response)
        cl.close()
        print("Connection Closed")

    except OSError as e:
        cl.close()
        print('connection closed')