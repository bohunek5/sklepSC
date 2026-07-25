import codecs
import os
import glob
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

html_files = glob.glob(os.path.join(workspace, '*.html'))

enhanced_count = 0

for file_path in html_files:
    if file_path.endswith('_old.html') or file_path.endswith('original_index.html'):
        continue
    try:
        with codecs.open(file_path, 'r', 'utf-8', errors='ignore') as f:
            content = f.read()
        
        new_content = content
        
        # 1. Replace dark washed-out 0.6 overlay with a crystal-clear subtle gradient overlay
        new_content = new_content.replace('background: rgba(11, 26, 48, 0.6);', 'background: linear-gradient(180deg, rgba(11, 26, 48, 0.18) 0%, rgba(11, 26, 48, 0.5) 100%);')
        new_content = new_content.replace('background: rgba(0, 0, 0, 0.6);', 'background: linear-gradient(180deg, rgba(11, 26, 48, 0.18) 0%, rgba(11, 26, 48, 0.5) 100%);')
        
        # 2. Add high-clarity contrast/sharpness filters to .page-hero styles
        new_content = re.sub(r'class="page-hero" style="background: url\(\'([^\']+)\'\) center/cover no-repeat;', r'class="page-hero" style="background: url(\'\1\') center/cover no-repeat; filter: contrast(1.08) brightness(1.05); image-rendering: -webkit-optimize-contrast;', new_content)
        
        if new_content != content:
            with codecs.open(file_path, 'w', 'utf-8') as f:
                f.write(new_content)
            enhanced_count += 1
            print(f"Enhanced hero clarity in: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print(f"Total files updated for crystal clear hero imagery: {enhanced_count}")
