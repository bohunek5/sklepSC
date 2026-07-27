import os
import re
import glob

def purge_configurator():
    # Find all HTML files
    html_files = glob.glob('*.html')
    
    # We want to remove:
    # <a href="configurator.html"...>...</a>
    # <a href="konfigurator-led.html"...>...</a>
    # <li><a href="configurator.html"...>...</a></li>
    # <li><a href="konfigurator-led.html"...>...</a></li>
    
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original = content
        
        # Regex to remove <li><a ... configurator.html ...>...</a></li>
        content = re.sub(r'<li[^>]*>\s*<a[^>]*href=["\'](?:configurator\.html|konfigurator-led\.html)["\'][^>]*>.*?</a>\s*</li>', '', content, flags=re.IGNORECASE | re.DOTALL)
        
        # Regex to remove standalone <a ... configurator.html ...>...</a> (like in desktop nav and bottom nav)
        content = re.sub(r'<a[^>]*href=["\'](?:configurator\.html|konfigurator-led\.html)["\'][^>]*>.*?</a>', '', content, flags=re.IGNORECASE | re.DOTALL)
        
        # Remove any extra empty spaces/lines left behind in the nav blocks if needed, but HTML ignores whitespace anyway.
        
        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Purged from {file}")

if __name__ == '__main__':
    purge_configurator()
