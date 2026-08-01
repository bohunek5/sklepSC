with open('js/products-data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Fix the mess
import re
new_js_content = js_content.replace('"images/360/PR-MAD-XX-1224/frame_{index}.png"º,', '"images/360/PR-MAD-XX-1224/frame_{index}.png",\n    "images360Count": 72,')

with open('js/products-data.js', 'w', encoding='utf-8') as f:
    f.write(new_js_content)
