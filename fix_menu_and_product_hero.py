import os
import glob
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'
html_files = glob.glob(os.path.join(workspace, '*.html'))

def read_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read(), 'utf-8'
    except UnicodeDecodeError:
        try:
            with open(path, 'r', encoding='utf-16') as f:
                return f.read(), 'utf-16'
        except Exception:
            return None, None

for filepath in html_files:
    content, enc = read_file(filepath)
    if not content: continue
    
    new_content = re.sub(r'(\.mockup-nav\s+ul\s*\{[^}]*gap:\s*)12px', r'\g<1>26px', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding=enc) as f:
            f.write(new_content)
        print(f"Updated menu gap in {os.path.basename(filepath)}")

# 2. Fix product.html hero
product_path = os.path.join(workspace, 'product.html')
if os.path.exists(product_path):
    prod_html, enc = read_file(product_path)
        
    prod_html = re.sub(r'<p id="heroProductCategory"[^>]*>.*?</p>', '', prod_html, flags=re.DOTALL)
    prod_html = re.sub(r'(<h1 id="heroProductTitle"[^>]*?font-size:\s*)48px;', r'\1clamp(22px, 3vw, 32px); line-height: 1.3;', prod_html)
    prod_html = re.sub(r'text-shadow:\s*0\s*4px\s*12px\s*rgba\(0,0,0,0\.3\);', 'text-shadow: 0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,1.0);', prod_html)

    with open(product_path, 'w', encoding=enc) as f:
        f.write(prod_html)
    print("Updated product.html hero")
