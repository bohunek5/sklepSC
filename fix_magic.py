import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# 1. NEW MAGIC DROPDOWN CSS
magic_css = """
    /* MAGIC DROPDOWN - DESKTOP */
    .has-mega-menu {
      position: relative;
    }
    .has-mega-menu > a {
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
    }
    .has-mega-menu:hover > a {
      color: var(--accent-color);
      text-shadow: 0 0 10px rgba(255, 170, 0, 0.4);
    }
    
    .magic-dropdown {
      position: absolute;
      top: calc(100% + 20px);
      left: 50%;
      transform: translateX(-50%) perspective(1000px) rotateX(-15deg) scale(0.9);
      background: rgba(11, 26, 48, 0.85); /* Dark blue glass */
      backdrop-filter: blur(30px) saturate(200%);
      -webkit-backdrop-filter: blur(30px) saturate(200%);
      box-shadow: 0 30px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 20px rgba(255, 170, 0, 0.15);
      border-radius: 20px;
      width: 600px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 1000;
      padding: 25px;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      pointer-events: none;
    }
    
    /* Magical animated glowing border inside */
    .magic-dropdown::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 100%;
      background: radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 0%), rgba(255, 170, 0, 0.15), transparent 40%);
      z-index: -1;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .has-mega-menu:hover .magic-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) perspective(1000px) rotateX(0deg) scale(1);
      pointer-events: auto;
    }
    .has-mega-menu:hover .magic-dropdown::before {
      opacity: 1;
    }

    .magic-dropdown-section {
      position: relative;
    }
    .magic-dropdown-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: rgba(255,255,255,0.4);
      font-weight: 700;
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transform: translateY(10px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
    }
    .has-mega-menu:hover .magic-dropdown-title {
      transform: translateY(0);
      opacity: 1;
    }

    .magic-dropdown ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .magic-dropdown ul li {
      transform: translateY(15px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    /* Staggered animation */
    .has-mega-menu:hover .magic-dropdown ul li:nth-child(1) { transition-delay: 0.15s; transform: translateY(0); opacity: 1; }
    .has-mega-menu:hover .magic-dropdown ul li:nth-child(2) { transition-delay: 0.2s; transform: translateY(0); opacity: 1; }
    .has-mega-menu:hover .magic-dropdown ul li:nth-child(3) { transition-delay: 0.25s; transform: translateY(0); opacity: 1; }
    .has-mega-menu:hover .magic-dropdown ul li:nth-child(4) { transition-delay: 0.3s; transform: translateY(0); opacity: 1; }

    .magic-dropdown ul li a {
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      text-decoration: none !important;
      transition: all 0.3s ease !important;
      display: flex !important;
      align-items: center !important;
      padding: 12px 15px !important;
      background: transparent !important;
      border-radius: 12px !important;
      position: relative;
      overflow: hidden;
      z-index: 1;
    }
    
    .magic-dropdown ul li a i {
      margin-right: 12px;
      font-size: 18px;
      color: var(--accent-color);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .magic-dropdown ul li a::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
      z-index: -1;
    }

    .magic-dropdown ul li a:hover {
      background: rgba(255, 255, 255, 0.05) !important;
      color: var(--accent-color) !important;
      transform: translateX(5px) !important;
    }
    
    .magic-dropdown ul li a:hover i {
      transform: scale(1.2) rotate(-5deg);
    }
    
    .magic-dropdown ul li a:hover::after {
      transform: translateX(100%);
    }

    /* MOBILE BOTTOM NAV CSS */
    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(0,0,0,0.05);
      z-index: 9999;
      padding-bottom: env(safe-area-inset-bottom); /* For iPhones */
    }
    .mobile-nav-items {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 65px;
      padding: 0 10px;
    }
    .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: var(--primary-color);
      flex: 1;
      height: 100%;
      position: relative;
      transition: all 0.3s ease;
    }
    .mobile-nav-item i {
      font-size: 22px;
      margin-bottom: 4px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .mobile-nav-item span {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mobile-nav-item.active {
      color: var(--accent-color);
    }
    .mobile-nav-item.active i {
      transform: translateY(-2px);
    }
    /* Magic ripple on click */
    .mobile-nav-item:active i {
      transform: scale(0.8);
    }

    @media (max-width: 768px) {
      .mobile-bottom-nav {
        display: block;
      }
      .mockup-footer {
        margin-bottom: 80px; /* Space for bottom nav */
      }
      /* Keep top logo and icons visible, but we might hide the hamburger if everything is in bottom nav. Let's keep hamburger for complex menus if needed, but the user said "na dole menu kategorie". */
      .menu-toggle {
        display: none !important; /* Hide hamburger as we have bottom nav */
      }
      .mockup-header-logo img {
        height: 28px; /* Slightly smaller for top bar if needed */
      }
    }
"""

magic_html = """
          <div class="magic-dropdown" id="magicShopMenu">
            <div class="magic-dropdown-section">
              <div class="magic-dropdown-title">Oświetlenie LED</div>
              <ul>
                <li><a href="/shop.html?cat=Tasma%20LED"><i class="ph ph-lightning"></i> Taśmy LED COB</a></li>
                <li><a href="/shop.html?cat=Tasma%20LED"><i class="ph ph-aperture"></i> Taśmy LED SMD</a></li>
                <li><a href="/shop.html?cat=Tasma%20LED"><i class="ph ph-magic-wand"></i> Taśmy Neony</a></li>
                <li><a href="/shop.html?cat=Tasma%20LED"><i class="ph ph-package"></i> Zestawy LED</a></li>
              </ul>
            </div>
            <div class="magic-dropdown-section">
              <div class="magic-dropdown-title">Akcesoria i Zasilanie</div>
              <ul>
                <li><a href="/shop.html?cat=Sterowniki%20LED"><i class="ph ph-faders"></i> Sterowniki LED</a></li>
                <li><a href="/shop.html?cat=Zasilacze"><i class="ph ph-plug"></i> Zasilacze Hermetyczne</a></li>
                <li><a href="/shop.html?cat=Profile"><i class="ph ph-minus"></i> Profile aluminiowe</a></li>
                <li><a href="/shop.html?cat=Akcesoria"><i class="ph ph-plugs-connected"></i> Kable i złączki</a></li>
              </ul>
            </div>
          </div>
"""

mobile_nav_html = """
  <!-- Mobile Bottom Navigation -->
  <nav class="mobile-bottom-nav">
    <div class="mobile-nav-items">
      <a href="/index.html" class="mobile-nav-item">
        <i class="ph ph-house"></i>
        <span>Home</span>
      </a>
      <a href="/shop.html" class="mobile-nav-item">
        <i class="ph ph-squares-four"></i>
        <span>Kategorie</span>
      </a>
      <a href="/blog.html" class="mobile-nav-item">
        <i class="ph ph-article"></i>
        <span>Blog</span>
      </a>
      <a href="/about.html" class="mobile-nav-item">
        <i class="ph ph-info"></i>
        <span>O nas</span>
      </a>
      <a href="/contact.html" class="mobile-nav-item">
        <i class="ph ph-envelope-simple"></i>
        <span>Kontakt</span>
      </a>
    </div>
  </nav>
"""

# Patterns
apple_css_pattern = re.compile(r'/\* New Apple-style Dropdown Menu \*/.*?\.apple-dropdown ul li a:active\s*{[^}]+}', re.DOTALL)
apple_html_pattern = re.compile(r'<div class="apple-dropdown">.*?</div>\s*</div>', re.DOTALL)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace CSS
    if apple_css_pattern.search(content):
        content = apple_css_pattern.sub(magic_css, content)
    else:
        # If pattern didn't match, just inject before </style>
        content = content.replace('</style>', magic_css + '\n</style>')
        
    # Replace HTML dropdown
    if apple_html_pattern.search(content):
        content = apple_html_pattern.sub(magic_html, content)
        
    # Remove the old mobile menu div entirely (the hamburger one)
    # We will just leave the HTML there but it's hidden because .menu-toggle is gone. 
    # Let's clean it up if possible.
    content = re.compile(r'<!-- Mobile Menu -->.*?</div>\s*<main', re.DOTALL).sub('<main', content)
        
    # Inject mobile bottom nav before closing body
    if '<!-- Mobile Bottom Navigation -->' not in content:
        content = content.replace('</body>', mobile_nav_html + '\n</body>')
        
    # Add script for magic mouse tracking on dropdown
    magic_script = """
    // Magic dropdown mouse tracking
    const shopMenus = document.querySelectorAll('.magic-dropdown');
    shopMenus.forEach(menu => {
      menu.parentElement.addEventListener('mousemove', (e) => {
        const rect = menu.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        menu.style.setProperty('--mouse-x', `${x}%`);
        menu.style.setProperty('--mouse-y', `${y}%`);
      });
    });
    
    // Mobile bottom nav active state
    const currentPath = window.location.pathname;
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      if(item.getAttribute('href') === currentPath || (currentPath === '/' && item.getAttribute('href') === '/index.html')) {
        item.classList.add('active');
      }
    });
"""
    if '// Magic dropdown' not in content:
        content = content.replace('</script>\n</body>', magic_script + '\n</script>\n</body>')
        # If there's no script block right before body, try adding inside the existing module
        if '</script>\n</body>' not in content:
             content = content.replace('</script>\n</html>', magic_script + '\n</script>\n</html>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Magic applied.")
