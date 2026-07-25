import codecs
import re

# Fix configurator.js
js_path = r'd:\MY-AI-AGENTS\sklepSC\js\configurator.js'
with codecs.open(js_path, 'r', 'utf-8') as f:
    js_content = f.read()

# The string to replace
old_str = " : 'szt.'}. Cena wymaga potwierdzenia w backendzie przed płatnością.</p>"
new_str = " : 'szt'}.</p>"

js_content = js_content.replace(old_str, new_str)
js_content = js_content.replace(" : 'szt.'}. Cena wymaga potwierdzenia w backendzie przed p'atno>ci .</p>", new_str)

with codecs.open(js_path, 'w', 'utf-8') as f:
    f.write(js_content)

print("Updated configurator.js text")
