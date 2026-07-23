import glob
import re

print("Removing category text line above product card blocks across JS and HTML files...")

# 1. Update JS files
js_files = ["js/shared-popups.js"]
for jspath in js_files:
    with open(jspath, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = re.sub(r'\s*<p class="mockup-product-category">\$\{p\.category\}</p>', '', content)
    
    with open(jspath, "w", encoding="utf-8") as f:
        f.write(content)

# 2. Update HTML files
html_files = glob.glob("*.html")
hide_css = """
  /* Hide Category Text Above Product Card Blocks */
  .mockup-product-category,
  p.mockup-product-category,
  div.mockup-product-category {
    display: none !important;
  }
"""

for fpath in html_files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove inline category paragraphs in product card templates
    content = re.sub(r'\s*<p class="mockup-product-category">\$\{p\.category\}</p>', '', content)

    # Ensure CSS rule hides .mockup-product-category
    if "id=\"uncropped-product-images-override\"" in content:
        content = content.replace("</style>", f"{hide_css}\n</style>", 1)

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print("Product card category lines removed and hidden project-wide.")
