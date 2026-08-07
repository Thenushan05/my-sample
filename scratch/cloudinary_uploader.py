import urllib.request
import urllib.parse
import json
import time
import hashlib
import os
import uuid

def upload_file_to_cloudinary(file_path, cloud_name, api_key, api_secret, public_id=None, folder="portfolio"):
    timestamp = int(time.time())
    
    filename = os.path.basename(file_path)
    if not public_id:
        public_id = os.path.splitext(filename)[0]
    
    # Cloudinary parameter signature must be in alphabetical order:
    # folder, public_id, timestamp
    params_to_sign = []
    if folder:
        params_to_sign.append(f"folder={folder}")
    params_to_sign.append(f"public_id={public_id}")
    params_to_sign.append(f"timestamp={timestamp}")
    
    sig_string = "&".join(params_to_sign) + api_secret
    signature = hashlib.sha1(sig_string.encode('utf-8')).hexdigest()
    
    boundary = f"----WebKitFormBoundary{uuid.uuid4().hex}"
    
    fields = {
        "api_key": api_key,
        "timestamp": str(timestamp),
        "public_id": public_id,
        "signature": signature
    }
    if folder:
        fields["folder"] = folder
        
    body = bytearray()
    for key, val in fields.items():
        body.extend(f"--{boundary}\r\n".encode('utf-8'))
        body.extend(f'Content-Disposition: form-data; name="{key}"\r\n\r\n'.encode('utf-8'))
        body.extend(f"{val}\r\n".encode('utf-8'))
        
    # Read binary file
    with open(file_path, 'rb') as f:
        file_data = f.read()
        
    body.extend(f"--{boundary}\r\n".encode('utf-8'))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode('utf-8'))
    body.extend(b'Content-Type: application/octet-stream\r\n\r\n')
    body.extend(file_data)
    body.extend(b'\r\n')
    body.extend(f"--{boundary}--\r\n".encode('utf-8'))
    
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/auto/upload"
    req = urllib.request.Request(url, data=bytes(body), headers={
        "Content-Type": f"multipart/boundary={boundary}" # wait: multipart/form-data; boundary=...
    })
    
    # Fixed content type:
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res.get("secure_url")

if __name__ == "__main__":
    print("Cloudinary upload module ready")
