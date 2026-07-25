import os
import re
from PIL import Image

# 1. Fix the pattern image (make it square with padding)
img_path = 'd:/MY-AI-AGENTS/sklepSC/images/prescot-pattern.png'
try:
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    # Create a new square image, larger than the max dimension to add margin
    new_size = int(max(w, h) * 1.3)
    square_img = Image.new('RGBA', (new_size, new_size), (0, 0, 0, 0))
    offset = ((new_size - w) // 2, (new_size - h) // 2)
    square_img.paste(img, offset)
    square_img.save(img_path)
    print("Pattern squared and padded.")
except Exception as e:
    print("Error processing image:", e)

# 2. Fix the J cutoff in CSS
css_path = 'd:/MY-AI-AGENTS/sklepSC/css/configurator.css'
with open(css_path, 'r', encoding='utf-8') as f: css = f.read()
if 'line-height: 1.3;' not in css:
    css = css.replace('.config-step h3 {\n    max-width: 780px;\n    margin: 0;\n    color: var(--navy);\n    font-family: "Outfit", sans-serif;\n    font-size: clamp(30px, 3.3vw, 48px);', 
                      '.config-step h3 {\n    max-width: 780px;\n    margin: 0;\n    color: var(--navy);\n    font-family: "Outfit", sans-serif;\n    font-size: clamp(30px, 3.3vw, 48px);\n    line-height: 1.3;\n    padding-bottom: 5px;')
with open(css_path, 'w', encoding='utf-8') as f: f.write(css)

# 3. Swap text and icon order in HTML files
for root, _, files in os.walk('d:/MY-AI-AGENTS/sklepSC'):
    if 'node_modules' in root or 'dist' in root or '.git' in root: continue
    for file in files:
        if file.endswith('.html'):
            fp = os.path.join(root, file)
            try:
                with open(fp, 'r', encoding='utf-8') as f: content = f.read()
                enc = 'utf-8'
            except UnicodeDecodeError:
                with open(fp, 'r', encoding='utf-16') as f: content = f.read()
                enc = 'utf-16'
            
            # Look for "Zakup AI <img ...>" and replace with "<img ...> Zakup AI"
            # It's currently: Zakup AI <img class="gemini-icon" src="images/prescot-pattern.png" style="width: 14px; height: 14px; object-fit: contain; margin-left: 4px; vertical-align: middle;">
            # Note: The user wants margin-right instead of margin-left, and I should make sure it fits nicely.
            
            # Find the icon img tag
            match = re.search(r'Zakup AI\s*<img class="gemini-icon"[^>]*>', content)
            if match:
                img_tag = re.search(r'<img class="gemini-icon"[^>]*>', match.group(0)).group(0)
                # Fix the margins inside the img tag
                img_tag = img_tag.replace('margin-left: 4px', 'margin-right: 6px')
                # Also maybe increase size a bit to 16px since we added padding to the PNG
                img_tag = img_tag.replace('width: 14px; height: 14px;', 'width: 18px; height: 18px;')
                
                new_str = f'{img_tag}Zakup AI'
                content = content.replace(match.group(0), new_str)
                with open(fp, 'w', encoding=enc) as f: f.write(content)

print("Updated HTML files for Zakup AI order.")
