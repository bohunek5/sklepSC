import os

print("Updating product.html and js/shared-popups.js for HTML descriptions & removing right side description...")

# 1. Update product.html
product_path = "product.html"
with open(product_path, "r", encoding="utf-8") as f:
    content = f.read()

# Hide/remove pDesc on right side
old_pdesc_code = "document.getElementById('pDesc').textContent = product.description;"
new_pdesc_code = "const pDescEl = document.getElementById('pDesc'); if (pDescEl) pDescEl.style.display = 'none';"

content = content.replace(old_pdesc_code, new_pdesc_code)

# Fix descTab rendering to use innerHTML directly without wrapping <p> tag
old_desctab_code = """    // Load description and bottom variants inside descTab
    document.getElementById('descTab').innerHTML = `
      <p style="font-size: 15px; line-height: 1.8; color: #555; margin-bottom: 30px;">${product.description}</p>
    `;"""

new_desctab_code = """    // Load description with full HTML formatting inside bottom descTab
    const descTabEl = document.getElementById('descTab');
    if (descTabEl) {
      descTabEl.innerHTML = `<div class="product-html-description">${product.description}</div>`;
    }"""

content = content.replace(old_desctab_code, new_desctab_code)

# Add rich CSS styling for HTML descriptions at bottom
desc_styles = """
<style id="html-description-styles">
  .product-html-description {
    font-size: 15px;
    line-height: 1.85;
    color: #334155;
    padding: 10px 0;
  }
  .product-html-description p {
    margin-bottom: 18px;
    line-height: 1.85;
  }
  .product-html-description strong, .product-html-description b {
    color: #0b1a30;
    font-weight: 700;
  }
  .product-html-description ul, .product-html-description ol {
    margin: 16px 0 22px 24px;
    padding-left: 8px;
  }
  .product-html-description li {
    margin-bottom: 10px;
    line-height: 1.7;
  }
  .product-html-description h1, 
  .product-html-description h2, 
  .product-html-description h3, 
  .product-html-description h4 {
    font-family: 'Outfit', sans-serif;
    color: #0b1a30;
    margin: 28px 0 14px 0;
    font-weight: 700;
  }
  .product-html-description table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
  }
  .product-html-description table td, .product-html-description table th {
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    font-size: 14px;
  }
  .product-html-description table tr:nth-child(even) {
    background-color: #f8fafc;
  }
</style>
"""

if "</head>" in content and "id=\"html-description-styles\"" not in content:
    content = content.replace("</head>", f"{desc_styles}\n</head>")

with open(product_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated product.html.")

# 2. Update js/shared-popups.js for quick view HTML description
sp_path = os.path.join("js", "shared-popups.js")
with open(sp_path, "r", encoding="utf-8") as f:
    sp_content = f.read()

sp_content = sp_content.replace(
    "document.getElementById('qvDesc').textContent = selectedProduct.description;",
    "document.getElementById('qvDesc').innerHTML = selectedProduct.description;"
)

with open(sp_path, "w", encoding="utf-8") as f:
    f.write(sp_content)

print("Updated js/shared-popups.js.")
