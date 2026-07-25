import re

# 1. Fix ai-shopping.html
html_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Fix avatar alignment
if 'justify-content: center;' not in html.split('.avatar {')[1].split('}')[0]:
    html = re.sub(r'(\.avatar\s*\{[^}]*)(\})', r'\1  justify-content: center;\n\2', html)

# Fix button CSS
html = re.sub(r'\.ai-input-area button\s*\{[^}]*\}', 
              '.ai-input-area button {\n        position: absolute;\n        bottom: 8px;\n        right: 8px;\n        width: 36px;\n        height: 36px;\n        border-radius: 10px;\n        background: #ffffff;\n        border: 1px solid rgba(0,0,0,0.1);\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      }', html)

html = re.sub(r'\.ai-input-area button:hover\s*\{[^}]*\}', 
              '.ai-input-area button:hover {\n        background: #ff5a00;\n      }\n      .ai-input-area button:hover img {\n        filter: brightness(0) invert(1);\n      }', html)

# Make sure button has the img
new_btn = '<button type="button" aria-label="Wyślij">\n              <img src="images/prescot-pattern.png" style="width: 22px; height: 22px; object-fit: contain; transition: filter 0.2s;" alt="Send">\n            </button>'
html = re.sub(r'<button[^>]*>.*?</button>', new_btn, html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Fix index.html scroll transition
index_path = 'd:/MY-AI-AGENTS/sklepSC/index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    index = f.read()

index = index.replace("document.getElementById('mainHeader')", "document.getElementById('siteHeader')")
# There is no headerLogo id in the HTML, let's just make it look for the image inside .brand
index = index.replace("document.getElementById('headerLogo')", "document.querySelector('.brand img')")

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index)

print("Fixed UI issues.")
