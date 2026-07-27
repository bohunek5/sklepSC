import glob
import re

def strip_and_run():
    html_files = glob.glob('*.html')
    
    # Strip existing block
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        start_idx = content.find("<!-- MOBILE UI FIXES -->")
        if start_idx != -1:
            end_idx = content.find("<!-- END MOBILE UI FIXES -->") + len("<!-- END MOBILE UI FIXES -->")
            content = content[:start_idx] + content[end_idx:]
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Stripped from {f}")

if __name__ == '__main__':
    strip_and_run()
