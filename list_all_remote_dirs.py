import paramiko

HOST = 'serwer194525.lh.pl'
USER = 'serwer194525'
PASS = 'KochamAntygravity2026$'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

print("Listing root:", sftp.listdir('.'))
print("Listing public_html:", sftp.listdir('public_html'))

sftp.close()
ssh.close()
