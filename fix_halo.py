import re

html_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace border with transparent
html = html.replace('border: 1px solid rgba(255,255,255,0.1);', 'border: 1px solid transparent;')

# Replace focused CSS
old_focused = '''      .ai-input-area.focused {
        border-color: rgba(255,90,0,0.5);
        box-shadow: 0 4px 25px rgba(255,90,0,0.15);
      }'''

new_focused = '''      @property --halo-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      
      .ai-input-area::before {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: 17px;
        padding: 1px;
        background: rgba(255,255,255,0.1);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        transition: opacity 0.3s;
      }

      .ai-input-area::after {
        content: "";
        position: absolute;
        inset: -1px;
        border-radius: 17px;
        padding: 1.5px; /* Slightly thicker for the glow effect */
        background: conic-gradient(from var(--halo-angle, 0deg), transparent 40%, rgba(255,255,255,0.8) 80%, #ff5a00 100%);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .ai-input-area.focused::before {
        opacity: 0;
      }
      .ai-input-area.focused::after {
        opacity: 1;
        animation: spinHalo 2.5s linear infinite;
      }
      .ai-input-area.focused {
        box-shadow: 0 4px 25px rgba(255,90,0,0.15);
      }

      @keyframes spinHalo {
        to { --halo-angle: 360deg; }
      }'''

if old_focused in html:
    html = html.replace(old_focused, new_focused)
else:
    # Just to be safe if formatting differs
    html = re.sub(r'\.ai-input-area\.focused\s*\{\s*border-color:[^}]+\}', new_focused, html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Added beautiful halo effect to ai-input-area.")
