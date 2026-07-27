import re

def main():
    # 1. Update CSS
    with open('css/configurator.css', 'r', encoding='utf-8') as f:
        css = f.read()
        
    css = re.sub(r'(body\s*\{[^}]*background:\s*)var\(--soft\)', r'\1var(--navy)', css)
    
    # Append the specific white overrides for text outside the white boxes
    css += '''
/* Dark mode overrides for outside text */
.configurator-intro h2,
.results-heading h2,
.trust-strip h3 { color: #fff !important; }

.configurator-intro > p,
.section-kicker { color: rgba(255,255,255,0.7) !important; }

.button-secondary#editConfiguration {
    background: transparent !important;
    color: #fff !important;
    border-color: rgba(255,255,255,0.3) !important;
}
.button-secondary#editConfiguration:hover {
    border-color: #fff !important;
}
'''
    with open('css/configurator.css', 'w', encoding='utf-8') as f:
        f.write(css)
        
    # 2. Update HTML
    with open('configurator.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Remove the preloader if any
    html = re.sub(r'<div id="preloader">.*?</div>\s*</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<div id="preloader"[^>]*>.*?</div>', '', html, flags=re.DOTALL)
    
    # Remove catalogLoading
    html = re.sub(r'<div class="loading-overlay" id="catalogLoading"[^>]*>.*?</div>\s*(</div>)?', '', html, flags=re.DOTALL)
    
    with open('configurator.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    # 3. Update JS
    with open('js/configurator.js', 'r', encoding='utf-8') as f:
        js = f.read()
        
    js = js.replace("document.getElementById('catalogLoading').hidden = true;", "")
    js = js.replace("document.getElementById('catalogLoading').hidden = false;", "")
    
    with open('js/configurator.js', 'w', encoding='utf-8') as f:
        f.write(js)

if __name__ == '__main__':
    main()
