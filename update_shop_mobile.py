import re

with open("shop.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inject mobile toolbar HTML
mobile_toolbar_html = """
    <!-- Mobile specific toolbar imitating Envato screenshot -->
    <div class="mobile-shop-toolbar-v2">
      <div class="mobile-search-pill">
        <div class="search-icon"><i class="ph ph-magnifying-glass"></i></div>
        <input type="text" id="mobileSearchInput" placeholder="Szukaj">
        <button class="clear-btn" id="mobileSearchClear"><i class="ph ph-x"></i></button>
        <button class="search-action-btn" id="mobileSearchAction"><i class="ph ph-magnifying-glass"></i></button>
      </div>
      
      <div class="mobile-filter-row">
        <button class="mobile-filter-pill" id="mobileFiltersBtn">
          <i class="ph ph-sliders"></i> Filtry <i class="ph ph-caret-down"></i>
        </button>
        <button class="mobile-filter-pill" id="mobileCategoryBtn">
          Kategoria <i class="ph ph-caret-down"></i>
        </button>
        <button class="mobile-filter-pill" id="mobileSortBtn">
          Sortuj <i class="ph ph-caret-down"></i>
        </button>
      </div>
    </div>
"""

content = content.replace('<!-- Toolbar on top -->', mobile_toolbar_html + '\n    <!-- Toolbar on top -->')

# 2. Inject CSS
mobile_css = """
    /* --- NEW MOBILE SHOP UI --- */
    .mobile-shop-toolbar-v2 {
      display: none;
    }
    
    @media (max-width: 768px) {
      .shop-toolbar {
        display: none !important;
      }
      
      .shop-container {
        padding: 10px 5%;
        background: #0b1a30; /* Dark background for mobile shop */
        color: #fff;
      }
      
      .mobile-shop-toolbar-v2 {
        display: block;
        background: #112240;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 1px solid rgba(255,255,255,0.05);
      }

      .mobile-search-pill {
        display: flex;
        align-items: center;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 40px;
        padding: 5px 5px 5px 15px;
        margin-bottom: 15px;
      }
      .mobile-search-pill .search-icon {
        color: #aaa;
        font-size: 18px;
        margin-right: 10px;
      }
      .mobile-search-pill input {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        padding: 10px 0;
        font-size: 16px;
        outline: none;
      }
      .mobile-search-pill input::placeholder { color: #888; }
      .mobile-search-pill .clear-btn {
        background: transparent; border: none; color: #aaa; cursor: pointer; padding: 0 10px; font-size: 18px;
      }
      .mobile-search-pill .search-action-btn {
        background: var(--accent-color);
        color: #fff;
        border: none;
        width: 40px; height: 40px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        font-size: 18px;
      }

      .mobile-filter-row {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 5px;
      }
      .mobile-filter-row::-webkit-scrollbar { display: none; }
      
      .mobile-filter-pill {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #ddd;
        padding: 10px 18px;
        border-radius: 30px;
        font-size: 13px;
        display: flex; align-items: center; gap: 8px;
        white-space: nowrap;
        cursor: pointer;
        font-family: inherit;
      }
      .mobile-filter-pill:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }

      /* Dark mode overrides for the mobile sidebar / filters */
      .shop-sidebar.active {
        background: #112240;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 1px solid rgba(255,255,255,0.05);
      }
      .shop-sidebar.active .filter-title {
        color: #fff;
      }
      .shop-sidebar.active .filter-list li {
        color: #bbb;
      }
      .shop-sidebar.active .filter-list li:hover, .shop-sidebar.active .filter-list li.active {
        color: var(--accent-color);
      }

      /* Make cards match screenshot */
      .mockup-product-card {
        background: #112240;
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 16px;
      }
      .mockup-product-info {
        color: #fff;
        padding: 20px 15px;
      }
      .mockup-product-title a {
        color: #fff;
        font-size: 16px;
      }
      .mockup-product-title a:hover {
        color: var(--accent-color);
      }
      .mockup-product-price {
        color: var(--accent-color);
      }
      .mockup-product-category {
        color: #888;
      }
      .mockup-product-media {
        height: 250px;
      }
      /* Floating Actions like screenshot */
      .product-actions-hover {
        position: absolute;
        bottom: 15px;
        right: 15px;
        left: auto;
        transform: none !important;
        opacity: 1 !important;
        flex-direction: column;
        gap: 12px;
        z-index: 20;
      }
      .action-btn-circle {
        background: rgba(0,0,0,0.5);
        color: #fff;
        backdrop-filter: blur(8px);
        width: 44px; height: 44px;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .action-btn-circle:hover {
        background: var(--accent-color);
        border-color: var(--accent-color);
      }
      
      /* Reset page backgrounds slightly for blending */
      body {
        background: #0b1a30;
      }
      .page-hero {
        margin-bottom: 0 !important; /* blend seamlessly */
      }
    }
"""

if "/* --- NEW MOBILE SHOP UI --- */" not in content:
    content = content.replace('</style>', mobile_css + '\n  </style>')

# 3. Inject JS logic for mobile search and buttons
mobile_js = """
    // Mobile specific logic
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchClear = document.getElementById('mobileSearchClear');
    const mobileSearchAction = document.getElementById('mobileSearchAction');
    const mobileFiltersBtn = document.getElementById('mobileFiltersBtn');
    
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          currentSearch = mobileSearchInput.value.trim().toLowerCase();
          currentPage = 1;
          renderFilteredProducts();
        }
      });
      mobileSearchInput.addEventListener('input', () => {
         if(mobileSearchInput.value) {
            mobileSearchClear.style.display = 'block';
         } else {
            mobileSearchClear.style.display = 'none';
         }
      });
    }
    if (mobileSearchClear) {
      mobileSearchClear.style.display = 'none';
      mobileSearchClear.addEventListener('click', () => {
        mobileSearchInput.value = '';
        mobileSearchClear.style.display = 'none';
        currentSearch = '';
        currentPage = 1;
        renderFilteredProducts();
      });
    }
    if (mobileSearchAction) {
      mobileSearchAction.addEventListener('click', () => {
        currentSearch = mobileSearchInput.value.trim().toLowerCase();
        currentPage = 1;
        renderFilteredProducts();
      });
    }
    if (mobileFiltersBtn) {
      mobileFiltersBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('shopSidebar');
        if (sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
        } else {
          sidebar.classList.add('active');
        }
      });
    }
"""

if "// Mobile specific logic" not in content:
    content = content.replace('buildCategoriesFilter();', mobile_js + '\n    buildCategoriesFilter();')


with open("shop.html", "w", encoding="utf-8") as f:
    f.write(content)
