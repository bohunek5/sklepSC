import paramiko
import requests

HOST = 'serwer194525.lh.pl'
USER = 'serwer194525'
PASS = 'KochamAntygravity2026$'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

dirs_to_check = [
    'public_html',
    'public_html/zeglarstwomazury.pl',
    'public_html/autoinstalator',
    'public_html/autoinstalator/zeglarstwomazury.pl',
]

for d in dirs_to_check:
    try:
        files = sftp.listdir(d)
        print(f"Directory {d}:", files[:10])
    except Exception as e:
        print(f"Could not list {d}:", e)

# Drop probe in multiple places to find which one responds at https://zeglarstwomazury.pl/probe_target.txt
test_dirs = [
    'public_html',
    'public_html/zeglarstwomazury.pl',
    'public_html/autoinstalator/zeglarstwomazury.pl',
    'public_html/autoinstalator/zeglarstwomazury.pl/wordpress160635',
]

for d in test_dirs:
    try:
        fname = f"{d}/probe_target_{d.replace('/', '_')}.txt"
        with sftp.file(fname, 'w') as f:
            f.write(f"FOUND_{d}")
        
        target_name = f"probe_target_{d.replace('/', '_')}.txt"
        url = f"https://zeglarstwomazury.pl/{target_name}"
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            print(f"\nSUCCESS! https://zeglarstwomazury.pl points to: {d} (Response: {r.text.strip()})")
        sftp.remove(fname)
    except Exception as e:
        print(f"Error testing dir {d}:", e)

sftp.close()
ssh.close()
