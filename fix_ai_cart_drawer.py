import re

# 1. Update shared-popups.js
js_path_popups = 'd:/MY-AI-AGENTS/sklepSC/js/shared-popups.js'
with open(js_path_popups, 'r', encoding='utf-8') as f:
    js_popups = f.read()

old_cond = "if (!window.location.pathname.includes('cart.html') && !window.location.pathname.includes('checkout.html'))"
new_cond = "if (!window.location.pathname.includes('cart.html') && !window.location.pathname.includes('checkout.html') && !window.location.pathname.includes('ai-shopping.html'))"

if old_cond in js_popups:
    js_popups = js_popups.replace(old_cond, new_cond)

with open(js_path_popups, 'w', encoding='utf-8') as f:
    f.write(js_popups)


# 2. Update ai-agent.js
js_path_ai = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path_ai, 'r', encoding='utf-8') as f:
    js_ai = f.read()

# Replace openCartDrawer in button clicks
js_ai = js_ai.replace("if(window.openCartDrawer) window.openCartDrawer();", "window.location.href = 'cart.html';")

# Prevent addItemsToCart from automatically opening the drawer
old_open_drawer = '''      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }'''
if old_open_drawer in js_ai:
    js_ai = js_ai.replace(old_open_drawer, "// window.location.href = 'cart.html'; // We don't auto-redirect immediately on AI suggest, user must click Przejdź do kasy")

with open(js_path_ai, 'w', encoding='utf-8') as f:
    f.write(js_ai)

print("Updated cart drawer behavior.")
