import os
import re

files_to_fix = ['about.html', 'blog.html', 'contact.html', 'shop.html']

for filename in files_to_fix:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix body padding
    content = content.replace('padding-top: 80px;', 'padding-top: 0;')

    # 2. Fix header CSS to be transparent by default
    header_css_old = """    .mockup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 8%;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: var(--transition);
    }"""
    
    header_css_new = """    /* Common Header with Glassmorphism */
    .mockup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 8%;
      background: transparent;
      border-bottom: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: background 0.3s ease;
    }

    .mockup-header.scrolled {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      padding: 15px 8%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .mockup-header.scrolled .mockup-nav a {
      color: var(--primary-color);
    }

    .mockup-header.scrolled .mockup-action-icon {
      color: var(--primary-color);
    }"""
    
    if header_css_old in content:
        content = content.replace(header_css_old, header_css_new)
    else:
        # Shop.html might have different whitespace
        content = re.sub(r'\.mockup-header\s*\{[^}]+\}', header_css_new, content, count=1)

    # 3. Remove dark search bar colors for subpages
    content = re.sub(r'/\*\s*Search Bar Subpage Colors & Mobile Shape\s*\*/[\s\S]+?stroke: #ffffff !important;\s*/\* white icon inside the dark button \*/\s*\}\s*\}', '', content)
    # Re-insert just the mobile shape logic without the background/colors
    mobile_search_shape = """    @media (max-width: 1024px) {
      .mockup-search-container {
        height: 32px !important;
        border-radius: 16px !important;
        padding: 0 10px !important;
      }
      .mockup-search-container input {
        height: 100% !important;
        padding: 0 8px !important;
      }
      .mockup-search-container button {
        height: 26px !important;
        width: 26px !important;
        right: 5px !important;
      }
    }"""
    content = content.replace('/* --- END MOBILE UI FIXES --- */', '/* --- END MOBILE UI FIXES --- */\n' + mobile_search_shape)

    # 4. Inject Hero section right after <div class="mobile-menu" id="mobileMenu">...</div>
    titles = {
        'about.html': 'O NAS',
        'blog.html': 'NASZ BLOG',
        'contact.html': 'KONTAKT Z NAMI',
        'shop.html': 'SKLEP'
    }
    
    hero_html = f"""  <section class="mockup-hero-slider" style="height: 60vh; min-height: 400px; display: flex; align-items: center; justify-content: center; position: relative;">
    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: url('images/hero_cob.webp') center/cover no-repeat; z-index: 0;"></div>
    <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(11,26,48,0.7); z-index: 1;"></div>
    <div style="position: relative; z-index: 2; text-align: center;">
      <h1 style="color: #fff; font-size: 48px; letter-spacing: 2px; font-weight: 800;">{titles[filename]}</h1>
    </div>
    <a href="#page-content" style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 10; color: #fff;">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-bounce"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
    </a>
  </section>
  <div id="page-content" style="padding-top: 40px;">"""
    
    # Find mobile menu closing
    # We'll use regex to inject after the mobile menu
    match = re.search(r'<div class="mobile-menu" id="mobileMenu">[\s\S]+?</div>', content)
    if match:
        end_pos = match.end()
        # Ensure we don't inject multiple times
        if '<section class="mockup-hero-slider"' not in content:
            content = content[:end_pos] + '\n' + hero_html + content[end_pos:]
            
            # Close the div before footer or mobile-bottom-nav
            if '<footer class="mockup-footer">' in content:
                content = content.replace('<footer class="mockup-footer">', '</div>\n<footer class="mockup-footer">')
            elif '<!-- Mobile Bottom Navigation -->' in content:
                content = content.replace('<!-- Mobile Bottom Navigation -->', '</div>\n<!-- Mobile Bottom Navigation -->')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Subpages updated with transparent header, hero sections, and white search icons.")
