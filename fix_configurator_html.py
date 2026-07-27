import re
import os

def fix_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        index_html = f.read()
    
    with open('configurator.html', 'r', encoding='utf-8') as f:
        conf_html = f.read()

    # Extract header from index.html
    header_match = re.search(r'(<header class="site-header" id="siteHeader">.*?</header>)', index_html, re.DOTALL)
    if not header_match:
        print("Header not found in index.html")
        return
    index_header = header_match.group(1)

    # Modify header for configurator (make Konfigurator LED active, and remove Home active)
    index_header = index_header.replace('<a class="active" href="index.html">Home</a>', '<a href="index.html">Home</a>')
    index_header = index_header.replace('<a href="configurator.html">Konfigurator LED</a>', '<a class="active" href="configurator.html">Konfigurator LED</a>')
    index_header = index_header.replace('<a href="konfigurator-led.html">Konfigurator LED</a>', '<a class="active" href="configurator.html">Konfigurator LED</a>')
    
    index_header = index_header.replace('<li><a class="active" href="index.html">Home</a></li>', '<li><a href="index.html">Home</a></li>')
    index_header = index_header.replace('<li><a href="configurator.html">Konfigurator LED</a></li>', '<li><a class="active" href="configurator.html">Konfigurator LED</a></li>')
    index_header = index_header.replace('<li><a href="konfigurator-led.html">Konfigurator LED</a></li>', '<li><a class="active" href="configurator.html">Konfigurator LED</a></li>')

    # Replace header in configurator.html
    conf_header_match = re.search(r'(<header class="site-header" id="siteHeader">.*?</header>)', conf_html, re.DOTALL)
    if conf_header_match:
        conf_html = conf_html.replace(conf_header_match.group(1), index_header)
    else:
        print("Header not found in configurator.html")

    # Extract bottom nav from index.html
    bottom_nav_match = re.search(r'(<!-- Mobile Bottom Navigation -->.*?</nav>)', index_html, re.DOTALL)
    if bottom_nav_match:
        index_bottom_nav = bottom_nav_match.group(1)
        # Modify active states
        index_bottom_nav = index_bottom_nav.replace('<a href="index.html" class="active">', '<a href="index.html">')
        index_bottom_nav = index_bottom_nav.replace('<a href="configurator.html" >', '<a href="configurator.html" class="active">')
        index_bottom_nav = index_bottom_nav.replace('<a href="konfigurator-led.html" >', '<a href="configurator.html" class="active">')
        
        # Add to configurator.html if not present
        if '<!-- Mobile Bottom Navigation -->' in conf_html:
            old_nav = re.search(r'(<!-- Mobile Bottom Navigation -->.*?</nav>)', conf_html, re.DOTALL).group(1)
            conf_html = conf_html.replace(old_nav, index_bottom_nav)
        else:
            # Append before closing body tag or scripts
            conf_html = conf_html.replace('</body>', f'{index_bottom_nav}\n</body>')
    else:
        print("Bottom nav not found in index.html")

    # Add missing CSS for mobile-menu from index.html
    css_match = re.search(r'(/\* Premium Mobile Menu - Glassmorphism \*/.*?\n\s*\})', index_html, re.DOTALL)
    # The regex might not capture all because of other stuff. Let's extract the mobile menu CSS accurately
    css_match = re.search(r'(\.mobile-menu \{.*?\})', index_html, re.DOTALL)
    if css_match:
        # Instead of parsing everything, let's just dump the index.html <style> that covers .mobile-menu
        mobile_menu_css = """
    /* Premium Mobile Menu - Glassmorphism */
    .mobile-menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      z-index: 998;
      padding: 120px 8% 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mobile-menu.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    .mobile-menu ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 30px;
      padding: 0;
      margin: 0;
      text-align: center;
      width: 100%;
    }
    .mobile-menu a {
      text-decoration: none;
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      display: inline-block;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mobile-menu.active a {
      transform: translateY(0);
      opacity: 1;
    }
    .mobile-menu.active li:nth-child(1) a { transition-delay: 0.1s; }
    .mobile-menu.active li:nth-child(2) a { transition-delay: 0.15s; }
    .mobile-menu.active li:nth-child(3) a { transition-delay: 0.2s; }
    .mobile-menu.active li:nth-child(4) a { transition-delay: 0.25s; }
    .mobile-menu.active li:nth-child(5) a { transition-delay: 0.3s; }
    .mobile-menu.active li:nth-child(6) a { transition-delay: 0.35s; }
    .mobile-menu.active li:nth-child(7) a { transition-delay: 0.4s; }
    .mobile-menu a:active {
      transform: scale(0.95);
      color: rgba(255,255,255,0.7);
    }
    /* MOBILE BOTTOM NAV CSS */
    .config-bottom-nav { position: fixed; inset: auto 0 0; z-index: 950; height: 76px; display: grid; grid-template-columns: repeat(5,1fr); padding: 7px 8px calc(6px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(255,255,255,0.1); background: rgba(6,16,28,.98); backdrop-filter: blur(20px); }
    .config-bottom-nav a, .config-bottom-nav button { min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 0; border: 0; color: rgba(255,255,255,.5); background: transparent; text-decoration: none; font-size: 8px; font-weight: 600; cursor: pointer; }
    .config-bottom-nav i { font-size: 20px; }
    .config-bottom-nav .active { color: #fff; }
    @media (min-width: 769px) { .config-bottom-nav { display: none; } }
"""
        
        # Insert this CSS into configurator.html right before </head>
        if '/* Premium Mobile Menu - Glassmorphism */' not in conf_html:
            conf_html = conf_html.replace('</head>', f'<style>{mobile_menu_css}</style>\n</head>')

    with open('configurator.html', 'w', encoding='utf-8') as f:
        f.write(conf_html)
    print("Updated configurator.html header and bottom nav")

if __name__ == "__main__":
    fix_html()
