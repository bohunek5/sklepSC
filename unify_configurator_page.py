import re

def unify():
    with open('d:/MY-AI-AGENTS/sklepSC/contact.html', 'r', encoding='utf-8') as f:
        contact_html = f.read()
    
    with open('d:/MY-AI-AGENTS/sklepSC/configurator.html', 'r', encoding='utf-8') as f:
        conf_html = f.read()

    # Extract header + mobile menu from contact
    header_match = re.search(r'(<header class="mockup-header".*?</header>\s*<!-- Mobile Menu -->\s*<div class="mobile-menu" id="mobileMenu">.*?</div>)', contact_html, re.DOTALL)
    
    # Extract page-hero from contact
    hero_match = re.search(r'(<section class="page-hero".*?</section>)', contact_html, re.DOTALL)
    
    # Extract header CSS from contact
    css_match = re.search(r'(/\* Common Header \*/.*?\/\* Magic Dropdown Universal Fix \*/)', contact_html, re.DOTALL)

    if not header_match or not hero_match:
        print("Could not find header or hero in contact.html")
        return

    new_header = header_match.group(1)
    new_hero = hero_match.group(1)
    
    # Modify the active state in header
    new_header = new_header.replace('class="active" href="contact.html"', 'href="contact.html"')
    new_header = new_header.replace('href="configurator.html"', 'href="configurator.html" class="active"')
    
    # Modify hero content for configurator
    new_hero = new_hero.replace('Kontakt', 'Konfigurator')
    new_hero = new_hero.replace('Jesteśmy do Twojej dyspozycji', 'Dobierz system LED w 6 prostych krokach')
    new_hero = new_hero.replace("images/stairs.jpg", "images/kitchen.jpg") # Change background image for configurator if we want, or keep stairs

    # Find the header to replace in configurator
    conf_html = re.sub(r'<header class="site-header" id="siteHeader">.*?</header>', new_header, conf_html, flags=re.DOTALL)
    
    # Find the hero to replace in configurator
    conf_html = re.sub(r'<section class="hero" aria-labelledby="heroTitle">.*?</section>', new_hero, conf_html, flags=re.DOTALL)
    
    # Make sure we add the script for scrolling if it doesn't exist
    if 'standard-header-scroll-script' not in conf_html:
        script = """
  <script id="standard-header-scroll-script">
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
</body>"""
        conf_html = conf_html.replace('</body>', script)

    # We also need to bring over the CSS for mockup-header if it doesn't exist
    # Let's just put it in a style tag in head
    if css_match and 'mockup-header' not in conf_html.split('</head>')[0]:
        style_block = "\n<style>\n" + css_match.group(1) + "\n</style>\n</head>"
        conf_html = conf_html.replace('</head>', style_block)
        
    with open('d:/MY-AI-AGENTS/sklepSC/configurator.html', 'w', encoding='utf-8') as f:
        f.write(conf_html)
        
    print("Updated configurator.html")

unify()
