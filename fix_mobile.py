import os

def fix_mobile_layout():
    css_path = r"d:\MY-AI-AGENTS\sklepSC\css\prescot-responsive.css"
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_styles = """
/* MOBILE LAYOUT & LOGO FIXES */
html, body {
  overflow-x: hidden !important;
  max-width: 100vw !important;
}

/* Fix Huge Logo on Mobile */
.site-header .brand img,
.mockup-header-logo img,
.footer-logo img {
  max-width: 140px !important;
  height: auto !important;
  object-fit: contain !important;
}

@media (max-width: 768px) {
  .site-header .brand img,
  .mockup-header-logo img {
    max-width: 110px !important;
  }
  .footer-logo img {
    max-width: 130px !important;
  }
}

/* Ensure no elements break the viewport */
img, video, canvas {
  max-width: 100% !important;
}
"""
    
    if "/* MOBILE LAYOUT & LOGO FIXES */" not in content:
        content += new_styles
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed mobile layout in prescot-responsive.css")

    # We also need to fix index.html inline styles because they might override prescot-responsive.css
    index_path = r"d:\MY-AI-AGENTS\sklepSC\index.html"
    with open(index_path, 'r', encoding='utf-8') as f:
        idx_content = f.read()
    
    # Remove any height: 32px !important from .site-header .brand img in index.html
    # so our max-width based scaling works properly
    idx_content = idx_content.replace("height: 32px !important;", "height: auto !important; max-width: 120px !important;")
    idx_content = idx_content.replace("height: 28px !important;", "height: auto !important; max-width: 140px !important;")
    
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(idx_content)
    print("Fixed inline logo styles in index.html")
    
    # Fix in shop.html as well just in case
    shop_path = r"d:\MY-AI-AGENTS\sklepSC\shop.html"
    if os.path.exists(shop_path):
        with open(shop_path, 'r', encoding='utf-8') as f:
            shop_content = f.read()
        shop_content = shop_content.replace("height: 32px !important;", "height: auto !important; max-width: 120px !important;")
        shop_content = shop_content.replace("height: 28px !important;", "height: auto !important; max-width: 140px !important;")
        with open(shop_path, 'w', encoding='utf-8') as f:
            f.write(shop_content)
        print("Fixed inline logo styles in shop.html")

if __name__ == '__main__':
    fix_mobile_layout()
