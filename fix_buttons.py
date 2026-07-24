import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    mobile_btn_fix = """
    @media (max-width: 768px) {
      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        background: var(--primary-color) !important;
        color: var(--white) !important;
        border: none !important;
        font-weight: 600 !important;
      }
    }
    """
    
    if 'border: none !important;' not in content:
        # Just append to the end of the body to guarantee it runs
        content = content.replace('</body>', '<style>' + mobile_btn_fix + '</style>\n</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
