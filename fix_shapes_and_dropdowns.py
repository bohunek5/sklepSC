import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# CSS styles to inject globally before </style> or </head>
# 1. Menu buttons less rounded
# 2. Icons perfectly round and no square background
# 3. Dropdown bridge to prevent disappearing
# 4. Main buttons slightly rounded instead of fully rounded
css_fixes = """
    /* --- LATEST FIXES --- */
    /* Menu buttons less rounded */
    .mockup-nav ul li a {
      border-radius: 6px !important;
    }
    
    /* Make top action icons perfectly round */
    .mockup-action-icon {
      border-radius: 50% !important;
      background: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      width: 44px !important;
      height: 44px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .mockup-header.scrolled .mockup-action-icon {
      background: rgba(0, 0, 0, 0.05) !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
    }

    /* Keep search bar input in header rounded but not the icons */
    .mockup-search-container input {
      border-radius: 20px !important;
    }
    .mockup-search-container button {
      border-radius: 50% !important;
    }

    /* Main buttons not too rounded (reverting the 30px pill shape to a nice soft rectangle) */
    .mockup-btn, 
    .add-to-cart-btn, 
    .checkout-btn, 
    .submit-order-btn,
    .qv-add-cart-btn,
    .glass-banner-btn {
      border-radius: 8px !important;
    }

    /* Ensure circles (scroll down, slider arrows) stay perfectly round */
    .scroll-down-circle, .slider-arrow {
      border-radius: 50% !important;
    }

    /* Bridge to prevent dropdown from disappearing too fast */
    .magic-dropdown::after {
      content: '';
      position: absolute;
      top: -30px;
      left: 0;
      right: 0;
      height: 30px;
      background: transparent;
    }
    
    /* Dropdown width adjustment after removing a column */
    .magic-dropdown {
      min-width: 600px !important; /* Made it smaller since we removed a column */
      grid-template-columns: repeat(3, 1fr) !important; /* Was 4, now 3 */
    }
    /* --- END LATEST FIXES --- */
"""

szukaj_pattern = re.compile(r'<!-- Column 1: SZUKAJ -->.*?</div>\s*<!-- Column 2: KATEGORIE -->', re.DOTALL)
shop_filter_pattern = re.compile(r'<!-- Search widget -->.*?<h3 class="filter-title">Szukaj</h3>.*?<input type="text"[^>]+id="shopSearchInput"[^>]*>.*?</div>', re.DOTALL)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject CSS
    # First, let's remove previous fix_shapes.py block if it's there to avoid conflict
    content = re.sub(r'/\* --- NEW SHAPE OVERRIDES ---\*/.*?/\* --- END SHAPE OVERRIDES ---\*/', '', content, flags=re.DOTALL)
    
    # Inject new CSS fixes
    if '</style>' in content:
        content = content.replace('</style>', css_fixes + '\n</style>', 1)
    else:
        content = content.replace('</head>', '<style>' + css_fixes + '</style>\n</head>', 1)

    # 2. Remove "SZUKAJ" column from mega dropdown
    if '<!-- Column 1: SZUKAJ -->' in content:
        content = szukaj_pattern.sub('<!-- Column 2: KATEGORIE -->', content)

    # 3. Remove "SZUKAJ" from shop filters
    if 'shopSearchInput' in content:
        content = shop_filter_pattern.sub('<!-- Search widget removed -->', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated shapes, removed mega-menu search, added dropdown hover bridge, and removed shop filters search.")
