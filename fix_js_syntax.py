import os
import re

def fix_config_js():
    filepath = r"d:\MY-AI-AGENTS\sklepSC\js\configurator.js"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The buggy string had onmouseover='this.style.background=\'#08192f\'' inside single quotes.
    # We will replace all inline styles and JS with a cleaner class.
    
    # 1. Wróć do konfiguracji
    # The syntax error was on line 242.
    content = re.sub(
        r'<button class="mockup-btn"[^>]*id="returnToConfiguration">Wróć do konfiguracji</button>',
        r'<button class="mockup-btn mockup-btn-outline" type="button" id="returnToConfiguration" style="margin-top: 15px;">Wróć do konfiguracji</button>',
        content
    )
    
    # 2. Wybierz ten wariant
    content = re.sub(
        r'<button class="mockup-btn select-product-button"[^>]*data-select-tape="([^"]+)">Wybierz ten wariant</button>',
        r'<button class="mockup-btn mockup-btn-outline select-product-button" type="button" data-select-tape="\1" style="height: 36px; padding: 0 15px;">Wybierz ten wariant</button>',
        content
    )
    
    # 3. Sprawdź produkt
    content = re.sub(
        r'<a class="mockup-btn"[^>]*href="([^"]+)"[^>]*>Sprawdź produkt</a>',
        r'<a class="mockup-btn mockup-btn-outline" href="\1" target="_blank">Sprawdź produkt</a>',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed configurator.js")

if __name__ == '__main__':
    fix_config_js()
