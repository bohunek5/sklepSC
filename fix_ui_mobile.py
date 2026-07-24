import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll inject new CSS fixes right before </style> or </head>
css_fixes = """
    /* --- MOBILE UI FIXES --- */
    /* 1. Unify search bar: show header search on mobile */
    @media (max-width: 1024px) {
      /* Override the previous display: none */
      .mockup-search-container {
        display: flex !important;
        width: auto !important;
        margin: 0 10px !important;
        flex: 1 !important;
      }
      .mockup-search-container input {
        font-size: 13px !important;
        padding: 8px 12px !important;
        width: 100% !important;
      }
      .mockup-search-container button {
        right: 4px !important;
        width: 28px !important;
        height: 28px !important;
      }
      /* Adjust header items to fit search */
      .mockup-header-logo img {
        height: 22px !important; /* Slightly smaller logo to fit search */
      }
      .mockup-actions {
        gap: 8px !important;
        flex: 1 !important;
        justify-content: flex-end !important;
      }
      /* Hide some icons if needed to make space for search, or just make them smaller */
      .mockup-action-icon {
        width: 34px !important;
        height: 34px !important;
      }
      .mockup-action-icon svg {
        width: 16px !important;
        height: 16px !important;
      }
      /* Smaller text on categories for mobile */
      .mockup-category-card h3, .glass-cat-title {
        font-size: 12px !important;
      }
      .mockup-category-card p, .glass-cat-subtitle {
        font-size: 10px !important;
      }
    }

    /* 2. Buy Now / Add to Cart smaller font */
    .add-to-cart-btn, .buy-it-now-btn, .mockup-btn {
      font-size: 12px !important;
      padding: 8px 16px !important;
    }

    /* 3. Category Images Clearer (less dark overlay) */
    .mockup-category-card::after {
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 60%) !important;
    }
    .mockup-category-card img {
      opacity: 1 !important;
      filter: brightness(0.9) !important;
    }
    .mockup-category-card:hover img {
      filter: brightness(1.1) !important;
    }
    
    /* FAQ Section Styles */
    .faq-section {
      padding: 80px 5%;
      background: #fdfdfd;
    }
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .faq-item {
      background: #fff;
      border: 1px solid #eee;
      border-radius: 12px;
      margin-bottom: 15px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      transition: all 0.3s ease;
    }
    .faq-item:hover {
      border-color: var(--primary-color);
      box-shadow: 0 8px 25px rgba(0,0,0,0.05);
    }
    .faq-question {
      padding: 20px 25px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-family: 'Outfit', sans-serif;
      color: var(--primary-color);
      font-size: 16px;
    }
    .faq-answer {
      padding: 0 25px;
      max-height: 0;
      overflow: hidden;
      transition: all 0.4s ease;
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }
    .faq-item.active .faq-answer {
      padding: 0 25px 25px;
      max-height: 500px;
    }
    .faq-icon {
      transition: transform 0.3s ease;
    }
    .faq-item.active .faq-icon {
      transform: rotate(180deg);
    }
    /* --- END MOBILE UI FIXES --- */
"""

faq_html = """
  <!-- Premium FAQ Section -->
  <section class="faq-section">
    <div class="mockup-section-header" style="text-align: center; margin-bottom: 50px;">
      <span style="color: var(--accent-color); font-weight: 700; font-size: 12px; letter-spacing: 2px;">MASZ PYTANIA?</span>
      <h2 class="mockup-section-title" style="margin-top: 10px;">Najczęściej zadawane pytania (FAQ)</h2>
    </div>
    <div class="faq-container">
      <div class="faq-item" onclick="this.classList.toggle('active')">
        <div class="faq-question">
          Jakie oświetlenie LED wybrać do salonu?
          <i class="ph ph-caret-down faq-icon"></i>
        </div>
        <div class="faq-answer">
          Do salonu polecamy taśmy LED COB o ciepłej (3000K) lub neutralnej (4000K) barwie, które tworzą przytulną atmosferę. Warto również zastosować sterowniki Wi-Fi, by móc płynnie regulować natężenie światła zależnie od nastroju.
        </div>
      </div>
      <div class="faq-item" onclick="this.classList.toggle('active')">
        <div class="faq-question">
          Ile lat gwarancji posiadają Wasze produkty?
          <i class="ph ph-caret-down faq-icon"></i>
        </div>
        <div class="faq-answer">
          Nasze profesjonalne taśmy LED objęte są gwarancją na 5 lub nawet 7 lat. Zasilacze i sterowniki posiadają zazwyczaj od 3 do 5 lat gwarancji producenta, co zapewnia Ci absolutny spokój i bezpieczeństwo inwestycji.
        </div>
      </div>
      <div class="faq-item" onclick="this.classList.toggle('active')">
        <div class="faq-question">
          Czy oferujecie pomoc w doborze sprzętu?
          <i class="ph ph-caret-down faq-icon"></i>
        </div>
        <div class="faq-answer">
          Oczywiście! Nasi specjaliści pomogą Ci dobrać odpowiedni zasilacz, sterownik i rodzaj taśmy do Twojego konkretnego projektu. Skontaktuj się z nami poprzez formularz lub zadzwoń.
        </div>
      </div>
    </div>
  </section>
"""

# Regexes for removals
mobile_search_pill_pattern = re.compile(r'<div class="mobile-search-pill">.*?</div>\s*', re.DOTALL)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject CSS
    if '</style>' in content:
        content = content.replace('</style>', css_fixes + '\n</style>', 1)
    else:
        content = content.replace('</head>', '<style>' + css_fixes + '</style>\n</head>', 1)

    # 2. Add FAQ to index.html before blog section or footer
    if file == 'index.html':
        if '<!-- Latest Blog Articles Section -->' in content:
            content = content.replace('<!-- Latest Blog Articles Section -->', faq_html + '\n  <!-- Latest Blog Articles Section -->')
        elif '</main>' in content:
            content = content.replace('</main>', faq_html + '\n</main>')

    # 3. Fix shop.html mobile search and filter toggle
    if file == 'shop.html':
        # Remove mobile search pill from shop.html so it only relies on the header one
        content = mobile_search_pill_pattern.sub('', content)
        # Verify the shop filter script has no issues - actually, shopSidebar requires 'active' class. Let's make sure it works!
        # Mobile filters script is at the end, let's inject a robust fix for the filter toggle just in case
        robust_filter_js = """
    // Robust mobile filter toggle
    const mFilterBtn = document.getElementById('mobileFiltersBtn');
    if (mFilterBtn) {
      mFilterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const sidebar = document.getElementById('shopSidebar');
        if (sidebar) {
          sidebar.classList.toggle('active');
        }
      });
    }
"""
        if 'const mobileFiltersBtn = document.getElementById' in content:
            # We'll just append our robust JS to the end of the script tag to ensure it binds correctly
            content = content.replace('</script>\n</body>', robust_filter_js + '\n</script>\n</body>')


    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Mobile UI tweaks completed, search unified, FAQ added, category text reduced, category images clearer.")
