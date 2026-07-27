import glob
import re
import os

CSS_TO_INJECT = """
<style id="global-config-nav-css">
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
    is_start = 'class="active"' if f in ['index.html', 'original_index.html', 'old_index.html'] else ''
    is_sklep = 'class="active"' if f == 'shop.html' else ''
    is_config = 'class="active"' if 'configurator' in f else ''
    is_ai = 'class="active"' if f == 'ai-shopping.html' else ''
    
    return f'''<nav class="config-bottom-nav" aria-label="Skróty mobilne">
    <a href="index.html" {is_start}><i class="ph ph-house" aria-hidden="true"></i><span>Start</span></a>
    <a href="shop.html" {is_sklep}><i class="ph ph-storefront" aria-hidden="true"></i><span>Sklep</span></a>
    <a href="configurator.html" {is_config}><span class="bottom-main-icon"><i class="ph ph-lightbulb-filament" aria-hidden="true"></i></span><span>Konfig. LED</span></a>
    <a href="ai-shopping.html" {is_ai}><i class="ph ph-sparkle" aria-hidden="true"></i><span>Zakup AI</span></a>
    <button id="mobileCartButton" type="button" onclick="openCartDrawer && openCartDrawer()"><i class="ph ph-shopping-cart-simple" aria-hidden="true"></i><span>Koszyk</span></button>
  </nav>'''

def update_files():
    html_files = glob.glob('*.html')
    
    # We want to replace new-glass-nav or mobile-bottom-nav
    nav_pattern_new = re.compile(r'<nav class="new-glass-nav".*?</nav>', re.DOTALL)
    nav_pattern_old = re.compile(r'<nav class="mobile-bottom-nav".*?</nav>', re.DOTALL)
    nav_pattern_config = re.compile(r'<nav class="config-bottom-nav".*?</nav>', re.DOTALL)
    
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        new_nav = generate_config_nav(f)
        
        # Replace existing nav
        if nav_pattern_new.search(content):
            content = nav_pattern_new.sub(new_nav, content)
            modified = True
        elif nav_pattern_old.search(content):
            content = nav_pattern_old.sub(new_nav, content)
            modified = True
        elif nav_pattern_config.search(content):
            content = nav_pattern_config.sub(new_nav, content)
            modified = True
            
        # Inject CSS
        if 'id="global-config-nav-css"' in content:
            content = re.sub(r'<style id="global-config-nav-css">.*?</style>', CSS_TO_INJECT.strip(), content, flags=re.DOTALL)
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
