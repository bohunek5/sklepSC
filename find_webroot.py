import paramiko
import requests

HOST = 'serwer194525.lh.pl'
USER = 'serwer194525'
PASS = 'KochamAntygravity2026$'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

# Test locations
locations = [
    'public_html/zeglarstwomazury.pl',
    'public_html/zeglarstwomazury.pl/public',
    'public_html',
]

for loc in locations:
    try:
        sftp.stat(loc)
        probe_file = f"{loc}/probe_test_123.txt"
        with sftp.file(probe_file, 'w') as f:
            f.write("PROBE_OK")
        
        # Test HTTP
        url = "https://zeglarstwomazury.pl/probe_test_123.txt"
        r = requests.get(url, timeout=5)
        print(f"Location {loc} -> HTTP GET {url}: Status {r.status_code}, Body: {r.text.strip()}")
        sftp.remove(probe_file)
    except Exception as e:
        print(f"Error testing {loc}:", e)

sftp.close()
ssh.close()
