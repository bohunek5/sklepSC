import codecs
import re

def process_file(filepath, replacements):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        html = f.read()
    
    for old, new in replacements.items():
        html = html.replace(old, new)
        
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(html)
    print(f"Updated {filepath}")

# Update shop.html
process_file('d:/MY-AI-AGENTS/sklepSC/shop.html', {
    "url('images/kuchnia.jpg')": "url('images/led_kitchen.png')"
})

# Update contact.html
process_file('d:/MY-AI-AGENTS/sklepSC/contact.html', {
    "url('images/stairs.jpg')": "url('images/led_office.png')"
})

# Update about.html
process_file('d:/MY-AI-AGENTS/sklepSC/about.html', {
    "url('images/lb2.jpg')": "url('images/led_showroom.png')"
})

# Update blog.html
process_file('d:/MY-AI-AGENTS/sklepSC/blog.html', {
    "url('images/contemporary-apartment-interior-with-stylish-decor-2026-03-10-02-45-38-utc.webp')": "url('images/led_facade.png')"
})

# Update index.html category banners
with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'r', 'utf-8') as f:
    index_html = f.read()

# We only want to replace inside the mockup-banners section
parts = index_html.split('<section class="mockup-banners"')
if len(parts) > 1:
    before = parts[0]
    after = '<section class="mockup-banners"' + parts[1]
    
    # We have 8 banners. Let's replace the first 8 occurrences of category-banner-bg backgrounds
    new_backgrounds = [
        "url('images/led_living_room.png')",
        "url('images/led_kitchen.png')",
        "url('images/led_office.png')",
        "url('images/led_staircase.png')",
        "url('images/led_showroom.png')",
        "url('images/led_facade.png')",
        "url('images/led_living_room.png')",
        "url('images/led_showroom.png')"
    ]
    
    for bg in new_backgrounds:
        after = re.sub(r'background:\s*url\([^)]+\)', f'background: {bg}', after, count=1)
        
    index_html = before + after
    
    with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'w', 'utf-8') as f:
        f.write(index_html)
    print("Updated index.html")
else:
    print("Could not find mockup-banners section in index.html")
