import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

new_dropdown_css = """
    /* New Apple-style Dropdown Menu */
    .has-mega-menu {
      position: relative;
    }
    .has-mega-menu > a {
      display: flex;
      align-items: center;
    }
    .apple-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%) translateY(10px) scale(0.98);
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(40px) saturate(180%);
      -webkit-backdrop-filter: blur(40px) saturate(180%);
      box-shadow: 0 20px 50px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.5) inset;
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      width: 260px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 1000;
      padding: 12px;
      overflow: hidden;
    }
    .has-mega-menu:hover .apple-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    .apple-dropdown-section {
      margin-bottom: 8px;
    }
    .apple-dropdown-section:last-child {
      margin-bottom: 0;
    }
    .apple-dropdown-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #888;
      font-weight: 600;
      padding: 8px 12px 4px;
    }
    .apple-dropdown ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .apple-dropdown ul li a {
      color: var(--primary-color) !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      text-decoration: none !important;
      text-transform: none !important;
      letter-spacing: 0 !important;
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      padding: 10px 12px !important;
      background: transparent !important;
      border-radius: 8px !important;
      border: none !important;
      box-shadow: none !important;
    }
    .apple-dropdown ul li a:hover {
      background: rgba(0, 0, 0, 0.05) !important;
      color: var(--accent-color) !important;
      transform: none !important;
    }
    /* Disable the concaved effect on this new dropdown */
    .apple-dropdown ul li a:active {
      transform: scale(0.98) !important;
      box-shadow: none !important;
      background: rgba(0, 0, 0, 0.08) !important;
    }
"""

new_dropdown_html = """
          <div class="apple-dropdown">
            <div class="apple-dropdown-section">
              <div class="apple-dropdown-title">Oświetlenie LED</div>
              <ul>
                <li><a href="/shop.html?cat=Tasma%20LED">Taśmy LED COB</a></li>
                <li><a href="/shop.html?cat=Tasma%20LED">Taśmy LED SMD</a></li>
                <li><a href="/shop.html?cat=Tasma%20LED">Taśmy Neony</a></li>
                <li><a href="/shop.html?cat=Tasma%20LED">Zestawy LED</a></li>
              </ul>
            </div>
            <div style="height: 1px; background: rgba(0,0,0,0.05); margin: 8px 0;"></div>
            <div class="apple-dropdown-section">
              <div class="apple-dropdown-title">Akcesoria i Zasilanie</div>
              <ul>
                <li><a href="/shop.html?cat=Sterowniki%20LED">Sterowniki LED</a></li>
                <li><a href="/shop.html?cat=Zasilacze">Zasilacze Hermetyczne</a></li>
                <li><a href="/shop.html?cat=Profile">Profile aluminiowe</a></li>
                <li><a href="/shop.html?cat=Akcesoria">Kable i złączki</a></li>
              </ul>
            </div>
          </div>
"""

# Pattern to find old mega menu HTML
mega_menu_html_pattern = re.compile(r'<div class="mega-menu">.*?</div>\s*</div>\s*</li>', re.DOTALL)

# Pattern to find old mega menu CSS
mega_menu_css_pattern = re.compile(r'/\* Mega Menu Styles \*/.*?\.mega-menu-banner\s*{[^}]+}', re.DOTALL)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace the mega menu HTML
    content = mega_menu_html_pattern.sub(new_dropdown_html + '        </li>', content)
    
    # 2. Replace the mega menu CSS
    content = mega_menu_css_pattern.sub(new_dropdown_css, content)
    
    # 3. Optimize index.html heavy SVG filters to fix performance issue
    if file == 'index.html':
        # Remove glow filters
        content = re.sub(r'<filter id="glowBlur".*?</filter>', '', content, flags=re.DOTALL)
        content = content.replace('filter: url(#glowBlur);', '')
        content = content.replace('filter: drop-shadow(0 0 1px #e0f0ff);', '')
        content = content.replace('filter: drop-shadow(0 0 8px #e0f0ff);', '')
        content = content.replace('filter: drop-shadow(0 0 8px #e0f0ff) !important;', '')
        content = content.replace('filter: drop-shadow(0 0 6px #ffaa00);', '')
        # Remove backdrop-filter blur 25px from slide-banner-box to save GPU
        content = content.replace('backdrop-filter: blur(25px);', 'backdrop-filter: blur(10px);')
        content = content.replace('-webkit-backdrop-filter: blur(25px);', '-webkit-backdrop-filter: blur(10px);')

    # 4. Fix checkout button animation in cart.html and everywhere
    # Also shared-popups.js for the cart drawer
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated dropdown menu to Apple style and optimized performance.")
