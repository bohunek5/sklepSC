import glob

mobile_fixes = """
  <style>
    @media (max-width: 768px) {
      /* Fix sizes for buttons without changing colors */
      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        padding: 6px 14px !important;
        font-size: 12px !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        white-space: normal !important;
        text-align: center !important;
        line-height: 1.2 !important;
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

    # Append before </head>
    content = content.replace('</head>', mobile_fixes + '\n</head>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Button sizes fixed")
