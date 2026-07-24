import os
import zipfile
import paramiko
import requests

HOST = 'serwer194525.lh.pl'
USER = 'serwer194525'
PASS = 'KochamAntygravity2026$'
REMOTE_DIR = 'public_html/zeglarstwomazury.pl'

base_dir = '/Users/karolbohdanowicz/my-ai-agents/scratch/cooken-offline'
zip_filename = os.path.join(base_dir, 'store_deploy.zip')

print("Creating ZIP file...")
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # 1. Add root HTML, CSS, JS, json files
    for root, dirs, files in os.walk(base_dir):
        # Skip node_modules, .git, videos (large), images unless needed
        if 'node_modules' in root or '.git' in root or 'videos' in root or 'dist' in root:
            continue
        for f in files:
            if f.endswith('.py') or f == 'store_deploy.zip':
                continue
            full_p = os.path.join(root, f)
            rel_p = os.path.relpath(full_p, base_dir)
            zipf.write(full_p, rel_p)

print("Zip created successfully.")

# Upload via SFTP
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print("Connecting via SSH...")
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

remote_zip = f"{REMOTE_DIR}/store_deploy.zip"
remote_php = f"{REMOTE_DIR}/unzip_store.php"

php_code = """<?php
$zip = new ZipArchive;
if ($zip->open('store_deploy.zip') === TRUE) {
    $zip->extractTo('./');
    $zip->close();
    echo 'EXTRACTED_SUCCESS';
} else {
    echo 'EXTRACTED_FAILED';
}
?>"""

print("Uploading store_deploy.zip to remote server...")
sftp.put(zip_filename, remote_zip)

print("Uploading unzip_store.php...")
with open(os.path.join(base_dir, 'unzip_store.php'), 'w') as f:
    f.write(php_code)
sftp.put(os.path.join(base_dir, 'unzip_store.php'), remote_php)

print("Triggering unzipper via HTTP...")
try:
    resp = requests.get('https://zeglarstwomazury.pl/unzip_store.php', timeout=30)
    print("Remote PHP response:", resp.text)
except Exception as e:
    print("HTTP trigger error:", e)

print("Cleaning up temporary zip/php on remote...")
try:
    sftp.remove(remote_zip)
    sftp.remove(remote_php)
except Exception as e:
    print("Cleanup remote error:", e)

sftp.close()
ssh.close()
os.remove(zip_filename)
os.remove(os.path.join(base_dir, 'unzip_store.php'))

print("DEPLOYMENT COMPLETE TO zeglarstwomazury.pl!")
