import paramiko

HOST = 'serwer194525.lh.pl'
USER = 'serwer194525'
PASS = 'KochamAntygravity2026$'
LIVE_DIR = 'public_html/autoinstalator/zeglarstwomazury.pl/wordpress160635'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

print("Listing LIVE_DIR:", sftp.listdir(LIVE_DIR))

sftp.close()
ssh.close()
