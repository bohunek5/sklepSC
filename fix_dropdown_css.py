import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract the new dropdown CSS from index.html
# Use the LAST occurrence since there are two (the first one is old/unused)
matches = list(re.finditer(r'(/\*\s*MAGIC DROPDOWN - DESKTOP\s*\*/.*?)(?=/\*\s*MOBILE BOTTOM NAV CSS\s*\*/)', index_content, flags=re.DOTALL))
if not matches:
    print("Could not find magic dropdown CSS in index.html")
    exit(1)

new_css = matches[-1].group(1)

# Process all html files
html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html' and f != 'old_index.html']

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the block in the target file
    # Look for the FIRST occurrence in the target file (since there's usually only one)
    # Actually, we should just replace everything from /* MAGIC DROPDOWN to /* MOBILE BOTTOM NAV
    content, count = re.subn(r'/\*\s*MAGIC DROPDOWN - DESKTOP\s*\*/.*?(?=/\*\s*MOBILE BOTTOM NAV CSS\s*\*/)', new_css, content, flags=re.DOTALL)
    
    if count > 0:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"Skipped {filename} (CSS block not found)")

