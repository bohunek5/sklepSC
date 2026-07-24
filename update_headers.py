import os
import re

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract header HTML
header_html_match = re.search(r'(<header class="mockup-header"[^>]*>.*?</header>)', index_content, re.DOTALL)
header_html = header_html_match.group(1)

# Extract mobile menu HTML
mobile_html_match = re.search(r'(<div class="mobile-menu"[^>]*>.*?</div>\s*<!-- \/Mobile Menu -->)', index_content, re.DOTALL)
if not mobile_html_match:
    mobile_html_match = re.search(r'(<!-- Mobile Menu -->\s*<div class="mobile-menu"[^>]*>.*?</ul>\s*</div>)', index_content, re.DOTALL)
if not mobile_html_match:
    mobile_html_match = re.search(r'(<div class="mobile-menu"[^>]*>.*?</ul>\s*</div>)', index_content, re.DOTALL)
mobile_html = mobile_html_match.group(1)

# Adjust header HTML for subpages (dark logo by default)
subpage_header_html = header_html.replace('images/logo-white.png', 'images/logo-dark.png')

# Now process all html files
html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html']

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace header HTML
    content = re.sub(r'<header[^>]*>.*?</header>', subpage_header_html, content, flags=re.DOTALL)
    
    # 2. Replace mobile menu HTML
    content = re.sub(r'(<!-- Mobile Menu -->\s*)?<div class="mobile-menu"[^>]*>.*?</ul>\s*</div>(\s*<!-- /Mobile Menu -->)?', mobile_html, content, flags=re.DOTALL)
    
    # 3. Replace CSS for mockup-header
    # Let's find the inline CSS for mockup-header in the subpage and replace it.
    # In subpages, we want the default state to have dark text and dark logo.
    # We will just replace the .mockup-nav a { color: ... } to use var(--primary-color)
    content = re.sub(r'(\.mockup-nav\s+a\s*\{[^}]*color:\s*)var\(--white\)', r'\1var(--primary-color)', content)
    content = re.sub(r'(\.mockup-action-icon\s*\{[^}]*color:\s*)var\(--white\)', r'\1var(--primary-color)', content)
    
    # Change the default background of mockup-header to be solid white or light transparent
    # index.html uses transparent. Subpages should use white.
    # Wait, the easiest is to just enforce .mockup-header { background: #ffffff; } in subpages?
    # No, let's replace `background: transparent;` inside `.mockup-header {` with `background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border-bottom: 1px solid rgba(0, 0, 0, 0.05);`
    # Let's use a regex to find the .mockup-header block and modify it.
    def replace_header_bg(match):
        block = match.group(0)
        block = re.sub(r'background:\s*transparent;', 'background: rgba(255, 255, 255, 0.95);\n      backdrop-filter: blur(15px);\n      -webkit-backdrop-filter: blur(15px);\n      border-bottom: 1px solid rgba(0, 0, 0, 0.05);', block)
        return block
    
    content = re.sub(r'\.mockup-header\s*\{[^}]+\}', replace_header_bg, content, count=1)
    
    # 4. Fix JS scroll listener in subpages so it doesn't change logo to white
    content = content.replace("headerLogo.src = 'images/logo-white.png';", "headerLogo.src = 'images/logo-dark.png';")
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")

