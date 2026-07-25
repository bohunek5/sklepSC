import re

html_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(html_path, 'r', encoding='utf-8') as f: html = f.read()

# 1. CSS for avatar-ai
html = html.replace('background: #ff5a00;', 'background: #ffffff;')

# 2. CSS for send button
html = html.replace('.ai-input-area button {\n        position: absolute;\n        bottom: 8px;\n        right: 8px;\n        width: 36px;\n        height: 36px;\n        border-radius: 10px;\n        background: #ff5a00;', 
                    '.ai-input-area button {\n        position: absolute;\n        bottom: 8px;\n        right: 8px;\n        width: 36px;\n        height: 36px;\n        border-radius: 10px;\n        background: #ffffff;\n        border: 1px solid rgba(0,0,0,0.1);')

# The button hover
html = html.replace('.ai-input-area button:hover {\n        background: #ff7a33;\n      }',
                    '.ai-input-area button:hover {\n        background: #f1f5f9;\n      }')

# 3. HTML for Send Button SVG to IMG
new_button = '<button id="sendAiMsg">\n          <img src="images/prescot-pattern.png" style="width: 100%; height: 100%; object-fit: contain; padding: 4px; border-radius: 8px;" alt="Send">\n        </button>'
html = re.sub(r'<button id="sendAiMsg">.*?</button>', new_button, html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f: f.write(html)


# Now fix js/ai-agent.js
js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path, 'r', encoding='utf-8') as f: js = f.read()

js = re.sub(r'<div class="avatar avatar-ai">.*?</div>', 
            '<div class="avatar avatar-ai"><img src="images/prescot-pattern.png" style="width: 100%; height: 100%; object-fit: contain; padding: 4px; border-radius: 8px;"></div>', 
            js)

with open(js_path, 'w', encoding='utf-8') as f: f.write(js)
print('UI fixed for AI chat bubbles.')
