import os
import re

css_path = 'd:/MY-AI-AGENTS/sklepSC/css/configurator.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Make search bar larger
css = css.replace('width: clamp(170px, 19vw, 300px);', 'width: clamp(250px, 25vw, 400px);')
css = css.replace('.header-search { width: 170px; }', '.header-search { width: 250px; }')

# Add AI glowing link CSS (for all pages linking configurator.css)
ai_glow_css = """
/* Glow effect for menu link */
.desktop-nav a.ai-glow-link, .mobile-menu a.ai-glow-link {
  background: linear-gradient(90deg, #ff5a00, #ff9a64);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  position: relative;
}
.desktop-nav a.ai-glow-link::after, .mobile-menu a.ai-glow-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #ff5a00;
  box-shadow: 0 0 10px #ff5a00;
  opacity: 0;
  transition: opacity 0.3s;
}
.desktop-nav a.ai-glow-link:hover::after, .mobile-menu a.ai-glow-link:hover::after {
  opacity: 1;
}
"""
if 'ai-glow-link' not in css:
    css += ai_glow_css

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated CSS.")

html_files = [
    'about.html', 'admin.html', 'blog.html', 'cart.html', 'checkout.html',
    'configurator.html', 'contact.html', 'index.html', 'product.html', 'shop.html'
]

# The new order:
# Home, Sklep, Wiedza, O nas, Kontakt, Dobierz system, Zakup AI

for file in html_files:
    filepath = 'd:/MY-AI-AGENTS/sklepSC/' + file
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Determine which file is active
    active = file
    if file == 'index.html': active_name = 'Home'
    elif file == 'shop.html' or file == 'product.html': active_name = 'Sklep'
    elif file == 'blog.html': active_name = 'Wiedza'
    elif file == 'about.html': active_name = 'O nas'
    elif file == 'contact.html': active_name = 'Kontakt'
    elif file == 'configurator.html': active_name = 'Dobierz system'
    else: active_name = ''

    def build_nav(is_mobile=False):
        def cls(name, is_ai=False):
            classes = []
            if name == active_name: classes.append('active')
            if is_ai: classes.append('ai-glow-link')
            if not classes: return ''
            return ' class="' + ' '.join(classes) + '"'

        nav_links = f"""
      <a{cls('Home')} href="index.html">Home</a>
      <a{cls('Sklep')} href="shop.html">Sklep</a>
      <a{cls('Wiedza')} href="blog.html">Wiedza</a>
      <a{cls('O nas')} href="about.html">O nas</a>
      <a{cls('Kontakt')} href="contact.html">Kontakt</a>
      <a{cls('Dobierz system')} href="configurator.html">Dobierz system</a>
      <a{cls('Zakup AI', True)} href="ai-shopping.html">Zakup AI ✨</a>
"""
        return nav_links

    # Replace desktop nav
    html = re.sub(r'(<nav class="desktop-nav"[^>]*>).*?(</nav>)', r'\1' + build_nav(False) + r'    \2', html, flags=re.DOTALL)
    
    # Replace mobile nav
    html = re.sub(r'(<nav class="mobile-menu"[^>]*>).*?(</nav>)', r'\1' + build_nav(True) + r'    \2', html, flags=re.DOTALL)

    # Inject smart-search.js before </body> if not present
    if 'smart-search.js' not in html:
        html = html.replace('</body>', '  <script src="js/smart-search.js"></script>\n</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {file}")

