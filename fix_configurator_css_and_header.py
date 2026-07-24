import re

print("Fixing configurator.html head CSS imports, header layout, and removing loading overlay...")

with open("configurator.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Ensure essential CSS files are imported in <head>
css_imports = """  <!-- Theme & Header CSS -->
  <link rel="stylesheet" href="assets/xo-webcomponents.min.css">
  <link rel="stylesheet" href="assets/main.min.css">
  <link rel="stylesheet" href="header_style.css">
  <link rel="stylesheet" href="css/prescot-responsive.css">
  <link rel="stylesheet" href="css/configurator.css">
"""

# Replace existing css links in head
html = re.sub(r'<link rel="stylesheet" href="css/configurator\.css">', css_imports, html)
if "assets/main.min.css" not in html:
    html = html.replace("</head>", f"{css_imports}\n</head>")

# 2. Remove the loading overlay div from HTML entirely to prevent ANY spinning hang
html = re.sub(r'<div class="loading-overlay"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

# 3. Add explicit CSS rules for logo and nav flex layout in head
layout_fix_css = """<style id="configurator-layout-fix">
  /* Force exact header logo size & horizontal flex nav */
  .mockup-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 12px 4% !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1000 !important;
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
  }

  .mockup-header-logo,
  .mockup-header-logo a {
    display: flex !important;
    align-items: center !important;
    height: 40px !important;
  }

  .mockup-header-logo img,
  #headerLogo {
    height: 34px !important;
    width: auto !important;
    max-height: 38px !important;
    object-fit: contain !important;
    display: block !important;
  }

  .mockup-nav {
    display: flex !important;
    align-items: center !important;
  }

  .mockup-nav ul {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 8px !important;
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .mockup-nav ul li {
    display: inline-block !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .mockup-nav ul li a {
    display: inline-flex !important;
    align-items: center !important;
    padding: 8px 16px !important;
    border-radius: 99px !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #0b1a30 !important;
    text-decoration: none !important;
    background: rgba(11, 26, 48, 0.04) !important;
    border: 1px solid rgba(11, 26, 48, 0.08) !important;
    white-space: nowrap !important;
    transition: all 0.2s ease !important;
  }

  .mockup-nav ul li a:hover {
    background: rgba(11, 26, 48, 0.1) !important;
    color: #0b1a30 !important;
  }

  .mockup-nav ul li a.active {
    background: #0b1a30 !important;
    color: #ffffff !important;
    border: 1px solid #0b1a30 !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 14px rgba(11, 26, 48, 0.25) !important;
  }

  .mockup-actions {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
  }
</style>
"""

if "id=\"configurator-layout-fix\"" in html:
    html = re.sub(r'<style id="configurator-layout-fix">.*?</style>', layout_fix_css, html, flags=re.DOTALL)
elif "</head>" in html:
    html = html.replace("</head>", f"{layout_fix_css}\n</head>")

with open("configurator.html", "w", encoding="utf-8") as f:
    f.write(html)

print("configurator.html CSS imports, header layout, and loading overlay removed.")
