import glob
import re

print("Reverting product card image layout to full square fill (object-fit: cover)...")

square_css = """<style id="square-product-images-override">
  /* Full Square Fill Product Cards (object-fit: cover) */
  .mockup-product-media,
  div.mockup-product-media {
    position: relative !important;
    width: 100% !important;
    aspect-ratio: 1 / 1 !important;
    height: auto !important;
    overflow: hidden !important;
    border-radius: 12px !important;
    padding: 0 !important;
    margin-bottom: 8px !important;
    background-color: #f4f6f9 !important;
    display: block !important;
  }

  .mockup-product-img,
  .mockup-product-media img {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
    object-fit: cover !important;
    object-position: center !important;
    border-radius: inherit !important;
    padding: 0 !important;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  .mockup-product-card:hover .mockup-product-img,
  .mockup-product-card:hover .mockup-product-media img {
    transform: scale(1.05) !important;
  }

  /* Hide category text line above product card blocks */
  .mockup-product-category,
  p.mockup-product-category,
  div.mockup-product-category {
    display: none !important;
  }
</style>
"""

html_files = glob.glob("*.html")

for fpath in html_files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace old uncropped-product-images-override or square-product-images-override
    if "id=\"uncropped-product-images-override\"" in content:
        content = re.sub(r'<style id="uncropped-product-images-override">.*?</style>', square_css, content, flags=re.DOTALL)
    elif "id=\"square-product-images-override\"" in content:
        content = re.sub(r'<style id="square-product-images-override">.*?</style>', square_css, content, flags=re.DOTALL)
    elif "</head>" in content:
        content = content.replace("</head>", f"{square_css}\n</head>")

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated square product image styling across all HTML files.")
