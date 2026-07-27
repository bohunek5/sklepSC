import glob
import re

def fix_logos_precisely():
    html_files = glob.glob('*.html')
    
    # We want to match exactly the bad logo block
    pattern = re.compile(r'\.site-header \.brand img \{\s*height: auto !important; max-width: 140px !important;\s*max-width: none !important;\s*object-fit: contain !important;\s*transform: none;\s*\}')
    
    replacement = """.site-header .brand img {
  height: 36px !important;
  max-width: 170px !important;
  object-fit: contain !important;
  transform: none;
}"""

    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if pattern.search(content):
            content = pattern.sub(replacement, content)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed logo in {f}")

if __name__ == '__main__':
    fix_logos_precisely()
