import re

js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Fix config results HTML
old_tape = '''<div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${primary.product.title}</div>'''
new_tape = '''<div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;"><a href="product.html?id=${primary.product.id}" target="_blank" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${primary.product.title}</a></div>'''

old_psu = '''<div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${psu.product.title}</div>'''
new_psu = '''<div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;"><a href="product.html?id=${psu.product.id}" target="_blank" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${psu.product.title}</a></div>'''

js = js.replace(old_tape, new_tape)
js = js.replace(old_psu, new_psu)

# Fix search results HTML
old_search = '''<div style="font-weight: 600; font-size: 13px; margin-bottom: 2px;">${p.title}</div>'''
new_search = '''<div style="font-weight: 600; font-size: 13px; margin-bottom: 2px;"><a href="product.html?id=${p.id}" target="_blank" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${p.title}</a></div>'''

js = js.replace(old_search, new_search)

# Make images clickable too (Search)
old_img_search = '''<img src="${productImage(p)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; background: #fff;">'''
new_img_search = '''<a href="product.html?id=${p.id}" target="_blank" style="flex-shrink: 0;"><img src="${productImage(p)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; background: #fff;"></a>'''
js = js.replace(old_img_search, new_img_search)

# Make images clickable too (Config)
old_img_tape = '''<img src="${productImage(primary.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">'''
new_img_tape = '''<a href="product.html?id=${primary.product.id}" target="_blank" style="flex-shrink: 0;"><img src="${productImage(primary.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></a>'''
js = js.replace(old_img_tape, new_img_tape)

old_img_psu = '''<img src="${productImage(psu.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; background: #fff;">'''
new_img_psu = '''<a href="product.html?id=${psu.product.id}" target="_blank" style="flex-shrink: 0;"><img src="${productImage(psu.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; background: #fff;"></a>'''
js = js.replace(old_img_psu, new_img_psu)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print('Made product cards clickable in AI agent')
