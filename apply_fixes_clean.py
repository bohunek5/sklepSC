import os
import re

def main():
    root_dir = r"d:\MY-AI-AGENTS\sklepSC"
    
    # 2. Add fallback backgrounds to index.html and fix slider arrows on mobile
    index_path = os.path.join(root_dir, 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Add background-image to category-banner-card based on their poster without breaking HTML
        # The previous script broke HTML by replacing inside the tag without capturing properly
        content = re.sub(r'(<div class="category-banner-card sub-card"[^>]*?)>', 
                         r'\1 style="background-size: cover; background-position: center;">', content)
                         
        # We will add CSS to the HEAD, only ONCE
        if '.category-banner-card:has' not in content:
            poster_css = """
            <style>
            .category-banner-card:has(video[src*="cat_living"]) { background-image: url('images/cat_living.png'); }
            .category-banner-card:has(video[src*="cat_kitchen"]) { background-image: url('images/cat_kitchen.png'); }
            .category-banner-card:has(video[src*="cat_bathroom"]) { background-image: url('images/cat_bathroom.png'); }
            .category-banner-card:has(video[src*="cat_stairs"]) { background-image: url('images/cat_stairs.png'); }
            .category-banner-card:has(video[src*="cat_garden"]) { background-image: url('images/cat_garden.png'); }
            .category-banner-card:has(video[src*="cat_office"]) { background-image: url('images/cat_office.png'); }
            .category-banner-card:has(video[src*="cat_showroom"]) { background-image: url('images/cat_showroom.png'); }
            .category-banner-card:has(video[src*="cat_bedroom"]) { background-image: url('images/cat_bedroom.png'); }
            
            @media (max-width: 768px) {
                .slider-arrow { bottom: 130px !important; top: auto !important; transform: none !important; }
            }
            </style>
            """
            content = content.replace('</head>', poster_css + '\n</head>')
        
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
    # 3. Fix product images to be square and contained, and refine filter UI in shop.html
    html_files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    for file in html_files:
        filepath = os.path.join(root_dir, file)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            continue
            
        modified = False
        
        # Make product images square and contain
        if '.mockup-product-img {' in content:
            content = re.sub(
                r'\.mockup-product-img\s*\{[^}]*?\}',
                '.mockup-product-img { width: 100%; aspect-ratio: 1/1; object-fit: contain; background: #fff; padding: 10px; border-radius: 8px 8px 0 0; }',
                content,
                flags=re.DOTALL
            )
            modified = True
            
        # Fix shop filters layout to be less cluttered
        if file == 'shop.html':
            if '.horizontal-ribbon-row {' in content:
                content = re.sub(
                    r'\.horizontal-ribbon-row\s*\{[^\}]*\}',
                    '.horizontal-ribbon-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding: 5px; align-items: center; }',
                    content
                )
                modified = True
            if 'image-rendering: -webkit-optimize-contrast;' in content:
                content = content.replace('image-rendering: -webkit-optimize-contrast;', '')
                modified = True
                
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                
    # 4. Update products-data.js to use .webp
    products_js = os.path.join(root_dir, 'js', 'products-data.js')
    if os.path.exists(products_js):
        with open(products_js, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r'(images/products/.*?)\.jpg', r'\1.webp', content)
        content = re.sub(r'(images/products/.*?)\.png', r'\1.webp', content)
        with open(products_js, 'w', encoding='utf-8') as f:
            f.write(content)
            
    # 5. Fix configurator mobile layout
    cfg_css = os.path.join(root_dir, 'css', 'configurator.css')
    if os.path.exists(cfg_css):
        with open(cfg_css, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Change fixed heights for mobile to auto
        content = content.replace('.visual-choice,\n  .control-choice { min-height: 205px; padding: 18px; }', 
                                  '.visual-choice,\n  .control-choice { min-height: auto; padding: 12px; gap: 8px; }')
        content = content.replace('.light-choice { min-height: 192px; }', 
                                  '.light-choice { min-height: auto; }')
        
        with open(cfg_css, 'w', encoding='utf-8') as f:
            f.write(content)

    print("Successfully applied clean fixes")

if __name__ == '__main__':
    main()
