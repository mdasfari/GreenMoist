import network
import socket
import time

from machine import Pin

led = Pin(15, Pin.OUT)

ssid = 'Al-Faisal'
password = 'c1tyt@qa'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

html = """<!DOCTYPE html>
<html>
    <head> <title>Pico W</title> </head>
    <body> <h1>Pico W</h1>
        <p>%s</p>
    </body>
</html>
"""

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

# Listen for connections
while True:
    try:
        data = ''
        s.setblocking(True)
        cl, addr = s.accept()
        print(f"Address: {addr}");
        cl.setblocking(False)
        while True:
            request = cl.read(1024)
            print(f"req: {request}")
            if request:
                data = data + str(request, 'utf-8')
            else:
                break
            
            time.sleep(0.01)
        
        print(f"Data: {data}")
        cl.send('HTTP/1.0 200 OK\r\nContent-type: text/html\r\n\r\n')
        cl.send("<p>This is the end of response</p>")
        
    except OSError as e:
        print(f"{e} - Type: {typeof(e)}")
        print('connection closed')
    finally:
        print('finally')
        cl.close()
