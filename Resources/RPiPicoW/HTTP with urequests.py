# Connect to network
import network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect('HighZoneGamma', 'WKV@62YQJG$7')
# Make GET request
import urequests
r = urequests.get("http://www.google.com")
print(r.content)
r.close()