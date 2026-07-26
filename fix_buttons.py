import os
import re

def fix_buttons():
    cfg_js_path = r"d:\MY-AI-AGENTS\sklepSC\js\configurator.js"
    with open(cfg_js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Wybierz ten wariant
    content = content.replace(
        '<button class="button-secondary select-product-button"',
        '<button class="mockup-btn select-product-button" style="background: transparent; color: #08192f; border: 1px solid #08192f; height: 36px;" onmouseover="this.style.background=\'#08192f\'; this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\'; this.style.color=\'#08192f\'"'
    )
    
    # 2. Sprawdź produkt
    content = content.replace(
        '<a class="product-link-button"',
        '<a class="mockup-btn" style="background: transparent; color: #08192f; border: 1px solid #08192f;" onmouseover="this.style.background=\'#08192f\'; this.style.color=\'#fff\'" onmouseout="this.style.background=\'transparent\'; this.style.color=\'#08192f\'"'
    )
    
    # 3. Dodaj taśmę
    content = content.replace(
        '<button class="button-primary tape-cart-button"',
        '<button class="mockup-btn tape-cart-button"'
    )
    
    # 4. Dodaj dostępny zestaw
    content = content.replace(
        '<button class="button-primary bundle-button"',
        '<button class="mockup-btn bundle-button" style="width: 100%;"'
    )
    
    with open(cfg_js_path, 'w', encoding='utf-8') as f:
        f.write(content)
        print("Fixed buttons in configurator.js")

if __name__ == '__main__':
    fix_buttons()
