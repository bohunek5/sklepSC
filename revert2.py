import glob

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where I added the mobile_fixes block
    start_tag = '<style>\n    @media (max-width: 768px) {\n      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {'
    if start_tag in content:
        start_idx = content.find(start_tag)
        end_idx = content.find('</style>', start_idx) + 8
        if end_idx > 8:
            content = content[:start_idx] + content[end_idx:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done reverting block")
