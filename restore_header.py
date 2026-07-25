import re

html_path = 'd:/MY-AI-AGENTS/sklepSC/ai-shopping.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the corrupted header-actions block
old_header_actions_regex = r'<div class="header-actions">.*?</div>\s*<nav class="mobile-menu"'

new_header_actions = '''<div class="header-actions">
        <form class="header-search" action="shop.html" role="search">
          <label class="sr-only" for="configSearch">Szukaj produktu</label>
          <input id="configSearch" name="q" type="search" placeholder="Czego szukasz?">
          <button type="submit" aria-label="Szukaj">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
          </button>
        </form>
        <a class="header-icon" href="cart.html" aria-label="Koszyk">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span class="cart-badge" id="cartBadge">0</span>
        </a>
        <button class="menu-button" id="menuButton" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="Otwórz menu"><span></span><span></span><span></span></button>
      </div>
      <nav class="mobile-menu"'''

html = re.sub(old_header_actions_regex, new_header_actions, html, flags=re.DOTALL)

# ALSO, the user said "bedac w pomocy AI wywal te ikone kolo kosyzka"
# But they also might want to remove the "Zakup AI" button from the main header nav if we are already on that page, or maybe they just meant the broken icon next to the cart (which was the menu button I accidentally broke).
# Looking at the screenshot, there is a "Zakup AI" white button in the center nav AND an orange AI icon next to the cart. 
# The orange AI icon next to the cart WAS the mobile menu button that I corrupted!
# By restoring the mobile menu button, that extra orange icon will be gone.

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Restored header buttons.")
