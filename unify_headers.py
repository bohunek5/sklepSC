import re

def unify_file(filepath):
    with open('index.html', 'r', encoding='utf-8') as f:
        index_content = f.read()

    # Extract CSS for header/nav/mobile menu (approximately lines 1060 to 2680 in index.html)
    # Wait, it's safer to just extract specific blocks if we know them.
    # Actually, he said "belka na podstronach wszystkich innych zachowuje sie ja kna glownej kurwa napisz to w koncu a nie wymyslaksz"
    # This just means the header HTML, JS, and CSS should be identical.
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the <header> tag block
    header_match = re.search(r'<header class="mockup-header"[^>]*>.*?</header>', index_content, re.DOTALL)
    if header_match:
        content = re.sub(r'<header class="mockup-header"[^>]*>.*?</header>', header_match.group(0), content, flags=re.DOTALL)
        
    # Replace the mobile menu block
    mobile_menu_match = re.search(r'<!-- Mobile Menu -->\s*<div class="mobile-menu" id="mobileMenu">.*?</div>\s*<!--', index_content, re.DOTALL)
    if mobile_menu_match:
        content = re.sub(r'<!-- Mobile Menu -->\s*<div class="mobile-menu"[^>]*>.*?</div>\s*<!--', mobile_menu_match.group(0), content, flags=re.DOTALL)
        
    # Replace JS script for header scroll
    js_match = re.search(r'const header = document\.getElementById\(\'mainHeader\'\);.*?if \(headerLogo\)', index_content, re.DOTALL)
    # Wait, the script logic is better replaced manually.

    # Fix CSS for the search button stroke on scrolled
    content = content.replace('.mockup-header.scrolled .mockup-search-container button svg {\n      stroke: #ffffff;\n    }', '.mockup-header.scrolled .mockup-search-container button svg {\n      stroke: #0b1a30 !important;\n    }')
    content = content.replace('.mockup-header.scrolled .mockup-search-container button svg {\n      stroke: #000000;\n    }', '.mockup-header.scrolled .mockup-search-container button svg {\n      stroke: #0b1a30 !important;\n    }')
    
    # Replace the search container SVG entirely
    svg_search_white = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    content = re.sub(r'<button id="headerSearchBtn"[^>]*>\s*<svg[^>]*>.*?</svg>\s*</button>', f'<button id="headerSearchBtn" aria-label="Szukaj">\n          {svg_search_white}\n        </button>', content, flags=re.DOTALL)

    # Ensure logo has id="headerLogo" and points to logo-white.png initially
    content = re.sub(r'<div class="mockup-header-logo">\s*<a href="index\.html"><img src="[^"]*" alt="[^"]*"></a>', r'<div class="mockup-header-logo">\n      <a href="index.html"><img src="images/logo-white.png" alt="Prescot Logo" id="headerLogo"></a>', content)
    
    # Add the scroll JS logic if it's missing
    scroll_js = """
    const header = document.getElementById('mainHeader');
    const headerLogo = document.getElementById('headerLogo');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        if (header) header.classList.add('scrolled');
        if (headerLogo) headerLogo.src = 'images/logo-dark.png';
      } else {
        if (header) header.classList.remove('scrolled');
        if (headerLogo) headerLogo.src = 'images/logo-white.png';
      }
    });
"""
    if 'headerLogo.src' not in content:
        content = content.replace('const headerSearchInput', scroll_js + '\n    const headerSearchInput')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for file in ['about.html', 'blog.html', 'contact.html', 'shop.html']:
    unify_file(file)

print("Done")
