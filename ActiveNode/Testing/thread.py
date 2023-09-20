import time, _thread, machine

def task(n, delay):
    led = machine.Pin("LED", machine.Pin.OUT)
    while True:
        led.high()
        time.sleep(delay)
        led.low()
        time.sleep(delay)
    

_thread.start_new_thread(task, (10, 0.5))

for k in range(10):
    print(k)
    time.sleep(0.5)
    
_thread.exit()