import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix the search button mobile background (remove the navy background)
    content = content.replace('background: var(--primary-color) !important;\n        border-radius: 50% !important;', '/* removed background to restore glassmorph */')
    content = content.replace('background: var(--primary-color) !important;\r\n        border-radius: 50% !important;', '/* removed background to restore glassmorph */')

    # 2. Fix the "Add to cart" overflow and color
    # In my previous script, I appended:
    # @media (max-width: 768px) {
    #   .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
    #     background: var(--primary-color) !important;
    #     color: var(--white) !important;
    #     border: none !important;
    #     font-weight: 600 !important;
    #   }
    # }
    
    # Let's replace that entire block with a better one using --accent-color, smaller padding, and font-size
    old_mobile_btn_fix = """
    @media (max-width: 768px) {
      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        background: var(--primary-color) !important;
        color: var(--white) !important;
        border: none !important;
        font-weight: 600 !important;
      }
    }
    """
    
    new_mobile_btn_fix = """
    @media (max-width: 768px) {
      .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
        background: var(--accent-color) !important;
        color: var(--white) !important;
        border: none !important;
        font-weight: 600 !important;
        padding: 6px 12px !important;
        font-size: 11px !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
    }
    """
    
    # Use regex to replace in case whitespace differs
    content = re.sub(r'@media \(max-width: 768px\) \{\s*\.add-to-cart-btn, \.buy-it-now-btn, \.mockup-btn \{\s*background: var\(--primary-color\) !important;\s*color: var\(--white\) !important;\s*border: none !important;\s*font-weight: 600 !important;\s*\}\s*\}', new_mobile_btn_fix, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
