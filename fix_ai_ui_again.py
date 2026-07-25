import re

with open('d:/MY-AI-AGENTS/sklepSC/ai-shopping.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix avatar alignment
html = html.replace('.avatar {\n        width: 32px;\n        height: 32px;\n        border-radius: 8px;\n        display: flex;\n        align-items: center;\n        flex-shrink: 0;\n      }',
                    '.avatar {\n        width: 32px;\n        height: 32px;\n        border-radius: 8px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        flex-shrink: 0;\n      }')

# Replace the send button contents
old_btn_regex = r'<button type="button" aria-label="Wy\u015blij"[^>]*>.*?</button>'
# Also handle different encodings just in case
old_btn_regex2 = r'<button type="button"[^>]*>.*?</button>'

new_btn = '''<button type="button" aria-label="Wyślij">
              <img src="images/prescot-pattern.png" style="width: 22px; height: 22px; object-fit: contain; transition: filter 0.2s;" alt="Send">
            </button>'''

html = re.sub(r'<button type="button"[^>]*>.*?</button>', new_btn, html, flags=re.DOTALL)

# Update hover CSS for the button
# Currently:
# .ai-input-area button:hover {
#   background: #f1f5f9;
# }
html = html.replace('.ai-input-area button:hover {\n        background: #f1f5f9;\n      }',
                    '.ai-input-area button:hover {\n        background: #e14f27;\n      }\n      .ai-input-area button:hover img {\n        filter: brightness(0) invert(1);\n      }')

# Also fix the avatar image padding in js/ai-agent.js
with open('d:/MY-AI-AGENTS/sklepSC/js/ai-agent.js', 'r', encoding='utf-8') as f:
    js = f.read()
js = js.replace('padding: 4px;', 'width: 24px !important; height: 24px !important; object-fit: contain;')
with open('d:/MY-AI-AGENTS/sklepSC/js/ai-agent.js', 'w', encoding='utf-8') as f:
    f.write(js)

with open('d:/MY-AI-AGENTS/sklepSC/ai-shopping.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("AI UI fixed.")
