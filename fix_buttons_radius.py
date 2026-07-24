import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the mobile_fixes block and insert border-radius
    old_css = """      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        padding: 6px 14px !important;
        font-size: 12px !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        white-space: normal !important;
        text-align: center !important;
        line-height: 1.2 !important;
      }"""
      
    new_css = """      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        padding: 8px 16px !important;
        font-size: 12px !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        white-space: normal !important;
        text-align: center !important;
        line-height: 1.2 !important;
        border-radius: 8px !important;
      }"""
    
    content = content.replace(old_css, new_css)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Button border radius fixed")
