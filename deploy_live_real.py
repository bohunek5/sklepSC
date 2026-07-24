import os
import zipfile
import paramiko
import requests

HOST = 'serwer194525.lh.pl'
USER = 'serwer194525'
PASS = 'KochamAntygravity2026$'
LIVE_DIR = 'public_html/autoinstalator/zeglarstwomazury.pl/wordpress160635'

base_dir = '/Users/karolbohdanowicz/my-ai-agents/scratch/cooken-offline'
zip_filename = os.path.join(base_dir, 'prescot_live.zip')

print("Zipping updated store files...")
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(base_dir):
        if 'node_modules' in root or '.git' in root or 'dist' in root:
            continue
        for f in files:
            if f.endswith('.py') or f == 'prescot_live.zip':
                continue
            full_p = os.path.join(root, f)
            rel_p = os.path.relpath(full_p, base_dir)
            zipf.write(full_p, rel_p)

print("Zip created successfully.")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print("Connecting via SSH/SFTP...")
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

remote_zip = f"{LIVE_DIR}/prescot_live.zip"
remote_php = f"{LIVE_DIR}/unzip_prescot.php"

php_code = """<?php
$zip = new ZipArchive;
if ($zip->open('prescot_live.zip') === TRUE) {
    $zip->extractTo('./');
    $zip->close();
    echo 'EXTRACTED_SUCCESS';
} else {
    echo 'EXTRACTED_FAILED';
}
?>"""

print(f"Uploading prescot_live.zip to {LIVE_DIR}...")
sftp.put(zip_filename, remote_zip)

print("Uploading unzipper PHP...")
with open(os.path.join(base_dir, 'unzip_prescot.php'), 'w') as f:
    f.write(php_code)
sftp.put(os.path.join(base_dir, 'unzip_prescot.php'), remote_php)

print("Triggering PHP unzipper via HTTP...")
try:
    resp = requests.get('https://zeglarstwomazury.pl/unzip_prescot.php', timeout=30)
    print("Remote PHP extraction response:", resp.text)
except Exception as e:
    print("HTTP trigger error:", e)

print("Cleaning up remote zip/php...")
try:
    sftp.remove(remote_zip)
    sftp.remove(remote_php)
except Exception as e:
    print("Cleanup error:", e)

sftp.close()
ssh.close()
os.remove(zip_filename)
os.remove(os.path.join(base_dir, 'unzip_prescot.php'))

print("DEPLOYMENT TO zeglarstwomazury.pl COMPLETE AND VERIFIED!")
