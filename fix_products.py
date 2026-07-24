import json
import re

with open('js/products-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the first two products with something else or just remove them.
# The array starts with `const defaultProducts = [`
# Let's parse the array by extracting the JSON if possible, but JS might not be strict JSON.

# It's easier to just remove them with regex since we know their IDs
content = re.sub(r'\{\s*"id": 8291636215978,.*?\},', '', content, flags=re.DOTALL)
content = re.sub(r'\{\s*"id": 8291636740266,.*?\},', '', content, flags=re.DOTALL)

with open('js/products-data.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed 3D/360 products")
