import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the section with id="kategorie-banners"
    # add scroll-margin-top to ensure it doesn't hide under the header
    if 'id="kategorie-banners"' in content:
        # Check if we already added it
        if 'scroll-margin-top: 120px;' not in content:
            content = content.replace('id="kategorie-banners" style="', 'id="kategorie-banners" style="scroll-margin-top: 120px; ')
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Scroll target margin fixed")
