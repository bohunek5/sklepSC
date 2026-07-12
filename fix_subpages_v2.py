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

    # 4. Modify existing page-hero to be 100vh
    content = re.sub(r'<section class="page-hero" style="[^"]*padding: 120px 20px; text-align: center; position: relative;">', 
           lambda m: m.group(0).replace('padding: 120px 20px;', 'height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;'), content)

    # Ensure scroll down arrow pushes to bottom
    content = content.replace('margin-top: 30px;', 'margin-top: auto; margin-bottom: 40px;')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Subpages updated with transparent header, full-screen hero sections, and white search icons.")
