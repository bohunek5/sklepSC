import re
import os

print("Updating shop.html for improved filters, pagination, hero titles, and PLN prices...")

shop_path = os.path.join("shop.html")
with open(shop_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update pagination CSS
old_pagination_css = """    /* Pagination */
    .pagination-container {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 50px;
    }

    .pagination-btn {
      padding: 10px 18px;
      border: 1px solid #ddd;
      background: var(--white);
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      transition: var(--transition);
      border-radius: 4px;
    }

    .pagination-btn:hover, .pagination-btn.active {
      background: var(--primary-color);
      color: var(--white);
      border-color: var(--primary-color);
    }"""

new_pagination_css = """    /* Ultra-sleek Compact Centered Pagination */
    .pagination-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 45px 0 25px 0;
    }

    .pagination-container {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 99px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      max-width: 95%;
    }

    .pagination-btn {
      min-width: 36px;
      height: 36px;
      padding: 0 10px;
      border-radius: 50px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #1e293b;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    }

    .pagination-btn:hover {
      background: var(--primary-color, #0b1a30);
      color: #ffffff;
      border-color: var(--primary-color, #0b1a30);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(11, 26, 48, 0.2);
    }

    .pagination-btn.active {
      background: var(--primary-color, #0b1a30);
      color: #ffffff;
      border-color: var(--primary-color, #0b1a30);
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(11, 26, 48, 0.25);
    }

    .pagination-ellipsis {
      padding: 0 6px;
      color: #94a3b8;
      font-weight: 700;
      font-size: 14px;
    }"""

if old_pagination_css in content:
    content = content.replace(old_pagination_css, new_pagination_css)
else:
    print("Warning: old_pagination_css not matched exactly, replacing via regex if needed.")

# 2. Replace Price filter list ($$ -> zł)
old_price_widget = """        <div class="filter-widget">
          <h3 class="filter-title">Cena</h3>
          <ul class="filter-list" id="priceRangesList">
            <li class="active" data-range="all">Wszystkie ceny</li>
            <li data-range="0-50">$0.00 - $50.00</li>
            <li data-range="50-100">$50.00 - $100.00</li>
            <li data-range="100+">$100.00+</li>
          </ul>
        </div>"""

new_price_widget = """        <div class="filter-widget">
          <h3 class="filter-title">Cena (PLN)</h3>
          <ul class="filter-list" id="priceRangesList">
            <li class="active" data-range="all">Wszystkie ceny</li>
            <li data-range="0-50">0 zł - 50 zł</li>
            <li data-range="50-100">50 zł - 100 zł</li>
            <li data-range="100-250">100 zł - 250 zł</li>
            <li data-range="250+">Ponad 250 zł</li>
          </ul>
        </div>

        <!-- Nowe Filtry Specyfikacji LED -->
        <div class="filter-widget">
          <h3 class="filter-title">Napięcie zasilania</h3>
          <ul class="filter-list" id="voltageFilterList">
            <li class="active" data-voltage="all">Wszystkie napięcia</li>
            <li data-voltage="12V">12V DC</li>
            <li data-voltage="24V">24V DC</li>
            <li data-voltage="230V">230V AC</li>
          </ul>
        </div>

        <div class="filter-widget">
          <h3 class="filter-title">Barwa światła</h3>
          <ul class="filter-list" id="colorTempFilterList">
            <li class="active" data-colortemp="all">Wszystkie barwy</li>
            <li data-colortemp="ciepła">Ciepła (3000K)</li>
            <li data-colortemp="neutralna">Neutralna (4000K)</li>
            <li data-colortemp="zimna">Zimna (6500K)</li>
            <li data-colortemp="rgb">RGB / CCT / Multikolor</li>
          </ul>
        </div>

        <div class="filter-widget">
          <h3 class="filter-title">Jasność / Strumień (lm/m)</h3>
          <ul class="filter-list" id="lumensFilterList">
            <li class="active" data-lumens="all">Wszystkie poziomy</li>
            <li data-lumens="low">Do 600 lm/m (Niska)</li>
            <li data-lumens="mid">600 - 1000 lm/m (Średnia)</li>
            <li data-lumens="high">Powyżej 1000 lm/m (Wysoka)</li>
          </ul>
        </div>

        <div class="filter-widget">
          <h3 class="filter-title">Klasa szczelności IP</h3>
          <ul class="filter-list" id="ipFilterList">
            <li class="active" data-ip="all">Wszystkie stopnie</li>
            <li data-ip="IP20">IP20 (Wewnętrzne)</li>
            <li data-ip="IP65+">IP63 / IP65 / IP67 (Wodoodporne)</li>
          </ul>
        </div>"""

content = content.replace(old_price_widget, new_price_widget)

# Wrap shopPagination in a wrapper for perfect centering
old_pagination_html = """        <div class="pagination-container" id="shopPagination" role="navigation" aria-label="Stronicowanie produktów">
          <!-- Pagination controls render dynamically -->
        </div>"""

new_pagination_html = """        <div class="pagination-wrapper">
          <div class="pagination-container" id="shopPagination" role="navigation" aria-label="Stronicowanie produktów">
            <!-- Pagination controls render dynamically -->
          </div>
        </div>"""

content = content.replace(old_pagination_html, new_pagination_html)

with open(shop_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated shop.html HTML & CSS.")
