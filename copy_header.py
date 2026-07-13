import os
import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract header
header_match = re.search(r'(<header class="mockup-header"[^>]*>.*?</header>)', index_content, re.DOTALL)
if not header_match:
    print("Could not find header in index.html")
    exit(1)
header_html = header_match.group(1)

# Extract mobile menu
mobile_match = re.search(r'(<div class="mobile-menu"[^>]*>.*?</div>\s*<!-- \/Mobile Menu -->)', index_content, re.DOTALL)
if not mobile_match:
    mobile_match = re.search(r'(<!-- Mobile Menu -->\s*<div class="mobile-menu"[^>]*>.*?</ul>\s*</div>)', index_content, re.DOTALL)
if not mobile_match:
    print("Could not find mobile menu in index.html")
    exit(1)
mobile_html = mobile_match.group(1)

print("Extracted header length:", len(header_html))
print("Extracted mobile menu length:", len(mobile_html))

# Process all html files
for filename in os.listdir('.'):
    if filename.endswith('.html') and filename != 'index.html':
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace header
        # Some files might have different header classes or ids, let's find the header tag.
        # But wait, in the shop and other pages, they might have `<header id="mainHeader">` or similar.
        new_content = re.sub(r'<header[^>]*>.*?</header>', header_html, content, flags=re.DOTALL)
        
        # Replace mobile menu
        new_content = re.sub(r'<!-- Mobile Menu -->.*?</div>', mobile_html, new_content, flags=re.DOTALL)
        
        # Also let's try a regex for the mobile menu without the comment just in case
        new_content = re.sub(r'<div class="mobile-menu"[^>]*>.*?</div>', mobile_html, new_content, flags=re.DOTALL)
        
        # Save
        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")

