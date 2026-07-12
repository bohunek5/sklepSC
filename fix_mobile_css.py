import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove circle styling from mobile bottom nav icons
    content = content.replace("width: 40px;\n      height: 40px;", "")
    content = content.replace("border-radius: 50%;", "")
    
    # Fix page-hero h1 font size on mobile to be smaller and not truncated
    content = re.sub(
        r'\.page-hero h1 {\s*font-size:\s*28px\s*!important;\s*white-space:\s*nowrap\s*!important;\s*overflow:\s*hidden\s*!important;\s*text-overflow:\s*ellipsis\s*!important;\s*}',
        '.page-hero h1 {\n        font-size: 20px !important;\n      }', 
        content
    )
    
    content = re.sub(
        r'\.page-hero h1\s*{\s*font-size:\s*\d+px\s*!important;\s*white-space:\s*nowrap\s*!important;\s*overflow:\s*hidden\s*!important;\s*text-overflow:\s*ellipsis\s*!important;\s*}',
        '.page-hero h1 {\n        font-size: 20px !important;\n      }', 
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done patching mobile CSS across all HTML files.")
