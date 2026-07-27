import glob
import re

def fix_all_logos_dynamically():
    html_files = glob.glob('*.html')
    
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        
        # We find blocks like:
        # .site-header .brand img {
        #   height: 28px !important;
        #   max-width: none !important;
        #   object-fit: contain !important;
        #   transform: none;
        # }
        
        pattern = re.compile(r'(\.site-header \.brand img \{)([^}]+?max-width: none !important;[^}]+?)(\})')
        
        def replace_block(match):
            inner = match.group(2)
            # Replace max-width: none !important; with max-width: 170px !important;
            inner = re.sub(r'max-width:\s*none\s*!important;', 'max-width: 170px !important;', inner)
            # Replace height if it's auto or whatever to 36px
            inner = re.sub(r'height:\s*(?:auto|28px|36px)\s*!important;', 'height: 36px !important;', inner)
            return f"{match.group(1)}{inner}{match.group(3)}"
            
        if pattern.search(content):
            content = pattern.sub(replace_block, content)
            modified = True

        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed dynamically logo in {f}")

if __name__ == '__main__':
    fix_all_logos_dynamically()
