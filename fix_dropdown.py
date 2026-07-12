import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The dropdown style when scrolled is what breaks the glassmorphism
    old_scrolled = """    .mockup-header.scrolled .magic-dropdown {
      background: #ffffff !important;
      color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      box-shadow: 0 6px 20px rgba(11,26,48,0.1) !important;
    }"""
    
    new_scrolled = """    .mockup-header.scrolled .magic-dropdown {
      background: rgba(255, 255, 255, 0.85) !important;
      backdrop-filter: blur(24px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(150%) !important;
      color: var(--primary-color) !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important;
    }
    .mockup-header.scrolled .magic-dropdown ul li a {
      color: var(--primary-color) !important;
    }
    .mockup-header.scrolled .magic-dropdown ul li a:hover {
      background: rgba(0,0,0,0.03) !important;
    }"""
    
    content = content.replace(old_scrolled, new_scrolled)

    # The user also wants the items in the dropdown to look like buttons with margins "tak jak model ramki od hasel na hero glownej cos"
    # To do this, let's style `.magic-dropdown ul li a` directly.
    # We will give them a glassmorphism border and padding by default, and change it on hover.
    
    # Let's find the current default styling for `.magic-dropdown ul li a`
    # It's at lines ~1885 in index.html
    # We'll just append an override at the end of the <head> to be safe.
    
    dropdown_override = """
  <style>
    /* Dropdown item "ramki" style */
    .magic-dropdown ul li a {
      border-radius: 8px !important;
      padding: 10px 16px !important;
      margin-bottom: 6px !important;
      background: rgba(0,0,0,0.02) !important;
      border: 1px solid rgba(0,0,0,0.04) !important;
      transition: all 0.3s ease !important;
    }
    .mockup-header:not(.scrolled) .magic-dropdown ul li a {
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      color: rgba(255,255,255,0.9) !important;
    }
    .mockup-header:not(.scrolled) .magic-dropdown ul li a:hover {
      background: rgba(255,255,255,0.15) !important;
      border-color: rgba(255,255,255,0.3) !important;
      transform: translateX(4px);
    }
    .mockup-header.scrolled .magic-dropdown ul li a:hover {
      background: rgba(0,0,0,0.06) !important;
      border-color: rgba(0,0,0,0.12) !important;
      transform: translateX(4px);
    }
    /* Remove the > icon if it was visible, or keep it */
    .magic-dropdown ul li a i {
      display: none !important;
    }
    .magic-dropdown ul li {
      border-top: none !important;
    }
    .magic-dropdown ul {
      gap: 4px;
    }
  </style>
"""
    if '/* Dropdown item "ramki" style */' not in content:
        content = content.replace('</head>', dropdown_override + '\n</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Dropdown fixed")
