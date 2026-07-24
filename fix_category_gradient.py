import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Search for the old gradient and replace it
    # We might have added it in a <style> block, let's find it.
    old_gradient = "background: linear-gradient(to top, rgba(11, 26, 48, 0.95) 0%, rgba(11, 26, 48, 0.7) 30%, transparent 80%) !important;"
    new_gradient = "background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 25%, transparent 50%) !important;"
    
    if old_gradient in content:
        content = content.replace(old_gradient, new_gradient)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
print("Category gradient updated")
