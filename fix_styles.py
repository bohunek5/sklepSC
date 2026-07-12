import glob
import re

for filepath in glob.glob("*.html"):
    if filepath == 'old_index.html': continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix mockup-action-icon border-radius
    # We just inject a style block before </head> to override it globally in the file.
    # Same for PC menu buttons
    
    override_style = """
  <style>
    .mockup-action-icon {
      border-radius: 50% !important;
    }
    
    .mockup-nav ul li a {
      color: var(--white) !important;
      text-decoration: none !important;
      font-weight: 600 !important;
      font-size: 11px !important;
      padding: 8px 20px !important;
      border-radius: 8px !important;
      background: rgba(255, 255, 255, 0.15) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      transition: all 0.3s ease !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      display: inline-block;
    }
    .mockup-nav ul li a:hover, .mockup-nav ul li a.active {
      background: rgba(255, 255, 255, 0.25) !important;
    }
    
    .mockup-header.scrolled .mockup-nav ul li a {
      color: var(--primary-color) !important;
      background: rgba(0, 31, 63, 0.05) !important;
      border: 1px solid rgba(0, 31, 63, 0.1) !important;
    }
    .mockup-header.scrolled .mockup-nav ul li a:hover, 
    .mockup-header.scrolled .mockup-nav ul li a.active {
      background: rgba(0, 31, 63, 0.15) !important;
    }
    
    .mockup-nav ul li.has-mega-menu > a {
      display: flex !important;
      align-items: center !important;
    }
  </style>
"""
    if "border-radius: 50% !important;" not in content:
        content = content.replace("</head>", f"{override_style}</head>")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Injected overrides to {filepath}")
