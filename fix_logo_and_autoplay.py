import codecs
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

# Fix index.html videos and logo size
with codecs.open(f'{workspace}/index.html', 'r', 'utf-8') as f:
    content = f.read()

# Add autoplay loop to the 4 hero videos
content = content.replace('muted playsinline preload="auto"', 'muted autoplay loop playsinline preload="auto"')

# Fix logo size
content = content.replace('height: 40px !important;', 'height: 28px !important;')
content = content.replace('transform: translateY(2px);', 'transform: none;')

with codecs.open(f'{workspace}/index.html', 'w', 'utf-8') as f:
    f.write(content)

# We should also fix logo size in all other HTML files that received the global css override
import glob
import os

html_files = glob.glob(os.path.join(workspace, '*.html'))
for file_path in html_files:
    if "original" in file_path or "old" in file_path or "59840a7" in file_path or "58efa07" in file_path:
        continue
    if "index.html" in file_path:
        continue # Already processed
        
    with codecs.open(file_path, 'r', 'utf-8') as f:
        file_content = f.read()
        
    if 'height: 40px !important;' in file_content:
        file_content = file_content.replace('height: 40px !important;', 'height: 28px !important;')
        file_content = file_content.replace('transform: translateY(2px);', 'transform: none;')
        with codecs.open(file_path, 'w', 'utf-8') as f:
            f.write(file_content)

print("Fixed logo size and added autoplay to videos")
