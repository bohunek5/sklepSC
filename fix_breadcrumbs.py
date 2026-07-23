import os

product_path = "product.html"
with open(product_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the static breadcrumb container HTML with a dynamic container element
old_breadcrumb_html = """<div class="product-breadcrumbs" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; font-size: 11px; color: #888; margin-bottom: -15px; font-family: 'Inter', sans-serif; flex-wrap: wrap; background: #fafafa; padding: 10px 15px; border-radius: 8px; border: 1px solid #f0f0f0;">
<a href="index.html" style="color: #666; text-decoration: none; display: flex; align-items: center; gap: 4px; font-weight: 500;">
<svg fill="none" height="12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewbox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        Główna
      </a>
<span style="opacity: 0.5;">/</span>
<a href="shop.html" style="color: #666; text-decoration: none; font-weight: 500;">Sklep</a>
<span style="opacity: 0.5;">/</span>
<a href="shop.html" id="breadcrumbCategory" style="color: #666; text-decoration: none; font-weight: 500;">Kategoria</a>
<span style="opacity: 0.5;">/</span>
<span id="breadcrumbTitle" style="color: var(--primary-color); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">Nazwa produktu</span>
</div>"""

new_breadcrumb_html = """<div class="product-breadcrumbs" id="dynamicBreadcrumbs" style="grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; margin-bottom: -10px; font-family: 'Inter', sans-serif; flex-wrap: wrap; background: #f8fafc; padding: 12px 18px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
  <!-- Breadcrumbs generated dynamically in JS -->
</div>"""

content = content.replace(old_breadcrumb_html, new_breadcrumb_html)

# Update breadcrumbs JS logic inside product.html
old_breadcrumb_js = """    // Populate Breadcrumbs dynamically
    const bCat = document.getElementById('breadcrumbCategory');
    if (bCat) {
      bCat.textContent = product.category;
      bCat.href = `shop.html?cat=${encodeURIComponent(product.category)}`;
    }
    const bTitle = document.getElementById('breadcrumbTitle');
    if (bTitle) {
      bTitle.textContent = product.title;
    }
    const bMiniImg = document.getElementById('breadcrumbMiniImg');
    if (bMiniImg) {
      bMiniImg.src = product.image;
    }
    const bMiniTitle = document.getElementById('breadcrumbMiniTitle');
    if (bMiniTitle) {
      bMiniTitle.textContent = product.title;
    }"""

new_breadcrumb_js = """    // Populate Breadcrumbs dynamically with full hierarchy
    const bcContainer = document.getElementById('dynamicBreadcrumbs');
    if (bcContainer) {
      let parts = [];
      parts.push(`
        <a href="index.html" style="color: #64748b; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 500;">
          <svg fill="none" height="13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24" width="13" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Główna
        </a>
      `);
      parts.push(`<span style="color: #cbd5e1;">/</span>`);
      parts.push(`<a href="shop.html" style="color: #64748b; text-decoration: none; font-weight: 500;">Sklep</a>`);

      // Parse original category or category path (e.g. "Taśmy LED/Taśmy LED średnia jasność")
      const catPath = product.original_category || product.category || "";
      if (catPath) {
        const segments = catPath.split('/').map(s => s.trim()).filter(Boolean);
        segments.forEach(seg => {
          parts.push(`<span style="color: #cbd5e1;">/</span>`);
          parts.push(`<a href="shop.html?category=${encodeURIComponent(product.category)}" style="color: #64748b; text-decoration: none; font-weight: 500;">${seg}</a>`);
        });
      }

      parts.push(`<span style="color: #cbd5e1;">/</span>`);
      parts.push(`<span style="color: #0b1a30; font-weight: 700;">${product.title}</span>`);

      bcContainer.innerHTML = parts.join(' ');
    }"""

content = content.replace(old_breadcrumb_js, new_breadcrumb_js)

with open(product_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated product.html breadcrumb logic.")
