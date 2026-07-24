import os
import shutil
import re

# Copy favicon.svg to root
src = 'd:/MY-AI-AGENTS/sklepSC/public/favicon.svg'
dst = 'd:/MY-AI-AGENTS/sklepSC/favicon.svg'
if os.path.exists(src):
    shutil.copy(src, dst)
else:
    print(f"Warning: {src} not found!")

# Update all html files
for root, dirs, files in os.walk('d:/MY-AI-AGENTS/sklepSC'):
    if 'node_modules' in root or 'dist' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            fp = os.path.join(root, file)
            
            enc = 'utf-8'
            try:
                with open(fp, 'r', encoding='utf-8') as f: content = f.read()
            except UnicodeDecodeError:
                try:
                    with open(fp, 'r', encoding='utf-16') as f: content = f.read()
                    enc = 'utf-16'
                except:
                    continue
            
            new_icon = '<link rel="icon" type="image/svg+xml" href="favicon.svg">'
            
            if 'href="favicon.svg"' in content:
                continue
                
            if '<link rel="icon"' in content:
                content = re.sub(r'<link[^>]*rel=[\"\']icon[\"\'][^>]*>', new_icon, content)
            else:
                content = content.replace('<head>', '<head>\n  <link rel="icon" type="image/svg+xml" href="favicon.svg">')
            
            with open(fp, 'w', encoding=enc) as f: f.write(content)

print('Favicon updated in all HTML files.')
