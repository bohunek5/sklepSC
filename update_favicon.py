import os
import shutil

# 1. Copy the pattern image
src = r'C:\Users\Karol Bohdanowicz\Downloads\PRESCOT_pattern2.png'
dst = r'd:\MY-AI-AGENTS\sklepSC\images\prescot-pattern.png'
shutil.copy(src, dst)

# 2. Update favicon in all HTML files
for root, _, files in os.walk(r'd:\MY-AI-AGENTS\sklepSC'):
    if 'node_modules' in root or 'dist' in root or '.git' in root: continue
    for file in files:
        if file.endswith('.html'):
            fp = os.path.join(root, file)
            enc = 'utf-8'
            try:
                with open(fp, 'r', encoding='utf-8') as f: content = f.read()
            except UnicodeDecodeError:
                with open(fp, 'r', encoding='utf-16') as f: content = f.read()
                enc = 'utf-16'
            
            content = content.replace('href="favicon.svg"', 'href="images/prescot-pattern.png"')
            content = content.replace('type="image/svg+xml"', 'type="image/png"')
            
            with open(fp, 'w', encoding=enc) as f: f.write(content)

print('Copied pattern and updated favicons.')
