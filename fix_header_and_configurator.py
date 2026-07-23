import glob
import re

print("Applying configurator loading fix, removing orange CTA button, and unifying header navigation...")

# 1. Update js/configurator.js with robust loadCatalog
with open("js/configurator.js", "r", encoding="utf-8") as f:
    js_code = f.read()

robust_load_catalog = """  function hideLoadingOverlay() {
    const loadingEl = document.getElementById('catalogLoading');
    if (loadingEl) loadingEl.hidden = true;
    const loaderContainer = document.querySelector('.loading-overlay');
    if (loaderContainer) loaderContainer.style.display = 'none';
  }

  async function loadCatalog() {
    if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
      catalog = products;
    } else if (typeof getProducts === 'function') {
      catalog = getProducts();
    } else if (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) {
      catalog = defaultProducts;
    }

    try {
      const response = await fetch('js/prescot-imported-products.json', { cache: 'no-store' });
      if (response.ok) {
        const importedData = await response.json();
        if (Array.isArray(importedData) && importedData.length > 0) {
          catalog = importedData;
        }
      }
    } catch (error) {
      // Fallback to existing catalog
    }

    if (!catalog || !catalog.length) {
      if (typeof products !== 'undefined' && Array.isArray(products)) catalog = products;
    }

    if (catalog && catalog.length) {
      tapes = catalog.filter(isTape).map(normalizeTape).filter(hasRequiredTapeData);
      if (!tapes.length) {
        tapes = catalog.filter(isTape).map(normalizeTape);
      }
    }

    hideLoadingOverlay();
    updateCartBadge();
    updateLengthTip();
    renderStep();
  }"""

js_code = re.sub(r'async function loadCatalog\(\)\s*\{.*?\}\s*updateHeader\(\);', robust_load_catalog + "\n\n  updateHeader();", js_code, flags=re.DOTALL)

with open("js/configurator.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("Updated js/configurator.js loadCatalog logic.")

# 2. Update Header CSS across HTML files to remove orange CTA button & enforce clean navy header styling
nav_clean_css = """<style id="custom-nav-configurator-cta-style">
  /* Clean Unified Header Navigation */
  body .mockup-header .mockup-nav ul li a,
  body .mockup-header.scrolled .mockup-nav ul li a {
    text-decoration: none !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #0b1a30 !important;
    padding: 8px 18px !important;
    border-radius: 99px !important;
    transition: all 0.2s ease !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
  }

  body .mockup-header .mockup-nav ul li a:hover,
  body .mockup-header.scrolled .mockup-nav ul li a:hover {
    background: rgba(11, 26, 48, 0.08) !important;
    color: #0b1a30 !important;
  }

  body .mockup-header .mockup-nav ul li a.active,
  body .mockup-header.scrolled .mockup-nav ul li a.active {
    background: #0b1a30 !important;
    color: #ffffff !important;
    border: 1px solid #0b1a30 !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 14px rgba(11, 26, 48, 0.2) !important;
  }

  /* Scrolled Header Styling - Crisp Navy Elements */
  body .mockup-header.scrolled {
    background: rgba(255, 255, 255, 0.96) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
  }

  body .mockup-header.scrolled .mockup-action-icon,
  body .mockup-header .mockup-action-icon {
    color: #0b1a30 !important;
    border-color: rgba(11, 26, 48, 0.15) !important;
  }

  /* Footer White Logo Styling */
  footer .footer-logo img,
  .mockup-footer .footer-logo img {
    height: 32px !important;
    opacity: 1 !important;
    filter: none !important;
  }
</style>
"""

def generate_clean_nav(current_page):
    links = [
        ('index.html', 'Home'),
        ('shop.html', 'Sklep'),
        ('configurator.html', 'Dobierz Sam'),
        ('blog.html', 'Blog'),
        ('about.html', 'O nas'),
        ('contact.html', 'Kontakt')
    ]
    items = []
    for href, text in links:
        active_cls = ' class="active"' if href == current_page else ''
        items.append(f'<li><a href="{href}"{active_cls}>{text}</a></li>')
    return '<ul>\n' + '\n'.join(items) + '\n</ul>'

html_files = [f for f in glob.glob("*.html") if f not in ["old_index.html", "index_58efa07.html"]]

for fpath in html_files:
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Update style block
    if "id=\"custom-nav-configurator-cta-style\"" in content:
        content = re.sub(r'<style id="custom-nav-configurator-cta-style">.*?</style>', nav_clean_css, content, flags=re.DOTALL)
    elif "</head>" in content:
        content = content.replace("</head>", f"{nav_clean_css}\n</head>")

    # Update nav html
    clean_nav = generate_clean_nav(fpath)
    content = re.sub(r'<nav class="mockup-nav">\s*<ul>.*?</ul>\s*</nav>', f'<nav class="mockup-nav">\n{clean_nav}\n</nav>', content, flags=re.DOTALL)
    content = re.sub(r'<div class="mobile-menu" id="mobileMenu">\s*<ul>.*?</ul>', f'<div class="mobile-menu" id="mobileMenu">\n{clean_nav}', content, flags=re.DOTALL)

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print("Clean navigation applied across all HTML files successfully.")
