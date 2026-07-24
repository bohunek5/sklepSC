import re

css_path = 'd:/MY-AI-AGENTS/sklepSC/css/configurator.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

overlay_css = """
/* Darken selected option and show DALEJ overlay */
.choice-card { position: relative; overflow: hidden; }
.choice-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
input[type="radio"]:checked ~ .dalej-overlay {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  pointer-events: auto;
}

.dalej-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  opacity: 0;
  background: linear-gradient(90deg, #ff5a00, #ff9a64);
  color: #fff;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(255, 90, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.dalej-overlay:hover {
  transform: translate(-50%, -50%) scale(1.05);
  box-shadow: 0 6px 25px rgba(255, 90, 0, 0.6);
}
.choice-card:has(input[type="radio"]:checked)::after {
  opacity: 1;
}

/* For segmented controls (small options) */
.segmented-control label { position: relative; overflow: hidden; }
.segmented-control label:has(input[type="radio"]:checked)::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  border-radius: inherit;
  pointer-events: none;
}
.segmented-control label .dalej-overlay {
  top: 50%; left: 50%;
  padding: 8px 16px;
  font-size: 12px;
}
"""

if 'dalej-overlay' not in css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(overlay_css)

js_path = 'd:/MY-AI-AGENTS/sklepSC/js/configurator.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Add JS logic to inject .dalej-overlay spans into all labels
js_injection = """
  // Inject DALEJ overlay into all option labels
  document.querySelectorAll('.choice-card, .segmented-control label').forEach(label => {
    if (!label.querySelector('.dalej-overlay')) {
      const btn = document.createElement('span');
      btn.className = 'dalej-overlay';
      btn.textContent = 'Dalej';
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const radio = label.querySelector('input[type="radio"]');
        if (radio && !radio.checked) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
        nextButton.click();
      };
      label.appendChild(btn);
    }
  });
"""

# inject right after loadCatalog();
if 'dalej-overlay' not in js:
    js = js.replace('loadCatalog();', 'loadCatalog();\n' + js_injection)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)

print("Added DALEJ overlays to JS and CSS.")
