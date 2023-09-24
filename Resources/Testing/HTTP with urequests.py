# Connect to network
import network
import urequests

print(dir(urequests))

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect('HighZoneGamma', 'WKV@62YQJG$7')
# Make GET request

r = urequests.get("http://www.google.com")
print(r.content)
r.close()

