import glob
import re

# 1. Fix quantity in cart.html
with open('cart.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('width: 35px;', 'width: 50px; min-width: 50px;')
# Also ensure the input doesn't have internal padding that cuts text
content = content.replace('font-size: 14px;\n      font-weight: 600;\n      background: transparent;\n      outline: none;', 'font-size: 16px;\n      font-weight: 600;\n      background: transparent;\n      outline: none;\n      padding: 0;')

with open('cart.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Fix checkout icons in checkout.html
with open('checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Wikimedia InPost with reliable base64 or inline SVG (using a placeholder styling for now if base64 is too long, actually I can just use a widely available logo CDN or unpkg for logos)
# e.g., https://raw.githubusercontent.com/FreekVR/payment-logos/master/svg/blik.svg
# But wait, there is no inpost in payment-logos.
inpost_svg = '<img src="https://inpost.pl/sites/default/files/logo-inpost.svg" alt="InPost" style="height: 24px; object-fit: contain;">'
blik_svg = '<img src="https://static.payu.com/images/mobile/logos/pbl_blik.png" alt="BLIK" style="height: 24px; object-fit: contain;">'
payu_svg = '<img src="https://static.payu.com/images/mobile/logos/payu_color.svg" alt="PayU" style="height: 24px; object-fit: contain;">'
card_svg = '<img src="https://static.payu.com/images/mobile/logos/pbl_c.png" alt="Karty" style="height: 24px; object-fit: contain;">'

content = re.sub(r'<img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/InPost_logo.svg"[^>]*>', inpost_svg, content)
content = re.sub(r'<span style="font-weight: 800; color: #e11c74; font-size: 13px;">blik</span>', blik_svg, content)
content = re.sub(r'<strong style="color: #000; font-size: 18px; letter-spacing: -1px; margin-right: 2px;">Pay</strong><strong style="color: #0099cc; font-size: 18px; letter-spacing: -1px;">U</strong>', payu_svg, content)
content = re.sub(r'<span style="font-size: 12px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.5px;">VISA / MC</span>', card_svg, content)

with open('checkout.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Fix quantity in shared-popups.js
with open('js/shared-popups.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Make the quantity span wider
js_content = js_content.replace('padding: 0 8px; font-size: 12px; font-weight: 700; color: #333;', 'padding: 0 12px; font-size: 14px; font-weight: 700; color: #333; min-width: 30px; text-align: center;')
# Make qvQtyInput wider
js_content = js_content.replace('width: 40px; text-align: center; border: none; font-size: 14px; font-weight: 600; background: transparent; outline: none;', 'width: 50px; text-align: center; border: none; font-size: 16px; font-weight: 600; background: transparent; outline: none; padding: 0;')

with open('js/shared-popups.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Checkout icons and quantity input fixed")
