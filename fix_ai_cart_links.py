import re

js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Replace all href='cart.html' with href='#' and add onclick
js = js.replace("cta.href = 'cart.html';", "cta.href = '#';\n                cta.onclick = (e) => { e.preventDefault(); if(window.openCartDrawer) window.openCartDrawer(); };")

# Inside the 'click' event listener for Add All to Cart button, it also changes href to cart.html
js = js.replace("cta.href = 'cart.html';", "cta.href = '#';")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print('Fixed cart links in ai-agent.js')
