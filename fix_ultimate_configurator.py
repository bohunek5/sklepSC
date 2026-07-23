import re

print("Applying ultimate fix for configurator.html header and catalog loading overlay...")

# 1. Fix css/configurator.css to ensure .loading-overlay[hidden] is display: none !important
with open("css/configurator.css", "r", encoding="utf-8") as f:
    css_content = f.read()

hidden_fix = """
.loading-overlay[hidden],
.loading-overlay.hidden,
#catalogLoading[hidden],
#catalogLoading.hidden {
  display: none !important;
}
"""

if ".loading-overlay[hidden]" not in css_content:
    css_content += "\n" + hidden_fix
    with open("css/configurator.css", "w", encoding="utf-8") as f:
        f.write(css_content)
    print("Fixed css/configurator.css for loading-overlay hidden rule.")

# 2. Extract exact header HTML from shop.html or index.html including mega menu
with open("shop.html", "r", encoding="utf-8") as f:
    shop_content = f.read()

# Extract header from shop.html
header_match = re.search(r'(<header class="mockup-header[^"]*"[^>]*>.*?</header>)', shop_content, re.DOTALL)
header_html = header_match.group(1) if header_match else ""

# Modify header_html to set class="mockup-header scrolled force-scrolled"
header_html = re.sub(r'<header class="mockup-header[^"]*"', '<header class="mockup-header scrolled force-scrolled"', header_html)

# Ensure logo is logo-dark.png for light pages
header_html = re.sub(r'src="images/logo-white\.png"', 'src="images/logo-dark.png"', header_html)

# Adjust active menu link for configurator.html
header_html = re.sub(r'<a href="shop\.html"[^>]*>', '<a href="shop.html">', header_html)
header_html = re.sub(r'<a href="configurator\.html"[^>]*>', '<a href="configurator.html" class="active">', header_html)

# Read configurator.html
with open("configurator.html", "r", encoding="utf-8") as f:
    config_html = f.read()

# Replace header in configurator.html
config_html = re.sub(r'<header class="[^"]*"[^>]*>.*?</header>', header_html, config_html, flags=re.DOTALL)

# Add forced light page header CSS in configurator.html
header_override_css = """<style id="configurator-light-header-override">
  /* Force dark text & navy icons for header on light pages */
  body .mockup-header,
  body .mockup-header.scrolled {
    background: rgba(255, 255, 255, 0.98) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
  }

  body .mockup-header .mockup-nav > ul > li > a:not(.active),
  body .mockup-header.scrolled .mockup-nav > ul > li > a:not(.active) {
    color: #0b1a30 !important;
    background: rgba(11, 26, 48, 0.05) !important;
    border: 1px solid rgba(11, 26, 48, 0.08) !important;
    font-weight: 600 !important;
  }

  body .mockup-header .mockup-nav > ul > li > a:not(.active):hover,
  body .mockup-header.scrolled .mockup-nav > ul > li > a:not(.active):hover {
    background: rgba(11, 26, 48, 0.12) !important;
    color: #0b1a30 !important;
  }

  body .mockup-header .mockup-nav a.active,
  body .mockup-header.scrolled .mockup-nav a.active {
    background: #0b1a30 !important;
    color: #ffffff !important;
    border: 1px solid #0b1a30 !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 15px rgba(11, 26, 48, 0.25) !important;
  }

  body .mockup-header .mockup-action-icon,
  body .mockup-header.scrolled .mockup-action-icon {
    color: #0b1a30 !important;
    background: rgba(11, 26, 48, 0.05) !important;
    border: 1px solid rgba(11, 26, 48, 0.1) !important;
  }

  body .mockup-header .mockup-search-container input {
    color: #0b1a30 !important;
    border-color: rgba(11, 26, 48, 0.2) !important;
  }

  body .mockup-header .mockup-search-container button svg {
    stroke: #0b1a30 !important;
  }

  .loading-overlay[hidden],
  #catalogLoading[hidden] {
    display: none !important;
  }
</style>
"""

if "id=\"configurator-light-header-override\"" in config_html:
    config_html = re.sub(r'<style id="configurator-light-header-override">.*?</style>', header_override_css, config_html, flags=re.DOTALL)
elif "</head>" in config_html:
    config_html = config_html.replace("</head>", f"{header_override_css}\n</head>")

with open("configurator.html", "w", encoding="utf-8") as f:
    f.write(config_html)

print("configurator.html light header and loading overlay fix completed.")
