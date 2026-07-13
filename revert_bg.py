import glob
import re

html_files = glob.glob("*.html")
for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Revert mockup-header background from white to transparent
    content = re.sub(
        r'background:\s*rgba\(255,\s*255,\s*255,\s*0\.95\);\s*backdrop-filter:\s*blur\(15px\);\s*-webkit-backdrop-filter:\s*blur\(15px\);\s*border-bottom:\s*1px\s*solid\s*rgba\(0,\s*0,\s*0,\s*0\.05\);',
        'background: transparent;',
        content
    )
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
print("Reverted header background to transparent!")

