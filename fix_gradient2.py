import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_gradient = "rgba\\(0,0,0,0\\.5\\) 50%"
new_gradient = "rgba(0,0,0,0.9) 50%"

content = re.sub(old_gradient, new_gradient, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated gradient 2 in index.html")
