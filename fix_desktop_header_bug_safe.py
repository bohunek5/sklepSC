import glob

def fix_header_colors():
    html_files = glob.glob('*.html')
    
    block_to_remove = """body.index-page .site-header:not(.scrolled) .desktop-nav a,
body.index-page .site-header:not(.scrolled) .header-actions svg {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}
body.index-page .site-header:not(.scrolled) .brand img {
  filter: brightness(0) invert(1);
}"""

    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if block_to_remove in content:
            content = content.replace(block_to_remove, "")
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed aggressive color overrides in {f}")

if __name__ == '__main__':
    fix_header_colors()
