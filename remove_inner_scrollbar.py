import os

product_path = "product.html"
with open(product_path, "r", encoding="utf-8") as f:
    content = f.read()

old_sticky_css = """  .product-meta {
    position: sticky !important;
    top: 110px !important;
    align-self: start !important;
    z-index: 10 !important;
    max-height: calc(100vh - 130px) !important;
    overflow-y: auto !important;
    padding-right: 8px !important;
    margin-bottom: 40px !important;
    scrollbar-width: thin !important;
    scrollbar-color: rgba(11, 26, 48, 0.2) transparent !important;
  }"""

new_sticky_css = """  .product-meta {
    position: sticky !important;
    top: 110px !important;
    align-self: start !important;
    z-index: 10 !important;
    overflow: visible !important;
    margin-bottom: 40px !important;
  }"""

content = content.replace(old_sticky_css, new_sticky_css)

with open(product_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Removed inner scrollbar from product-meta in product.html.")
