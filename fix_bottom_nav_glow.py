import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply the glow to the active item
    old_active = """    .mobile-nav-item.active {
      color: var(--accent-color);
    }
    .mobile-nav-item.active i {
      transform: translateY(-2px);
    }"""
    
    new_active = """    .mobile-nav-item.active {
      color: var(--accent-color);
      text-shadow: 0 0 8px rgba(255, 94, 0, 0.3);
    }
    .mobile-nav-item.active i {
      transform: translateY(-2px);
      filter: drop-shadow(0 0 8px rgba(255, 94, 0, 0.5));
    }"""
    
    content = content.replace(old_active, new_active)
    
    # Just in case the backdrop-filter on the nav itself needs to be more "white glassmorphism"
    old_nav = """    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.85);"""
      
    new_nav = """    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.85);"""
      
    # Make sure background is properly white glass
    content = content.replace('background: rgba(255, 255, 255, 0.85);', 'background: rgba(255, 255, 255, 0.90);')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Glow applied")
