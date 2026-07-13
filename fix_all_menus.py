import glob

correct_menu_css = """
    /* --- OVERRIDE MENU STYLES START --- */
    body .mockup-nav > ul > li > a {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      position: relative;
      border-radius: 0 !important;
      padding: 10px 15px !important;
    }
    body .mockup-header:not(.scrolled) .mockup-nav > ul > li > a {
      color: var(--white) !important;
    }
    body .mockup-header.scrolled .mockup-nav > ul > li > a {
      color: var(--primary-color) !important;
    }
    
    body .mockup-nav > ul > li > a::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 15px;
      right: 15px;
      height: 2px;
      background-color: currentColor;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.3s ease;
    }
    body .mockup-nav > ul > li > a:hover::after, body .mockup-nav > ul > li > a.active::after {
      transform: scaleX(1);
    }
    body .mockup-nav > ul > li > a:hover {
      transform: translateY(-1px);
    }
    
    /* Magic Dropdown Links */
    body .magic-dropdown {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(24px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(150%) !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important;
    }
    
    body .mockup-header:not(.scrolled) .magic-dropdown ul li a,
    body .mockup-header.scrolled .magic-dropdown ul li a,
    body .magic-dropdown ul li a {
      color: #333 !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      text-decoration: none !important;
      transition: all 0.25s ease !important;
      display: flex !important;
      align-items: center !important;
      padding: 8px 16px !important;
      margin-bottom: 0 !important;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    
    body .magic-dropdown ul li a i {
      display: none !important;
    }
    
    @media (min-width: 993px) {
      body .mockup-nav .magic-dropdown ul li a {
        font-size: 14px !important;
        color: #555 !important;
        padding: 8px 16px !important;
      }
      
      body .mockup-nav .magic-dropdown ul li a:hover {
        color: var(--accent-color) !important;
        font-weight: 600 !important;
        transform: translateX(4px);
      }
    }
    /* --- OVERRIDE MENU STYLES END --- */
"""

html_files = glob.glob("*.html")
for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "/* --- OVERRIDE MENU STYLES START --- */" in content:
        start_idx = content.find("/* --- OVERRIDE MENU STYLES START --- */")
        end_idx = content.find("/* --- OVERRIDE MENU STYLES END --- */") + len("/* --- OVERRIDE MENU STYLES END --- */")
        content = content[:start_idx] + content[end_idx:]
    
    last_style_idx = content.rfind("</style>")
    if last_style_idx != -1:
        content = content[:last_style_idx] + correct_menu_css + "\n" + content[last_style_idx:]
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
print("Injected ultra-specific CSS with dark dropdown text!")

