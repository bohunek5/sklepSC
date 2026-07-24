import os
import re

base_dir = '/Users/karolbohdanowicz/my-ai-agents/scratch/cooken-offline'
html_files = [f for f in os.listdir(base_dir) if f.endswith('.html') and not f.startswith('old_') and not '_' in f]

print("Found HTML files:", html_files)

for fname in sorted(html_files):
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    title = title_match.group(1) if title_match else 'NO TITLE'
    
    cooken_count = len(re.findall(r'cooken', content, re.IGNORECASE))
    prescot_count = len(re.findall(r'prescot', content, re.IGNORECASE))
    
    print(f"{fname:15} | Title: {title[:40]:40} | Cooken: {cooken_count} | Prescot: {prescot_count}")
