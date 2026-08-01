with open('js/products-data.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace images360Count: 72 with 36 for PR-MAD-XX-1224
new_js_content = js_content.replace('"images/360/PR-MAD-XX-1224/frame_{index}.png",\n    "images360Count": 72,', '"images/360/PR-MAD-XX-1224/frame_{index}.png",\n    "images360Count": 36,')

with open('js/products-data.js', 'w', encoding='utf-8') as f:
    f.write(new_js_content)
