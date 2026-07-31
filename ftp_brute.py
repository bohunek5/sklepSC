import ftplib

usernames = [
    'serwer194525',
    'serwer194525.lh.pl',
    'serwer194525@serwer194525.lh.pl',
    'zeglarstowmazury.pl',
    'zeglarstwowmazury.pl',
    'zeglarstowmazury',
    'zeglarstwowmazury',
    'admin@zeglarstowmazury.pl',
    'admin@zeglarstwowmazury.pl',
    'admin',
    'serwer194525_zeglarstowmazury',
    'serwer194525_zeglarstwowmazury',
    'serwer194525_zeglarstwo',
    'serwer194525_ftp',
    'ftp@zeglarstwowmazury.pl',
    'ftp@zeglarstowmazury.pl'
]

password = 'xc12RaIqPh|-#GFU'

for user in usernames:
    try:
        ftp = ftplib.FTP('serwer194525.lh.pl')
        ftp.login(user, password)
        print(f"SUCCESS with {user}")
        print(ftp.nlst())
        ftp.quit()
        exit(0)
    except Exception as e:
        pass

print("ALL FAILED")
