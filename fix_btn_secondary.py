import os

cfg_js_path = r"d:\MY-AI-AGENTS\sklepSC\js\configurator.js"
with open(cfg_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'class="button-secondary"',
    'class="mockup-btn" style="background: transparent; color: #08192f; border: 1px solid #08192f; margin-top: 15px;" onmouseover="this.style.background=\'#08192f\'; this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\'; this.style.color=\'#08192f\'"'
)

with open(cfg_js_path, 'w', encoding='utf-8') as f:
    f.write(content)
