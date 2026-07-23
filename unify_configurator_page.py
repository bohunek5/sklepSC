import re

print("Unifying header, scripts, and catalog loading in configurator.html to match index.html & shop.html...")

# Read index.html to extract the exact header & mobile menu HTML
with open("index.html", "r", encoding="utf-8") as f:
    index_html = f.read()

# Extract header HTML from index.html
header_match = re.search(r'(<header class="mockup-header"[^>]*>.*?</header>)', index_html, re.DOTALL)
header_html = header_match.group(1) if header_match else ""

# Extract mobile menu HTML from index.html
mobile_menu_match = re.search(r'(<!-- Mobile Menu -->\s*<div class="mobile-menu" id="mobileMenu">.*?</div>\s*<!-- Mobile Menu -->)', index_html, re.DOTALL)
if not mobile_menu_match:
    mobile_menu_match = re.search(r'(<div class="mobile-menu" id="mobileMenu">.*?</div>)', index_html, re.DOTALL)
mobile_menu_html = mobile_menu_match.group(1) if mobile_menu_match else ""

# Adjust active class in nav for configurator.html
nav_items_html = """<ul>
  <li><a href="index.html">Home</a></li>
  <li><a href="shop.html">Sklep</a></li>
  <li><a href="configurator.html" class="active">Dobierz Sam</a></li>
  <li><a href="blog.html">Blog</a></li>
  <li><a href="about.html">O nas</a></li>
  <li><a href="contact.html">Kontakt</a></li>
</ul>"""

header_html = re.sub(r'<nav class="mockup-nav">\s*<ul>.*?</ul>\s*</nav>', f'<nav class="mockup-nav">\n{nav_items_html}\n</nav>', header_html, flags=re.DOTALL)

# Read configurator.html
with open("configurator.html", "r", encoding="utf-8") as f:
    config_html = f.read()

# 1. Replace <header class="site-header" id="siteHeader">...</header> with unified header_html
config_html = re.sub(r'<header class="site-header"[^>]*>.*?</header>', header_html, config_html, flags=re.DOTALL)
config_html = re.sub(r'<header class="mockup-header"[^>]*>.*?</header>', header_html, config_html, flags=re.DOTALL)

# 2. Add products-data.js and shared-popups.js script tags before configurator.js
script_block = """  <script src="js/products-data.js"></script>
  <script src="js/shared-popups.js"></script>
  <script type="module" src="js/configurator.js"></script>"""

config_html = re.sub(r'\s*<script type="module" src="js/configurator\.js"></script>', f'\n{script_block}', config_html)

# 3. Add scroll listener for headerLogo and mainHeader inside configurator.html if missing
scroll_script = """
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const header = document.getElementById('mainHeader');
      const headerLogo = document.getElementById('headerLogo');
      function handleScroll() {
        if (window.scrollY > 40) {
          if (header) header.classList.add('scrolled');
          if (headerLogo) headerLogo.src = 'images/logo-dark.png';
        } else {
          if (header) header.classList.remove('scrolled');
          if (headerLogo) headerLogo.src = 'images/logo-white.png';
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    });
  </script>
"""

if "images/logo-dark.png" not in config_html or "handleScroll" not in config_html:
    config_html = config_html.replace("</body>", f"{scroll_script}\n</body>")

with open("configurator.html", "w", encoding="utf-8") as f:
    f.write(config_html)

print("configurator.html header and scripts successfully unified.")
