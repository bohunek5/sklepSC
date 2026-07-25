import os
import re

agent_path = r'd:\MY-AI-AGENTS\sklepSC\js\ai-agent.js'
with open(agent_path, 'r', encoding='utf-8') as f: js = f.read()

# Change green button to white/navy
js = js.replace("cta.style.background = '#10b981';", "cta.style.background = '#ffffff';\n                cta.style.color = '#0b1a30';\n                cta.style.border = '1px solid #0b1a30';")
js = js.replace("cta.style.background = '#10b981'; // Green", "cta.style.background = '#ffffff';\n                  cta.style.color = '#0b1a30';\n                  cta.style.border = '1px solid #0b1a30';")

# Replace AI avatar SVG with PNG pattern
import re
js = re.sub(r'avatar\.innerHTML = `<svg class="gemini-icon" .*?</svg>`;', 
            'avatar.innerHTML = `<img src="images/prescot-pattern.png" style="width: 16px; height: 16px; object-fit: contain; border-radius: 4px;" alt="AI">`;', 
            js)

with open(agent_path, 'w', encoding='utf-8') as f: f.write(js)
print('Updated ai-agent.js')

# Update .gemini-icon in HTML files
for root, _, files in os.walk(r'd:\MY-AI-AGENTS\sklepSC'):
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
            
            # Find and replace <svg class="gemini-icon"...></svg> with the img tag
            new_img = '<img class="gemini-icon" src="images/prescot-pattern.png" style="width: 14px; height: 14px; object-fit: contain; margin-left: 4px; vertical-align: middle;">'
            content = re.sub(r'<svg class="gemini-icon"[^>]*>.*?</svg>', new_img, content, flags=re.DOTALL)
            
            with open(fp, 'w', encoding=enc) as f: f.write(content)

print('Updated HTML files')
