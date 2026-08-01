import re

with open('product.html', 'r') as f:
    content = f.read()

# Let's extract the whole script tag and check what happens when it's evaluated
script = re.search(r'<script type="module">([\s\S]*?)</script>', content)
if script:
    with open('temp_script.js', 'w') as out:
        out.write(script.group(1))
    print("Script written to temp_script.js")
