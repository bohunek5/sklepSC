import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to fix the white on white text in the dropdown.
    # Replace `.mockup-nav .magic-dropdown ul li a { color: #ffffff !important; }` with something dark
    
    # Let's just append a very strong overriding CSS block at the end of <head>
    
    dropdown_fix = """
  <style>
    /* FIX DROPDOWN TEXT COLOR - WHITE ON WHITE ISSUE */
    .magic-dropdown {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(24px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(24px) saturate(150%) !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important;
    }
    .mockup-nav .magic-dropdown ul li a, 
    .mockup-header.scrolled .magic-dropdown ul li a,
    .magic-dropdown ul li a {
      color: #1a1a1a !important; /* Dark text for visibility */
      background: rgba(0,0,0,0.03) !important;
      border: 1px solid rgba(0,0,0,0.05) !important;
    }
    .mockup-nav .magic-dropdown ul li a:hover, 
    .mockup-header.scrolled .magic-dropdown ul li a:hover,
    .magic-dropdown ul li a:hover {
      background: rgba(0,0,0,0.06) !important;
      border-color: rgba(0,0,0,0.12) !important;
      color: #ff5e00 !important; /* Orange text on hover */
    }
  </style>
"""
    if '/* FIX DROPDOWN TEXT COLOR - WHITE ON WHITE ISSUE */' not in content:
        content = content.replace('</head>', dropdown_fix + '\n</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Dropdown text color fixed")
