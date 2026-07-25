import re

html_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'

# 1. Update HTML CSS
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

css_to_add = '''
      .ai-add-all-btn {
        justify-content: center;
        background: #0b1a30 !important;
        color: #ffffff !important;
        text-decoration: none !important;
        font-weight: bold !important;
        border: 1px solid transparent !important;
        margin-top: 12px;
      }
      .ai-add-all-btn:hover {
        background: #ffffff !important;
        color: #0b1a30 !important;
        border: 1px solid #0b1a30 !important;
      }
      .ai-add-all-btn.bought {
        background: #ffffff !important;
        color: #0b1a30 !important;
        border: 1px solid #0b1a30 !important;
      }
'''
if '.ai-add-all-btn' not in html:
    html = html.replace('.pro-product-card {', css_to_add + '\n      .pro-product-card {')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update JS
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# We need to remove inline styles and add the new class
# There are multiple occurrences of this CTA styling. Let's do it using regex.
js = re.sub(r"cta\.className = 'pro-product-card';\s*cta\.style\.justifyContent = 'center';[\s\S]*?cta\.style\.marginTop = '12px';",
            "cta.className = 'pro-product-card ai-add-all-btn' + (isBought ? ' bought' : '');", js)

js = re.sub(r"cta\.className = 'pro-product-card';\s*cta\.style\.justifyContent = 'center';[\s\S]*?cta\.style\.border = 'none';",
            "cta.className = 'pro-product-card ai-add-all-btn' + (overallBuy ? ' bought' : '');", js)

# Fix the onclick where it sets the colors manually
js = js.replace("cta.style.background = '#ffffff';\n                  cta.style.color = '#0b1a30';\n                  cta.style.border = '1px solid #0b1a30';", "cta.classList.add('bought');")
js = js.replace("cta.style.background = '#ffffff';\n                cta.style.color = '#0b1a30';\n                cta.style.border = '1px solid #0b1a30';", "cta.classList.add('bought');")
js = js.replace("cta.style.background = '#ffffff';\n                  cta.style.color = '#0b1a30';\n                  cta.style.border = '1px solid #0b1a30'; // Green", "cta.classList.add('bought');")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated CTA button styles.")
