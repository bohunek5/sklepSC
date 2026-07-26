import os

def fix_css():
    css_path = r"d:\MY-AI-AGENTS\sklepSC\css\prescot-responsive.css"
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_styles = """
/* BUTTON OUTLINE FIX */
.mockup-btn-outline {
  background: transparent !important;
  color: #08192f !important;
  border: 1px solid #08192f !important;
  transition: all 0.3s ease;
}
.mockup-btn-outline:hover {
  background: #08192f !important;
  color: #fff !important;
}

/* FIX SQUARE PRODUCT IMAGES */
.mockup-product-media {
  aspect-ratio: 1 / 1 !important;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 10px;
}
.mockup-product-media img {
  width: 100%;
  height: 100%;
  object-fit: contain !important;
}

/* FILTER LAYOUT FIX */
.shop-filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background: transparent;
  padding: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
.filter-group {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 15px;
  flex: 1 1 200px;
}
.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filter-option {
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-option:hover, .filter-option.active {
  background: #08192f;
  color: #fff;
  border-color: #08192f;
}
"""
    
    # Check if we already appended it
    if "/* BUTTON OUTLINE FIX */" not in content:
        content += new_styles
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed CSS styles")

if __name__ == '__main__':
    fix_css()
