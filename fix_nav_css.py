import os
import glob

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to replace the active state CSS block
    import re
    # Match from /* Active State */ down to the end of the mobile-nav-item.active::after block
    pattern = r"/\*\s*Active State\s*\*/.*?\.mobile-nav-item\.active::after\s*{[^}]*}"
    
    replacement = """/* Active State */
    .mobile-nav-item.active {
      color: #001f3f;
    }
    .mobile-nav-item.active i {
      color: #001f3f;
    }"""
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for html_file in glob.glob("*.html"):
    fix_file(html_file)
