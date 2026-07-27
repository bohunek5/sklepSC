import glob
import re

CSS_FIXES = """
<style id="urgent-mobile-fixes-3">
/* FIX 1: White patch on navy nav on mobile */
.new-glass-nav a.active, 
.new-glass-nav .mobile-nav-item.active {
  background: transparent !important;
  color: #00e5ff !important;
}
.new-glass-nav .nav-center-pill {
  background: linear-gradient(135deg, #0b1a30, #1a365d) !important;
  border: 2px solid #00e5ff !important;
  border-radius: 50% !important; /* ensure it's round and no white corners */
}
.new-glass-nav .nav-center-pill i {
  background: transparent !important;
}

/* FIX 2: Scroll arrow overlap & Huge category banners */
@media (max-width: 768px) {
  .scroll-down-arrow {
    bottom: 140px !important; /* Move higher to not overlap */
  }
  .hero-section, .mockup-hero-slider, .page-hero {
    padding-bottom: 140px !important;
  }

  /* Force ALL category banners to be slim */
  .category-banner-card, 
  .category-banner-card.sub-card, 
  .mockup-category-card, 
  .category-card,
  .shop-category-card {
    height: 160px !important;
    min-height: 160px !important;
    padding: 20px 15px !important;
  }
  .category-banner-card h3, 
  .category-banner-card.sub-card h3, 
  .mockup-category-card h3, 
  .glass-cat-title,
  .category-card h3 {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-size: 18px !important;
    line-height: 1 !important;
    margin-bottom: 4px !important;
  }
  .category-banner-card div > span, 
  .category-banner-card.sub-card div > span, 
  .mockup-category-card p, 
  .glass-cat-subtitle,
  .category-card p {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    font-size: 11px !important;
    display: block !important;
    margin: 0 !important;
  }
}
</style>
"""

def fix_mobile_ui():
    html_files = glob.glob('*.html')
    
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        
        # If the fix is already there, update it. If not, append before </body>
        if "id=\"urgent-mobile-fixes-3\"" in content:
            # We already have it, let's remove the old one
            content = re.sub(r'<style id="urgent-mobile-fixes-3">.*?</style>', CSS_FIXES.strip(), content, flags=re.DOTALL)
            modified = True
        else:
            content = content.replace("</body>", f"{CSS_FIXES}\n</body>")
            modified = True
            
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Applied urgent mobile UI fixes to {f}")

if __name__ == '__main__':
    fix_mobile_ui()
