import re

def clean_preloader():
    with open('configurator.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Remove the preloader block
    html = re.sub(r'<div id="preloader">.*?</div>\s*</div>', '', html, flags=re.DOTALL)
    
    with open('configurator.html', 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    clean_preloader()
