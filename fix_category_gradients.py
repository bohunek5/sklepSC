import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the category banner overlay div
    pattern = r'background:\s*linear-gradient\(to top,\s*rgba\([^\)]+\)\s*0%,\s*rgba\([^\)]+\)\s*\d+%,\s*rgba\([^\)]+\)\s*100%\);'
    
    new_gradient = 'background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 50.1%, rgba(0,0,0,0) 100%);'
    
    content = re.sub(pattern, new_gradient, content)

    # Let's also check for any background that uses rgba(11,26,48,...) in linear-gradient
    pattern2 = r'background:\s*linear-gradient\(to top,\s*rgba\(11,26,48,1\)[^\)]*\)'
    content = re.sub(pattern2, new_gradient, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Category gradients fixed")
