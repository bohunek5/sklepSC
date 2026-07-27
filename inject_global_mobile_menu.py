import glob
import re
import os

CSS_TO_INJECT = """
<style id="global-config-nav-css">
.config-bottom-nav { display: none; }
/* Exact bottom nav styles from led-configurator.css */
@media (max-width: 768px) {
  .config-bottom-nav { position: fixed; inset: auto 0 0; z-index: 950; height: 76px; display: grid; grid-template-columns: repeat(5,1fr); padding: 7px 8px calc(6px + env(safe-area-inset-bottom)); border-top: 1px solid rgba(255,255,255,0.1); background: rgba(6,16,28,.98); backdrop-filter: blur(20px); }
  .config-bottom-nav a, .config-bottom-nav button { min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 0; border: 0; color: rgba(255,255,255,.5); background: transparent; text-decoration: none; font-size: 8px; font-weight: 600; cursor: pointer; }
  .config-bottom-nav i { font-size: 20px; }
  .config-bottom-nav .active { color: #fff; }
  .bottom-main-icon { width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; margin-top: -20px; border: 2px solid #00e5ff; border-radius: 50%; color: #00e5ff; background: #10233a; box-shadow: 0 0 22px rgba(40,215,255,.2); }
  .bottom-main-icon i { font-size: 21px; }
  
  /* Fix cart button in top header to render like the old one */
  .site-header .header-icon, .mockup-header .header-icon {
    display: inline-flex !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  .site-header .header-icon svg, .mockup-header .header-icon svg {
    stroke: #0b1a30 !important;
    fill: none !important;
  }
  .index-page .site-header:not(.scrolled) .header-icon svg {
    stroke: #ffffff !important;
  }
  .menu-toggle, .menu-button {
    display: block !important;
  }
}
</style>
"""

def generate_config_nav(f):
    # Determine which tab is active
    active_tab = 'start'
    if f == 'shop.html':
        active_tab = 'sklep'
    elif 'configurator' in f or 'konfigurator' in f:
        active_tab = 'config'
    elif f == 'ai-shopping.html':
        active_tab = 'ai'
    elif f == 'cart.html':
        active_tab = 'cart'
        
    def render_icon(tab_id, icon_html):
        if active_tab == tab_id:
            return '<span class="bottom-main-icon">' + icon_html + '</span>'
        return icon_html

    html = '<nav class="config-bottom-nav" aria-label="Skróty mobilne">\n'
    
    # 1. Start
    cls = 'class="active"' if active_tab == 'start' else ''
    icon = render_icon("start", '<i class="ph ph-house" aria-hidden="true"></i>')
    html += f'    <a href="index.html" {cls}>{icon}<span>Start</span></a>\n'
    
    # 2. Sklep
    cls = 'class="active"' if active_tab == 'sklep' else ''
    icon = render_icon("sklep", '<i class="ph ph-storefront" aria-hidden="true"></i>')
    html += f'    <a href="shop.html" {cls}>{icon}<span>Sklep</span></a>\n'
    
    # 3. Konfigurator
    cls = 'class="active"' if active_tab == 'config' else ''
    icon = render_icon("config", '<i class="ph ph-lightbulb-filament" aria-hidden="true"></i>')
    html += f'    <a href="configurator.html" {cls}>{icon}<span>Konfig. LED</span></a>\n'
    
    # 4. Zakup AI
    cls = 'class="active"' if active_tab == 'ai' else ''
    icon = render_icon("ai", '<i class="ph ph-sparkle" aria-hidden="true"></i>')
    html += f'    <a href="ai-shopping.html" {cls}>{icon}<span>Zakup AI</span></a>\n'
    
    # 5. Koszyk
    cls = 'class="active"' if active_tab == 'cart' else ''
    icon = render_icon("cart", '<i class="ph ph-shopping-cart-simple" aria-hidden="true"></i>')
    html += f'    <button id="mobileCartButton" type="button" {cls} onclick="openCartDrawer && openCartDrawer()">{icon}<span>Koszyk</span></button>\n'
    
    html += '  </nav>'
    return html

def update_files():
    html_files = glob.glob('*.html')
    nav_pattern_config = re.compile(r'<nav class="config-bottom-nav".*?</nav>', re.DOTALL)
    
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        new_nav = generate_config_nav(f)
        
        if nav_pattern_config.search(content):
            content = nav_pattern_config.sub(new_nav, content)
            modified = True
            
        if 'id="global-config-nav-css"' in content:
            content = re.sub(r'<style id="global-config-nav-css">
.config-bottom-nav { display: none; }.*?</style>', CSS_TO_INJECT.strip(), content, flags=re.DOTALL)
            modified = True
        else:
            content = content.replace('</body>', f'{CSS_TO_INJECT}\n</body>')
            modified = True
            
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated {f}")

if __name__ == '__main__':
    update_files()

