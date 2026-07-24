import glob

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where I added the bad primary color block
    bad_block = """@media (max-width: 768px) {
      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        background: var(--primary-color) !important;
        color: var(--white) !important;
        border: none !important;
        font-weight: 600 !important;
      }
    }"""
    
    good_block = """@media (max-width: 768px) {
      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        background: var(--accent-color) !important;
        color: var(--white) !important;
        border: none !important;
        font-weight: 600 !important;
        padding: 6px 12px !important;
        font-size: 11px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: block !important;
      }
    }"""
    
    if bad_block in content:
        content = content.replace(bad_block, good_block)
    else:
        # Maybe it's missing entirely or slightly different. Let's just append it.
        # But if it exists differently, it will conflict.
        pass

    # Ensure the background was actually removed from the search button
    content = content.replace('/* removed background to restore glassmorph */', '')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
