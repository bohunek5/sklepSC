import re

# 1. Update shared-popups.js
file_path = 'js/shared-popups.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

drawer_style_and_btn = """        <style>
          .cart-checkout-btn {
            width: 100%; padding: 16px; background: #1a1a1a; color: #fff; border: none; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; cursor: pointer; border-radius: 4px; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .cart-checkout-btn:hover {
            background: #ffaa00;
            color: #000;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(255, 170, 0, 0.3);
          }
          .cart-checkout-btn:active {
            transform: scale(0.98);
            box-shadow: none;
          }
        </style>
        <button id="cartDrawerCheckout" class="cart-checkout-btn">Przejdź do kasy</button>"""

content = re.sub(
    r'<button id="cartDrawerCheckout" style="[^"]+">Przejdź do kasy</button>',
    drawer_style_and_btn,
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update cart.html
cart_file = 'cart.html'
with open(cart_file, 'r', encoding='utf-8') as f:
    cart_content = f.read()

old_css = """    .checkout-btn {
      width: 100%;
      padding: 16px;
      background: var(--primary-color);
      color: var(--white);
      border: none;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: var(--transition);
      margin-top: 20px;
    }

    .checkout-btn:hover {
      background: var(--accent-color);
      color: #000;
    }"""

new_css = """    .checkout-btn {
      width: 100%;
      padding: 16px;
      background: var(--primary-color);
      color: var(--white);
      border: none;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      margin-top: 20px;
    }

    .checkout-btn:hover {
      background: var(--accent-color);
      color: #000;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(255, 170, 0, 0.3);
    }
    
    .checkout-btn:active {
      transform: scale(0.98) !important;
      box-shadow: none !important;
    }"""

cart_content = cart_content.replace(old_css, new_css)

with open(cart_file, 'w', encoding='utf-8') as f:
    f.write(cart_content)

print("Updated checkout button animations.")
