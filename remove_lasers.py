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
    
    # Remove .config-bottom-nav::before / ::after
    content = re.sub(r'/\*\s*The Animated Border\s*\*/\s*\.config-bottom-nav::before\s*\{[^}]+\}', '', content)
    content = re.sub(r'\.config-bottom-nav::before\s*\{[^}]+\}', '', content)
    content = re.sub(r'\.config-bottom-nav::after\s*\{[^}]+\}', '', content)
    
    # Remove .mobile-bottom-nav::before / ::after (for other files)
    content = re.sub(r'/\*\s*Laser Animated Border\s*\*/\s*\.mobile-bottom-nav::before\s*\{[^}]+\}', '', content)
    content = re.sub(r'\.mobile-bottom-nav::before\s*\{[^}]+\}', '', content)
    content = re.sub(r'\.mobile-bottom-nav::after\s*\{[^}]+\}', '', content)

    # Some files might have different comments or no comments
    content = re.sub(r'/\*\s*The Animated Border\s*\*/', '', content)
    content = re.sub(r'/\*\s*Laser Animated Border\s*\*/', '', content)
    
    # Also clean up inline animation declarations if they exist
    content = re.sub(r'animation:\s*nav-spin[^;]+;', '', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Lasers removed!")
