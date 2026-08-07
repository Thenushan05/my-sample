import urllib.request
import urllib.parse
import json
import time
import hashlib

cloud_name = "dbotzlymk"
api_val = "9Ns3qLX18Plvg991iCd3LzPhhuk"

# Test 1: Try as upload_preset (unsigned)
url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
data = urllib.parse.urlencode({
    "file": "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "upload_preset": api_val
}).encode('utf-8')

req = urllib.request.Request(url, data=data)
try:
    with urllib.request.urlopen(req) as resp:
        print("Unsigned preset success:", resp.read().decode('utf-8'))
except Exception as e:
    print("Unsigned preset failed:", e)
