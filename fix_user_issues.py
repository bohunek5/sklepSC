import os
import glob

# Fix logo
def fix_html_files():
    html_files = glob.glob('*.html')
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        old_block = """.site-header .brand img {
  height: auto !important; max-width: 140px !important;
  max-width: none !important;
  object-fit: contain !important;
  transform: none;
}
@media (max-width: 768px) {
  .site-header .brand img {
    height: auto !important; max-width: 120px !important;
  }
}"""
        new_block = """.site-header .brand img {
  height: 36px !important;
  max-width: 170px !important;
  object-fit: contain !important;
  transform: none;
}
@media (max-width: 768px) {
  .site-header .brand img {
    height: 28px !important;
    max-width: 120px !important;
  }
}"""
        
        if old_block in content:
            content = content.replace(old_block, new_block)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed logo in {f}")

# Fix JS click bug
def fix_js():
    js_file = 'js/shared-popups.js'
    if os.path.exists(js_file):
        with open(js_file, 'r', encoding='utf-8') as file:
            content = file.read()
        
        old_line = "if (card && !e.target.closest('.action-btn-circle') && !e.target.closest('a')) {"
        new_line = "if (card && !e.target.closest('.action-btn-circle') && !e.target.closest('a') && !e.target.closest('button')) {"
        
        if old_line in content:
            content = content.replace(old_line, new_line)
            with open(js_file, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed click bug in {js_file}")

if __name__ == '__main__':
    fix_html_files()
    fix_js()
