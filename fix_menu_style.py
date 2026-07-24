import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the main menu buttons - remove the 6px border-radius added recently and any square borders
content = re.sub(
    r'\.mockup-nav ul li a\s*\{[^}]*border-radius:\s*6px\s*!important;[^}]*\}',
    '',
    content
)

# 2. Fix the magic-dropdown items (remove buttons, just make them text)
# Find the .magic-dropdown ul li a { ... } and replace it.
new_dropdown_css = '''
    .magic-dropdown ul li a {
      color: rgba(255, 255, 255, 0.8) !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      text-decoration: none !important;
      transition: all 0.25s ease !important;
      display: flex !important;
      align-items: center !important;
      padding: 10px 16px !important;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
    }
    
    .magic-dropdown ul li a i {
      display: none;
    }
    
    /* Desktop Hover */
    @media (min-width: 993px) {
      .mockup-nav .magic-dropdown ul li a {
        font-size: 14px !important;
        color: #666 !important;
        text-decoration: none !important;
        font-weight: normal !important;
        transition: color 0.2s ease !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 8px 16px !important;
        background: transparent !important;
        border: none !important;
      }
      
      .mockup-nav .magic-dropdown ul li a:hover {
        color: var(--accent-color) !important;
        font-weight: 600 !important;
        background: transparent !important;
        border: none !important;
        transform: translateX(4px);
      }
      .mockup-header.scrolled .magic-dropdown ul li a:hover {
         color: var(--accent-color) !important;
         background: transparent !important;
         border: none !important;
         transform: translateX(4px);
      }
    }
'''

# Replace the block that sets border-radius: 8px and background: rgba(0,0,0,0.02)
content = re.sub(
    r'\.magic-dropdown ul li a\s*\{[^}]*border-radius:\s*8px[^}]*\}',
    '',
    content
)
# And the other block that has color: #1a1a1a !important; background: rgba(0,0,0,0.03) !important;
content = re.sub(
    r'\.magic-dropdown ul li a\s*\{[^}]*color:\s*#1a1a1a[^}]*\}',
    '',
    content
)
# Also remove the :hover overrides with background: rgba(0,0,0,0.06)
content = re.sub(
    r'\.mockup-nav \.magic-dropdown ul li a:hover,.*?color:\s*#ff5e00\s*!important;\s*\}',
    '',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'\.mockup-header:not\(\.scrolled\) \.magic-dropdown ul li a[^}]+\}',
    '',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'\.mockup-header\.scrolled \.magic-dropdown ul li a:hover[^}]+\}',
    '',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'\.mockup-nav \.magic-dropdown ul li a\s*\{[^}]*\}',
    '',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'\.mockup-nav \.magic-dropdown ul li a:hover\s*\{[^}]*\}',
    '',
    content,
    flags=re.DOTALL
)

# Insert our new clean dropdown css at the end of the style block
content = content.replace('</style>', new_dropdown_css + '\n  </style>', 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("index.html updated with clean menu styles!")
