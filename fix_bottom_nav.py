import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll replace the entire <nav class="mobile-bottom-nav"> block in every file
nav_regex = re.compile(r'<nav class="mobile-bottom-nav">.*?</nav>', re.DOTALL)

def get_nav_html(active_page):
    # Mapping active page to its class
    # active_page can be 'index', 'shop', 'blog', 'about', 'contact'
    
    def is_active(page):
        return 'active' if active_page == page else ''

    return f"""<nav class="mobile-bottom-nav">
    <div class="mobile-nav-items">
      <a href="index.html" class="mobile-nav-item {is_active('index')}">
        <i class="ph ph-house"></i>
        <span>Home</span>
      </a>
      <a href="javascript:void(0);" onclick="openMobileCategories();" class="mobile-nav-item {is_active('shop')}">
        <i class="ph ph-squares-four"></i>
        <span>Kategorie</span>
      </a>
      <a href="blog.html" class="mobile-nav-item {is_active('blog')}">
        <i class="ph ph-article"></i>
        <span>Blog</span>
      </a>
      <a href="about.html" class="mobile-nav-item {is_active('about')}">
        <i class="ph ph-info"></i>
        <span>O nas</span>
      </a>
      <a href="contact.html" class="mobile-nav-item {is_active('contact')}">
        <i class="ph ph-envelope-simple"></i>
        <span>Kontakt</span>
      </a>
    </div>
  </nav>"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Determine which page is active
    active_page = 'index'
    if 'shop' in file: active_page = 'shop'
    elif 'blog' in file: active_page = 'blog'
    elif 'about' in file: active_page = 'about'
    elif 'contact' in file: active_page = 'contact'
    
    # Replace nav block
    if '<nav class="mobile-bottom-nav">' in content:
        content = nav_regex.sub(get_nav_html(active_page), content)

    # Adjust search height to 32px (was 36px)
    content = content.replace('height: 36px !important;', 'height: 32px !important;')
    content = content.replace('border-radius: 18px !important;', 'border-radius: 16px !important;')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Bottom nav fixed across all files. Active states corrected. Search bar height reduced to 32px.")
