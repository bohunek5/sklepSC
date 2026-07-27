import os
import re

def inject_advanced_filters():
    with open('shop.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find prescot-glass-hub
    start_str = '<div class="prescot-glass-hub" id="prescotGlassHub">'
    end_str = '<!-- End Prescot Glass Hub -->'
    
    # If the end comment doesn't exist, we will use regex to find the end of prescot-glass-hub.
    # It's better to just replace the whole section from <main class="shop-container"> 
    # to <div class="shop-main-layout">
    
    start_idx = content.find('<main class="shop-container">')
    end_idx = content.find('<div class="shop-main-layout">')
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find targets in shop.html")
        return
        
    start_idx += len('<main class="shop-container">')
    
    NEW_HTML = """
    <!-- === ADVANCED FILTERS UI (B2B/B2C) === -->
    
    <!-- Mobile FAB -->
    <button id="mobileFabFilterBtn" class="mobile-fab-filter">
      <i class="ph ph-faders"></i> Filtruj i Sortuj <span id="fabFilterCount">(0)</span>
    </button>
    
    <!-- Backdrop for mobile sheet -->
    <div id="filterBackdrop" class="filter-backdrop"></div>
    
    <!-- Filter Container (Sidebar on Desktop, Bottom Sheet on Mobile) -->
    <div id="advancedFilterContainer" class="advanced-filter-container">
      <div class="filter-sheet-header">
        <h3>Filtry i kategorie</h3>
        <button id="closeFilterSheetBtn" class="close-sheet-btn"><i class="ph ph-x"></i></button>
      </div>
      
      <!-- B2C / B2B Toggle -->
      <div class="filter-toggle-wrapper">
        <div class="pro-toggle-switch" id="proToggleSwitch">
          <div class="toggle-slider"></div>
          <button class="toggle-btn active" data-mode="b2c">🏠 Dla Domu</button>
          <button class="toggle-btn" data-mode="b2b">🛠️ Tryb PRO</button>
        </div>
      </div>
      
      <div class="filter-scroll-area">
        <!-- B2C Filters -->
        <div id="b2cFilters" class="filter-mode-section active">
          <div class="filter-group">
            <div class="filter-group-title">Gdzie montujesz?</div>
            <div class="horizontal-scroll-pills">
              <button class="filter-pill b2c-pill" data-type="room" data-val="Łazienka/Prysznic">Łazienka/Prysznic</button>
              <button class="filter-pill b2c-pill" data-type="room" data-val="Kuchnia pod szafki">Kuchnia pod szafki</button>
              <button class="filter-pill b2c-pill" data-type="room" data-val="Salon">Salon / Sufit</button>
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-title">Czego oczekujesz?</div>
            <div class="horizontal-scroll-pills">
              <button class="filter-pill b2c-pill" data-type="expect" data-val="Brak kropek">Brak kropek na taśmie (COB)</button>
              <button class="filter-pill b2c-pill" data-type="expect" data-val="Zmienne kolory">Zmienne kolory (RGB/CCT)</button>
              <button class="filter-pill b2c-pill" data-type="expect" data-val="Mocne światło">Mocne światło do pracy</button>
            </div>
          </div>
        </div>
        
        <!-- B2B Filters -->
        <div id="b2bFilters" class="filter-mode-section">
          <div class="filter-group">
            <div class="filter-group-title">Napięcie (V)</div>
            <div class="horizontal-scroll-pills">
              <button class="filter-pill b2b-pill" data-type="voltage" data-val="12V">12V</button>
              <button class="filter-pill b2b-pill" data-type="voltage" data-val="24V">24V</button>
              <button class="filter-pill b2b-pill" data-type="voltage" data-val="48V">48V</button>
              <button class="filter-pill b2b-pill" data-type="voltage" data-val="230V">230V</button>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-group-title">Barwa światła</div>
            <div class="horizontal-scroll-pills">
              <button class="color-swatch-btn b2b-pill" data-type="color" data-val="ciepła">
                <div class="swatch-circle" style="background: linear-gradient(135deg, #ffddaa, #ffb347);"></div>
                <span>Ciepła</span>
              </button>
              <button class="color-swatch-btn b2b-pill" data-type="color" data-val="neutralna">
                <div class="swatch-circle" style="background: #ffffff; border: 1px solid #ddd;"></div>
                <span>Neutralna</span>
              </button>
              <button class="color-swatch-btn b2b-pill" data-type="color" data-val="zimna">
                <div class="swatch-circle" style="background: linear-gradient(135deg, #e0f7fa, #80deea);"></div>
                <span>Zimna</span>
              </button>
              <button class="color-swatch-btn b2b-pill" data-type="color" data-val="rgb">
                <div class="swatch-circle" style="background: linear-gradient(135deg, #ff0000, #00ff00, #0000ff);"></div>
                <span>RGB/CCT</span>
              </button>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-group-title">Szerokość PCB (mm)</div>
            <div class="horizontal-scroll-pills">
              <button class="filter-pill b2b-pill" data-type="pcb" data-val="4mm">4 mm</button>
              <button class="filter-pill b2b-pill" data-type="pcb" data-val="8mm">8 mm</button>
              <button class="filter-pill b2b-pill" data-type="pcb" data-val="10mm">10 mm</button>
              <button class="filter-pill b2b-pill" data-type="pcb" data-val="12mm">12 mm</button>
            </div>
          </div>
        </div>
        
        <!-- Common Filters (Always visible) -->
        <div class="filter-group">
          <div class="filter-group-title">Kształt Profilu</div>
          <div class="horizontal-scroll-pills">
            <button class="svg-filter-btn filter-pill" data-type="profile" data-val="Wpuszczany">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M6 6v8a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V6"></path></svg>
              <span>Wpuszczany</span>
            </button>
            <button class="svg-filter-btn filter-pill" data-type="profile" data-val="Nawierzchniowy">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="12" rx="2"></rect><path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path></svg>
              <span>Nawierzchniowy</span>
            </button>
            <button class="svg-filter-btn filter-pill" data-type="profile" data-val="Kątowy">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20L20 4M4 20V8M4 20h12"></path></svg>
              <span>Kątowy</span>
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <div class="filter-group-title">Cena (PLN)</div>
          <!-- Fake CSS Histogram -->
          <div class="css-histogram">
            <div class="hist-bar" style="height: 20%;"></div>
            <div class="hist-bar" style="height: 50%;"></div>
            <div class="hist-bar" style="height: 100%;"></div>
            <div class="hist-bar" style="height: 80%;"></div>
            <div class="hist-bar" style="height: 40%;"></div>
            <div class="hist-bar" style="height: 10%;"></div>
          </div>
          <div class="horizontal-scroll-pills" style="margin-top: 8px;">
            <button class="filter-pill filter-pill-price" data-type="price" data-val="0-50">0-50</button>
            <button class="filter-pill filter-pill-price" data-type="price" data-val="50-100">50-100</button>
            <button class="filter-pill filter-pill-price" data-type="price" data-val="100-250">100-250</button>
            <button class="filter-pill filter-pill-price" data-type="price" data-val="250+">250+</button>
          </div>
        </div>
      </div>
      
      <!-- Sticky Footer inside Sheet -->
      <div class="filter-sheet-footer">
        <button id="applyFiltersBtn" class="apply-filters-btn">Pokaż 1323 produktów</button>
      </div>
    </div>
    
    <!-- Main content area wrapper -->
    <div class="shop-grid-wrapper" style="flex: 1;">
      <!-- Active Chips Row -->
      <div id="activeChipsContainer" class="active-chips-container">
        <!-- Dynamically populated -->
      </div>
    """
    
    new_content = content[:start_idx] + NEW_HTML + content[end_idx:]
    
    # Inject CSS
    if 'css/advanced-filters.css' not in new_content:
        new_content = new_content.replace('</head>', '  <link rel="stylesheet" href="css/advanced-filters.css">\n</head>')
        
    # Inject JS
    if 'js/advanced-filters.js' not in new_content:
        new_content = new_content.replace('</body>', '  <script src="js/advanced-filters.js"></script>\n</body>')
    
    # Write back
    with open('shop.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Advanced Filters HTML injected into shop.html")

if __name__ == '__main__':
    inject_advanced_filters()
