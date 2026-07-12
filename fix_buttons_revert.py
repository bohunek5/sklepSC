import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert the button style injection
    pattern = r'<style>\s*@media \(max-width: 768px\) \{\s*\.add-to-cart-btn, \.buy-it-now-btn, \.mockup-btn \{[^}]*\}\s*\.mockup-search-container button \{\s*background: transparent !important;\s*\}\s*\}\s*</style>'
    
    # We will remove the exact block added by fix_final.py
    if '@media (max-width: 768px) {\n      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {' in content:
        # It's easier to just find the block and remove it because we appended it right before </head>
        block_to_remove = """<style>
    @media (max-width: 768px) {
      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        background: var(--accent-color) !important;
        color: var(--white) !important;
        border: none !important;
        font-weight: 600 !important;
        padding: 6px 12px !important;
        font-size: 11px !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: inline-block !important;
        white-space: nowrap !important;
      }
      .mockup-search-container button {
        background: transparent !important;
      }
    }
  </style>"""
        content = content.replace(block_to_remove + '\n</head>', '</head>')
        # Try without newline
        content = content.replace(block_to_remove + '</head>', '</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Buttons reverted")
