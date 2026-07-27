import glob
import re

def fix_all():
    html_files = glob.glob('*.html')
    phosphor_script = '<script src="https://unpkg.com/@phosphor-icons/web"></script>'
    
    for f in html_files:
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
            
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
                
        if modified:
            with open(f, 'w', encoding='utf-8', errors='ignore') as file:
                file.write(content)
                print(f"Updated {f} with Phosphor / Cart redirect")
                
    # 3. Add auto-open cart logic to shared-popups.js
    with open('js/shared-popups.js', 'r', encoding='utf-8', errors='ignore') as f:
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
        with open('js/shared-popups.js', 'w', encoding='utf-8', errors='ignore') as f:
            f.write(js_content)
            print("Updated shared-popups.js with auto-open logic")

if __name__ == '__main__':
    fix_all()

