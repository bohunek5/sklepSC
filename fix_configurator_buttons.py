import re

def fix_buttons():
    with open('js/configurator.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # The HTML block to replace
    old_buttons = """<button class="add-to-cart-btn tape-cart-button" type="button" data-action="add-tape" aria-label="Dodaj do koszyka" style="width: 100%; border: none; padding: 0;" onclick="event.stopPropagation();"><span class="btn-slide-wrap"><span class="btn-txt-default">Dodaj do koszyka</span><span class="btn-txt-hover"><i class="ph ph-shopping-cart-simple" style="margin-right: 6px;"></i> Dodaj teraz!</span></span></button><button class="mockup-btn mockup-btn-outline" type="button" style="width: 100%; height: 42px;" onclick="event.stopPropagation(); if(window.openQuickView) window.openQuickView('${tapeProduct.id}')">Sprawdź produkt</button>"""
    
    new_buttons = """<button class="add-to-cart-btn tape-cart-button" type="button" data-action="add-tape" aria-label="Dodaj do koszyka" style="width: 100%; border: none; padding: 0;" onclick="event.stopPropagation();"><span class="btn-slide-wrap"><span class="btn-txt-default">Dodaj do koszyka</span><span class="btn-txt-hover"><i class="ph ph-shopping-cart-simple" style="margin-right: 6px;"></i> Dodaj teraz!</span></span></button><button class="buy-it-now-btn" type="button" style="width: 100%; border: none; padding: 0;" onclick="event.stopPropagation(); window.location.href='checkout.html'"><span class="btn-slide-wrap"><span class="btn-txt-default">Szybki zakup</span><span class="btn-txt-hover"><i class="ph ph-shopping-cart-simple" style="margin-right: 6px;"></i> Przejdź do kasy</span></span></button>"""

    if old_buttons in content:
        content = content.replace(old_buttons, new_buttons)
        with open('js/configurator.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated js/configurator.js buttons")
    else:
        print("Could not find the buttons in js/configurator.js")

if __name__ == "__main__":
    fix_buttons()
