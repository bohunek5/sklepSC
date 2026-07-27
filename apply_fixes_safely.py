import glob

def fix_all():
    html_files = glob.glob('*.html')
    phosphor_script = '<script src="https://unpkg.com/@phosphor-icons/web"></script>'
    
    for f in html_files:
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
        except UnicodeDecodeError:
            print(f"Skipping {f} due to encoding error (should not happen)")
            continue
            
        modified = False
        
        # 1. Add phosphor icons if missing
        if phosphor_script not in content and '<head>' in content:
            content = content.replace('</head>', f'  {phosphor_script}\n</head>')
            modified = True
            
        # 2. Redirect cart.html
        if f == 'cart.html':
            redirect_script = '<script>window.location.replace("index.html?cart=open");</script>'
            if redirect_script not in content:
                content = content.replace('</head>', f'  {redirect_script}\n</head>')
                modified = True
                
        # 3. Hide mobile config-bottom-nav on desktop
        if '<style id="global-config-nav-css">' in content and '.config-bottom-nav { display: none; }' not in content:
            content = content.replace('<style id="global-config-nav-css">', '<style id="global-config-nav-css">\n.config-bottom-nav { display: none; }')
            modified = True
            
        # 4. index.html spacing fixes
        if f == 'index.html':
            if 'padding-top: 100px !important;' in content:
                content = content.replace('padding-top: 100px !important;', 'padding-top: 130px !important;')
                modified = True
            if 'bottom: 140px !important;' in content:
                content = content.replace('bottom: 140px !important;', 'bottom: 180px !important;')
                modified = True
                
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated {f}")
                
    # 5. Add auto-open cart logic to shared-popups.js
    with open('js/shared-popups.js', 'r', encoding='utf-8') as f:
        js_content = f.read()
        
    auto_open_code = """
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.search.includes('cart=open')) {
    setTimeout(() => {
      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }
    }, 200);
  }
});
"""
    if 'cart=open' not in js_content:
        js_content += auto_open_code
        with open('js/shared-popups.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("Updated shared-popups.js")

if __name__ == '__main__':
    fix_all()
