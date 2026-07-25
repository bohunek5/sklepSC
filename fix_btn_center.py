import re

html_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace position bottom with top 50%
old_btn_css = '''position: absolute;
        bottom: 8px;
        right: 8px;'''

new_btn_css = '''position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;'''

if old_btn_css in html:
    html = html.replace(old_btn_css, new_btn_css)
else:
    # try regex just in case
    html = re.sub(r'bottom:\s*8px;', 'top: 50%;\n        transform: translateY(-50%);', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Centered button vertically.")
