import json
import re

with open('js/products-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace images for the first 8 products with visualisations
visualizations = [
    '"/images/kuchnia.jpg"',
    '"/images/wiz1.png"',
    '"/images/stairs.jpg"',
    '"/images/szafy.jpg"',
    '"/images/stranda.webp"',
    '"/images/lb2.jpg"',
    '"/images/oprawa.jpg"',
    '"/images/parking.jpg"'
]

def replace_image(match):
    if not hasattr(replace_image, 'counter'):
        replace_image.counter = 0
    if replace_image.counter < 8:
        img = visualizations[replace_image.counter]
        replace_image.counter += 1
        return match.group(1) + img + match.group(3)
    return match.group(0)

content = re.sub(r'("images":\s*\[\s*)(.*?)(\s*\])', replace_image, content)

with open('js/products-data.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated product images in products-data.js to visualisations.")
