import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the stylesheet link
    content = re.sub(r'<link[^>]+href="[^"]*mobile-app\.css"[^>]*>\s*', '', content)

    # Remove the mobile app layout block completely
    # It might be large, so we can use a regex to match from <div class="mobile-app-layout"> to its closing tag.
    # Actually, let's just find <div class="mobile-app-layout"> and remove the entire block.
    # In my previous code, I probably appended it at the end of the <body> or near it.
    
    # We will use regex to find <div class="mobile-app-layout">...</div>
    # Note: html parsing with regex is brittle, but since I generated it, I know roughly how it looks.
    # Let's try to match it.
    pattern = r'<div class="mobile-app-layout">.*?</div>\s*<!-- \/mobile-app-layout -->'
    
    # Let's check if there's a comment marking the end
    # If not, we might need a simpler replace. Let's do a more robust approach.
    pass

