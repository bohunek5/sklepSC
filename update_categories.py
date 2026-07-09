import re

with open('index.html', 'r') as f:
    content = f.read()

# 1. Remove mockup-section-header
content = re.sub(r'<div class="mockup-section-header" style="text-align: center; margin-bottom: 40px;">.*?</div>\s*', '', content, flags=re.DOTALL)

# 2. Add 4 more categories to the grid
category_4 = r"""      <!-- Category 4: Wizualizacje 3D & 360 -->
      <a href="/shop.html" class="category-card" style="position: relative; overflow: hidden; border-radius: 16px; height: 280px; text-decoration: none; display: flex; align-items: flex-end; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
        <div class="category-bg" style="position: absolute; top:0; left:0; width:100%; height:100%; background-image: url('/images/products/product_8291636215978.jpg'); background-size: cover; background-position: center; transition: transform 0.6s ease;"></div>
        <div class="category-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);"></div>
        <div class="category-info" style="position: relative; z-index: 2;">
          <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin: 0 0 5px 0;">Wizualizacje 3D & 360</h3>
          <span style="color: rgba(255,255,255,0.7); font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">ZOBACZ DETALE →</span>
        </div>
      </a>"""

new_categories = category_4 + r"""
      
      <!-- Category 5: Akcesoria LED -->
      <a href="/shop.html?category=Akcesoria%20LED" class="category-card" style="position: relative; overflow: hidden; border-radius: 16px; height: 280px; text-decoration: none; display: flex; align-items: flex-end; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
        <div class="category-bg" style="position: absolute; top:0; left:0; width:100%; height:100%; background-image: url('/images/office-mock.webp'); background-size: cover; background-position: center; transition: transform 0.6s ease;"></div>
        <div class="category-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);"></div>
        <div class="category-info" style="position: relative; z-index: 2;">
          <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin: 0 0 5px 0;">Akcesoria LED</h3>
          <span style="color: rgba(255,255,255,0.7); font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">ZOBACZ PRODUKTY →</span>
        </div>
      </a>

      <!-- Category 6: Oprawy LED -->
      <a href="/shop.html?category=Oprawy%20LED" class="category-card" style="position: relative; overflow: hidden; border-radius: 16px; height: 280px; text-decoration: none; display: flex; align-items: flex-end; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
        <div class="category-bg" style="position: absolute; top:0; left:0; width:100%; height:100%; background-image: url('/images/products/tasma_mono.webp'); background-size: cover; background-position: center; transition: transform 0.6s ease;"></div>
        <div class="category-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);"></div>
        <div class="category-info" style="position: relative; z-index: 2;">
          <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin: 0 0 5px 0;">Oprawy LED</h3>
          <span style="color: rgba(255,255,255,0.7); font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">ZOBACZ PRODUKTY →</span>
        </div>
      </a>

      <!-- Category 7: Profile Aluminiowe -->
      <a href="/shop.html?category=Profile%20Aluminiowe" class="category-card" style="position: relative; overflow: hidden; border-radius: 16px; height: 280px; text-decoration: none; display: flex; align-items: flex-end; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
        <div class="category-bg" style="position: absolute; top:0; left:0; width:100%; height:100%; background-image: url('/images/AdobeStock_288132271.webp'); background-size: cover; background-position: center; transition: transform 0.6s ease;"></div>
        <div class="category-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);"></div>
        <div class="category-info" style="position: relative; z-index: 2;">
          <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin: 0 0 5px 0;">Profile Aluminiowe</h3>
          <span style="color: rgba(255,255,255,0.7); font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">ZOBACZ PRODUKTY →</span>
        </div>
      </a>

      <!-- Category 8: Kable i złączki -->
      <a href="/shop.html?category=Kable%20i%20z%C5%82%C4%85czki" class="category-card" style="position: relative; overflow: hidden; border-radius: 16px; height: 280px; text-decoration: none; display: flex; align-items: flex-end; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);">
        <div class="category-bg" style="position: absolute; top:0; left:0; width:100%; height:100%; background-image: url('/images/tlo2.webp'); background-size: cover; background-position: center; transition: transform 0.6s ease;"></div>
        <div class="category-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);"></div>
        <div class="category-info" style="position: relative; z-index: 2;">
          <h3 style="color: #fff; font-size: 18px; font-weight: 700; margin: 0 0 5px 0;">Kable i złączki</h3>
          <span style="color: rgba(255,255,255,0.7); font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">ZOBACZ PRODUKTY →</span>
        </div>
      </a>"""

content = content.replace(category_4, new_categories)

# 3. Translate "TOP SELLING ITEMS"
content = content.replace('TOP SELLING ITEMS', 'NAJLEPIEJ SPRZEDAJĄCE SIĘ')
content = content.replace('Top Selling Item', 'Bestseller')

# 4. Modify dropdown menu CSS for Apple style
dropdown_css = """
    /* Apple style dropdown */
    .mockup-nav .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 200px;
      padding: 8px 0;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px) scale(0.95);
      transform-origin: top left;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 100;
    }
    .mockup-nav .has-dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(10px) scale(1);
    }
    .mockup-nav .dropdown-menu li {
      list-style: none;
    }
    .mockup-nav .dropdown-menu a {
      color: var(--primary-color) !important;
      padding: 10px 20px;
      display: block;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s, color 0.2s;
    }
    .mockup-nav .dropdown-menu a:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--accent-color) !important;
    }
"""

# Let's insert the dropdown CSS just before the end of </style>
content = re.sub(r'</style>', dropdown_css + '\n  </style>', content)

with open('index.html', 'w') as f:
    f.write(content)
