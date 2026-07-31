import ftplib
import sys
try:
    ftp = ftplib.FTP('serwer194525.lh.pl')
    ftp.login('serwer194525', 'xc12RaIqPh|-#GFU')
    print('SUCCESS')
    print(ftp.nlst())
    ftp.quit()
except Exception as e:
    print('ERROR:', e)
