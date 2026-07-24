import paramiko

HOST = 'serwer194525.lh.pl'
USER = 'serwer194525'
PASS = 'KochamAntygravity2026$'
REMOTE_DIR = 'public_html/zeglarstwomazury.pl'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

print("Listing REMOTE_DIR:", sftp.listdir(REMOTE_DIR))

sftp.close()
ssh.close()
