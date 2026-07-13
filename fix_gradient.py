import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the gradient in the style block
old_gradient = r"background: linear-gradient\(to top, rgba\(0, 0, 0, 0\.85\) 0%, rgba\(0,0,0,0\.4\) 50%, transparent 100%\) !important;"
new_gradient = "background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0.5) 50%, transparent 60%, transparent 100%) !important;"

content = re.sub(old_gradient, new_gradient, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated gradient in index.html")
