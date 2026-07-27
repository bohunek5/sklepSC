import re

def fix_configurator():
    # 1. Update configurator.html to remove catalogLoading
    with open('configurator.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Remove the catalogLoading div
    html = re.sub(r'<div class="loading-overlay" id="catalogLoading".*?</div>\s*</div>', '</div>', html, flags=re.DOTALL)
    # The regex might be tricky, let's just do a simpler replace
    html = re.sub(r'<div class="loading-overlay" id="catalogLoading"[^>]*>.*?</div>', '', html, flags=re.DOTALL)
    
    # Also add the preloader that the rest of the site uses!
    # Let's check if preloader is there
    if '<div id="preloader">' not in html:
        # Add it right after <body>
        preloader = '''
  <div id="preloader">
    <div class="loader-logo">PRESCOT</div>
    <div class="loader-bar"></div>
  </div>
'''
        html = html.replace('<body>', f'<body>{preloader}')
    
    with open('configurator.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    # 2. Update configurator.js to remove catalogLoading references
    with open('js/configurator.js', 'r', encoding='utf-8') as f:
        js = f.read()
        
    js = js.replace("document.getElementById('catalogLoading').hidden = true;", "")
    js = js.replace("document.getElementById('catalogLoading').hidden = false;", "")
    
    with open('js/configurator.js', 'w', encoding='utf-8') as f:
        f.write(js)

    # 3. Update configurator.css body background
    with open('css/configurator.css', 'r', encoding='utf-8') as f:
        css = f.read()
        
    # Find body { ... }
    css = re.sub(r'body\s*\{[^}]*background:\s*var\(--soft\)[^}]*\}', lambda m: m.group(0).replace('var(--soft)', 'var(--navy)'), css)
    
    with open('css/configurator.css', 'w', encoding='utf-8') as f:
        f.write(css)

if __name__ == '__main__':
    fix_configurator()
