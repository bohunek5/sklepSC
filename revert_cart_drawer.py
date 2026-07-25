import re

# 1. Revert shared-popups.js
js_path_popups = 'd:/MY-AI-AGENTS/sklepSC/js/shared-popups.js'
with open(js_path_popups, 'r', encoding='utf-8') as f:
    js_popups = f.read()

bad_cond = "if (!window.location.pathname.includes('cart.html') && !window.location.pathname.includes('checkout.html') && !window.location.pathname.includes('ai-shopping.html'))"
good_cond = "if (!window.location.pathname.includes('cart.html') && !window.location.pathname.includes('checkout.html'))"

if bad_cond in js_popups:
    js_popups = js_popups.replace(bad_cond, good_cond)

with open(js_path_popups, 'w', encoding='utf-8') as f:
    f.write(js_popups)


# 2. Revert ai-agent.js
js_path_ai = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path_ai, 'r', encoding='utf-8') as f:
    js_ai = f.read()

# Revert button clicks
js_ai = js_ai.replace("window.location.href = 'cart.html';", "if(window.openCartDrawer) window.openCartDrawer();")

# Revert addItemsToCart
bad_open_drawer = "// window.location.href = 'cart.html'; // We don't auto-redirect immediately on AI suggest, user must click Przejdź do kasy"
good_open_drawer = '''      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }'''
if bad_open_drawer in js_ai:
    js_ai = js_ai.replace(bad_open_drawer, good_open_drawer)

with open(js_path_ai, 'w', encoding='utf-8') as f:
    f.write(js_ai)

print("Reverted cart drawer behavior to slide out.")
