import re

with open('original_index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# Extract original slider
orig_slider = re.search(r'<section class="mockup-hero-slider">.*?</section>', orig_html, re.DOTALL)
if orig_slider:
    print("Found original slider")
else:
    print("Original slider not found")

# Extract original categories section
orig_cat = re.search(r'<section class="mockup-banners" id="kategorie-banners"[^>]*>.*?</section>', orig_html, re.DOTALL)
if orig_cat:
    print("Found original categories")
else:
    print("Original categories not found")

if orig_slider and orig_cat:
    with open('index.html', 'r', encoding='utf-8') as f:
        curr_html = f.read()
    
    # Let's replace the CURRENT slider and categories, which might have different class names
    curr_slider = re.search(r'<section class="hero-slider">.*?</section>', curr_html, re.DOTALL)
    if not curr_slider:
        curr_slider = re.search(r'<section class="mockup-hero-slider">.*?</section>', curr_html, re.DOTALL)
        
    curr_cat = re.search(r'<section class="categories-section"[^>]*>.*?</section>', curr_html, re.DOTALL)
    if not curr_cat:
        curr_cat = re.search(r'<section class="mockup-banners" id="kategorie-banners"[^>]*>.*?</section>', curr_html, re.DOTALL)

    if curr_slider:
        curr_html = curr_html.replace(curr_slider.group(0), orig_slider.group(0))
        print("Slider replaced in index.html")
    
    if curr_cat:
        curr_html = curr_html.replace(curr_cat.group(0), orig_cat.group(0))
        print("Categories replaced in index.html")
        
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(curr_html)
    print("index.html restored!")
