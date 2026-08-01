import os
import re
import json

# 1. Fix mobile menu icon in all HTML files
html_files = [f for f in os.listdir('.') if f.endswith('.html')]

icon_to_replace = '<i class="ph ph-sparkle" aria-hidden="true"></i>'
replacement = '<img class="gemini-icon" src="images/prescot-pattern.png" style="width: 24px; height: 24px; object-fit: contain; margin-bottom: 4px; filter: brightness(0) invert(1);">'

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We only want to replace it in the context of "Zakup AI", but actually just replacing ph-sparkle everywhere is probably fine as it's only used for Zakup AI.
    if "ph-sparkle" in content:
        new_content = content.replace(icon_to_replace, replacement)
        # also handle case without aria-hidden
        new_content = new_content.replace('<i class="ph ph-sparkle"></i>', replacement)
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {html_file}")

# 2. Fix 360 config in js/products-data.js
with open('js/products-data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace images360Pattern and images360Count for the specific product.
# We will use regex to find PR-MAD-XX-1224 config and update it.
# The previous agent changed it to:
# "images360Pattern": "images/360/product360-{index}.jpg",
# "images360Count": 36,

import re
# We know the config is around line 40.
pattern = r'("title":\s*"Zasilacz PR-MAD-XX-1224".*?"has360":\s*true,\s*"images360Pattern":\s*)"images/360/product360-\{index\}\.jpg"(,\s*"images360Count":\s*)36'
new_js_content = re.sub(pattern, r'\1"images/360/PR-MAD-XX-1224/frame_{index}.png"\272', js_content, flags=re.DOTALL)

with open('js/products-data.js', 'w', encoding='utf-8') as f:
    f.write(new_js_content)

print("Updated js/products-data.js")
