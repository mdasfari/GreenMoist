import network

wlan = network.WLAN(network.STA_IF)

wlan.active(True)
wlan.connect('HighZoneGamma', 'WKV@62YQJG$7')

import upip
upip.install("uiperf3")