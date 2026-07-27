import os
import glob
import re

CSS_FIXES = """
<!-- MOBILE UI FIXES -->
<style class="mobile-ui-fixes">
/* 1. Main Page White Gap Fix */
body.index-page .site-header {
  position: absolute !important;
  top: 0; left: 0; right: 0; width: 100%;
  z-index: 1000;
}
body.index-page .site-header.scrolled {
  position: fixed !important;
  background: rgba(255, 255, 255, 0.95) !important;
}
body.index-page .site-header:not(.scrolled) {
  background: transparent !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
body.index-page .site-header:not(.scrolled) .desktop-nav a,
body.index-page .site-header:not(.scrolled) .header-actions svg {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}
body.index-page .site-header:not(.scrolled) .brand img {
  filter: brightness(0) invert(1);
}

/* 2. Hero Banner Spacing on Mobile */
@media (max-width: 768px) {
  .mockup-hero-slider, .hero-section {
    padding-bottom: 110px !important;
  }
  .scroll-down-circle {
    bottom: 110px !important;
  }
  
  /* 3. Standardize Mobile Top Header */
  .site-header {
    padding: 10px 15px !important;
    min-height: 60px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }
  .site-header .brand img,
  .mockup-header-logo img {
    height: 22px !important;
    max-width: 120px !important;
    object-fit: contain !important;
    margin: 0 !important;
  }
  .site-header .header-actions {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    margin-left: auto !important;
  }
  /* Force cart and search visibility on mobile */
  .site-header .header-search {
    display: none !important; /* Hide full search bar to save space, rely on AI/Menu */
  }
  .site-header .header-icon {
    display: inline-flex !important;
    color: var(--primary-color) !important;
  }
  .site-header .header-icon svg {
    width: 24px !important;
    height: 24px !important;
    stroke: var(--primary-color) !important;
  }
  .menu-toggle {
    display: none !important; /* Hide old hamburger */
  }
}

/* 4. New Bottom Navigation */
.new-glass-nav {
  display: none;
  position: fixed;
  bottom: 15px;
  left: 15px;
  right: 15px;
  width: auto;
  background: rgba(11, 26, 48, 0.90) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px !important;
  z-index: 9999;
  padding: 8px 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
}
.new-glass-nav .mobile-nav-items {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  height: 50px;
}
.new-glass-nav .mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: rgba(255,255,255,0.6) !important;
  text-decoration: none !important;
  font-size: 10px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease;
  width: 20%;
  position: relative;
  background: transparent !important;
  border: none !important;
  padding-bottom: 2px;
}
.new-glass-nav .mobile-nav-item i {
  font-size: 22px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}
.new-glass-nav .nav-ai-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  margin-bottom: 4px;
  filter: grayscale(1) brightness(2);
  transition: all 0.3s ease;
}
.new-glass-nav .mobile-nav-item.active {
  color: #00e5ff !important;
}
.new-glass-nav .mobile-nav-item.active i {
  color: #00e5ff !important;
  filter: drop-shadow(0 0 8px rgba(0,229,255,0.6));
}
.new-glass-nav .nav-center-pill {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0b1a30, #1a365d);
  border: 2px solid #00e5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
  color: #fff;
  transition: transform 0.2s ease;
}
.new-glass-nav .nav-center-pill:active {
  transform: translateX(-50%) scale(0.95);
}
.new-glass-nav .nav-center-pill i {
  font-size: 24px;
  margin-bottom: 0;
  color: #00e5ff;
}
.new-glass-nav .mobile-nav-item:hover {
  color: #fff !important;
}
.new-glass-nav .mobile-nav-item:hover .nav-ai-icon {
  filter: none;
}
@media (max-width: 768px) {
  .new-glass-nav {
    display: block !important;
  }
  .mockup-footer {
    margin-bottom: 100px !important;
  }
}
/* 5. Mobile Category Banners (Wężej, 1 linia) */
@media (max-width: 768px) {
  .category-banner-card, .category-banner-card.sub-card {
    height: 180px !important; /* Wężej w pionie */
    padding: 20px 15px !important;
  }
  .category-banner-card h3, .category-banner-card.sub-card h3 {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-size: 18px !important;
    line-height: 1 !important;
    margin-bottom: 0 !important;
  }
  .category-banner-card div > span, .category-banner-card.sub-card div > span {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-size: 11px !important;
  }
}
</style>
<!-- END MOBILE UI FIXES -->
"""

NEW_NAV_HTML = """
<nav class="new-glass-nav">
  <div class="mobile-nav-items">
    <a class="mobile-nav-item active" href="index.html">
      <i class="ph ph-house"></i>
      <span>Start</span>
    </a>
    <a class="mobile-nav-item" href="shop.html">
      <i class="ph ph-squares-four"></i>
      <span>Sklep</span>
    </a>
    <a class="mobile-nav-item configurator-mobile-link" href="configurator.html" style="position:relative;">
      <div class="nav-center-pill">
        <i class="ph ph-lightbulb-filament"></i>
      </div>
      <span style="margin-top:24px;">Dobierz</span>
    </a>
    <a class="mobile-nav-item" href="ai-shopping.html">
      <img src="images/prescot-pattern.png" class="nav-ai-icon" alt="">
      <span>Zakup AI</span>
    </a>
    <a class="mobile-nav-item" href="contact.html">
      <i class="ph ph-envelope-simple"></i>
      <span>Kontakt</span>
    </a>
  </div>
</nav>
"""

def fix_html_files():
    html_files = glob.glob('*.html')
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        
        # 1. Inject or Replace CSS Fixes
        if "<!-- MOBILE UI FIXES -->" in content:
            # Replace existing block
            start_idx = content.find("<!-- MOBILE UI FIXES -->")
            end_idx = content.find("<!-- END MOBILE UI FIXES -->") + len("<!-- END MOBILE UI FIXES -->")
            if end_idx > len("<!-- END MOBILE UI FIXES -->") - 1:
                content = content[:start_idx] + CSS_FIXES.strip() + content[end_idx:]
                modified = True
        else:
            content = content.replace("</body>", f"{CSS_FIXES}\n</body>")
            modified = True
            
        # 1.5 Add index-page class to body on index.html
        if f == "index.html" and 'class="index-page"' not in content:
            content = content.replace('<body>', '<body class="index-page">')
            modified = True
            
        # 2. Replace old mobile-bottom-nav
        # The old nav is <nav class="mobile-bottom-nav"> ... </nav>
        # Let's use regex to find and replace it
        nav_pattern = re.compile(r'<nav class="mobile-bottom-nav">.*?</nav>', re.DOTALL)
        if nav_pattern.search(content):
            content = nav_pattern.sub(NEW_NAV_HTML.strip(), content)
            modified = True
        
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated {f}")

if __name__ == '__main__':
    fix_html_files()
