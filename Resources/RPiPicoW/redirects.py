import urequests
r = urequests.get("http://www.raspberrypi.com")
print(r.status_code) # redirects to https
r.close()