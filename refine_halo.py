import re

html_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update the halo gradient to be more delicate and slower
html = html.replace('background: conic-gradient(from var(--halo-angle, 0deg), transparent 40%, rgba(255,255,255,0.8) 80%, #ff5a00 100%);',
                    'background: conic-gradient(from var(--halo-angle, 0deg), transparent 65%, rgba(255,255,255,0.3) 90%, #ff5a00 100%);')

html = html.replace('animation: spinHalo 2.5s linear infinite;',
                    'animation: spinHalo 4.5s linear infinite;')

# 2. Update the background watermark logo
old_watermark = '''      .ai-shopping-wrapper::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60vw;
        height: 60vw;
        max-width: 600px;
        max-height: 600px;
        background: url('images/logo-white.png') center/contain no-repeat;
        opacity: 0.02; /* Bardzo delikatny znak wodny */
        z-index: -1;
        pointer-events: none;
      }'''

new_watermark = '''      .ai-shopping-wrapper::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60vw;
        height: 60vw;
        max-width: 600px;
        max-height: 600px;
        background: url('images/logo-white.png') center/contain no-repeat;
        opacity: 0.05; /* Trochę jaśniejsze by było widać glow */
        filter: drop-shadow(0 0 12px #ff5a00); /* Delikatna pomarańczowa łuna */
        z-index: -1;
        pointer-events: none;
      }'''

if old_watermark in html:
    html = html.replace(old_watermark, new_watermark)
else:
    # use regex just in case
    html = re.sub(r'\.ai-shopping-wrapper::before\s*\{[^}]+\}', new_watermark, html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated halo and background logo styles.")
