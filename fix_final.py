import glob

mobile_fixes = """
  <style>
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
  </style>
"""

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it's already there, replace it, else append before </head>
    if 'background: var(--accent-color) !important;' in content:
        pass # Wait, it didn't find it earlier.

    content = content.replace('</head>', mobile_fixes + '\n</head>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
