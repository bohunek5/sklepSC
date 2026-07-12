import re

with open('checkout.html', 'r', encoding='utf-8') as f:
    content = f.read()

card_svg = '<img src="https://static.payu.com/images/mobile/logos/pbl_c.png" alt="Karty" style="height: 24px; object-fit: contain;">'
paypal_svg = '<img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style="height: 24px; object-fit: contain;">'

content = content.replace('<span style="font-size: 20px;">💳</span>', card_svg)
content = content.replace('<span style="font-weight: 700; color: #003087; font-style: italic;">PayPal</span>', paypal_svg)

with open('checkout.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Icons replaced")
