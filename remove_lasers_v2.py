import re
import glob

files = glob.glob('*.html')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove @property --nav-angle
    content = re.sub(r'@property\s*--nav-angle\s*\{[^}]+\}', '', content)
    
    # Remove @keyframes nav-spin
    content = re.sub(r'@keyframes\s*nav-spin\s*\{[^}]+\}', '', content)
    
    # Remove .new-glass-nav::before block
    content = re.sub(r'\.new-glass-nav::before\s*\{[^}]+\}', '', content)
    
    # Ensure any background: conic-gradient is removed from these blocks
    content = re.sub(r'background:\s*conic-gradient\([^;]+;', '', content)
    
    # Remove animation: nav-spin
    content = re.sub(r'animation:\s*nav-spin[^;]+;', '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Lasers removed completely!")
