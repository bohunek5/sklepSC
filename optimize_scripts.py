import re
import glob

files = glob.glob('*.html')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add defer to products-data.js
    content = content.replace('<script src="js/products-data.js"></script>', '<script src="js/products-data.js" defer></script>')
    
    # 2. Add defer to shared-popups.js
    content = content.replace('<script src="js/shared-popups.js"></script>', '<script src="js/shared-popups.js" defer></script>')
    
    # 3. Add defer to other heavy js scripts if loaded at bottom without defer
    content = content.replace('<script src="js/ai-agent.js"></script>', '<script src="js/ai-agent.js" defer></script>')
    content = content.replace('<script src="js/advanced-filters.js"></script>', '<script src="js/advanced-filters.js" defer></script>')
    content = content.replace('<script src="js/smart-search.js"></script>', '<script src="js/smart-search.js" defer></script>')
    
    # 4. Fix document.write for mobile-app-shell.js
    # original: <script>if (window.matchMedia('(max-width: 768px)').matches) document.write('<script src="js/mobile-app-shell.js"><\/script>');</script>
    mobile_shell_regex = r"<script>if\s*\([^)]+\)\s*document\.write\('<script[^>]+mobile-app-shell\.js[^>]+><\\/script>'\);</script>"
    replacement = "<script>if (window.matchMedia('(max-width: 768px)').matches) { const s = document.createElement('script'); s.src = 'js/mobile-app-shell.js'; s.defer = true; document.head.appendChild(s); }</script>"
    content = re.sub(mobile_shell_regex, replacement, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Script optimization complete!")
