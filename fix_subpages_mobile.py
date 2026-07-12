import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

subpages_search_css = """
    /* Search Bar Subpage Colors & Mobile Shape */
    .mockup-search-container input {
      color: #0b1a30 !important;
    }
    .mockup-search-container input::placeholder {
      color: rgba(11, 26, 48, 0.6) !important;
    }
    .mockup-search-container button svg {
      stroke: #0b1a30 !important;
    }

    @media (max-width: 1024px) {
      .mockup-search-container {
        height: 36px !important;
        border-radius: 18px !important;
        background: rgba(0,0,0,0.05) !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
        padding: 0 10px !important;
      }
      .mockup-search-container input {
        height: 100% !important;
        padding: 0 8px !important;
      }
      .mockup-search-container button {
        height: 26px !important;
        width: 26px !important;
        right: 5px !important;
        background: #0b1a30 !important;
        border-radius: 50% !important;
      }
      .mockup-search-container button svg {
        stroke: #ffffff !important; /* white icon inside the dark button */
      }
    }
"""

index_search_css = """
    /* Mobile Search Bar Shape - Index */
    @media (max-width: 1024px) {
      .mockup-search-container {
        height: 36px !important;
        border-radius: 18px !important;
        background: rgba(255,255,255,0.15) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        padding: 0 10px !important;
      }
      .mockup-header.scrolled .mockup-search-container {
        background: rgba(0,0,0,0.05) !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
      }
      .mockup-search-container input {
        height: 100% !important;
        padding: 0 8px !important;
      }
      .mockup-search-container button {
        height: 26px !important;
        width: 26px !important;
        right: 5px !important;
        background: var(--primary-color) !important;
        border-radius: 50% !important;
      }
      .mockup-search-container button svg {
        stroke: #ffffff !important;
      }
    }
"""

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    css_to_inject = index_search_css if file == 'index.html' else subpages_search_css

    if '</style>' in content:
        content = content.replace('</style>', css_to_inject + '\n</style>', 1)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix JS drawer so it doesn't cover bottom menu
with open('js/shared-popups.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Drawer bottom from 0 to 65px (the height of mobile-bottom-nav)
js_content = js_content.replace('bottom: 0; background: rgba(255, 255, 255, 0.95)', 'bottom: 65px; background: rgba(255, 255, 255, 0.95)')

with open('js/shared-popups.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Subpage search colors fixed, mobile search shaped as an elongated button, bottom menu visible below categories drawer.")
