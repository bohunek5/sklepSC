import os
import re

# Read index.html to extract the correct blocks
with open("index.html", "r") as f:
    index_content = f.read()

# Extract CSS
css_match = re.search(r'(\s+/\* MOBILE BOTTOM NAV CSS \*/\s+.+?)(?=\s+/\* --)', index_content, re.DOTALL)
if not css_match:
    print("Could not find CSS block in index.html")
    exit(1)
css_block = css_match.group(1)

# Extract HTML
html_match = re.search(r'(  <!-- Mobile Bottom Navigation -->\s+<nav class="mobile-bottom-nav">\s+<div class="mobile-nav-items">\s+.+?  </nav>)', index_content, re.DOTALL)
if not html_match:
    print("Could not find HTML block in index.html")
    exit(1)
html_block_template = html_match.group(1)

# Process all html files
for filename in os.listdir("."):
    if not filename.endswith(".html") or filename == "index.html":
        continue
    
    with open(filename, "r") as f:
        content = f.read()
    
    # Replace CSS
    content = re.sub(r'\s+/\* MOBILE BOTTOM NAV CSS \*/\s+.+?(?=\s+/\* --)', '\n' + css_block, content, flags=re.DOTALL)
    
    # Replace HTML
    # We need to set the active class correctly based on the filename
    # First, let's inject the generic HTML block (copied from index)
    content = re.sub(r'  <!-- Mobile Bottom Navigation -->\s+<nav class="mobile-bottom-nav">\s+<div class="mobile-nav-items">\s+.+?  </nav>', '\n' + html_block_template, content, flags=re.DOTALL)
    
    # Now fix the active state
    # Remove active class from index.html link
    content = content.replace('class="mobile-nav-item active"', 'class="mobile-nav-item"')
    
    # Add active class to the current page if it exists
    page_name = "Home" if filename == "index.html" else (
        "Blog" if filename == "blog.html" else (
            "O nas" if filename == "about.html" else (
                "Kontakt" if filename == "contact.html" else (
                    "Kategorie" if filename == "shop.html" else None
                )
            )
        )
    )
    
    if page_name:
        content = re.sub(
            f'<a href="([^"]+)" class="mobile-nav-item"([^>]*)>\\s*<i class="ph-fill ph-([^"]+)"></i>\\s*<span>{page_name}</span>',
            f'<a href="\\1" class="mobile-nav-item active"\\2>\n        <i class="ph-fill ph-\\3"></i>\n        <span>{page_name}</span>',
            content
        )
        # Also handle javascript:void(0) case for Kategorie
        content = re.sub(
            f'<a href="javascript:void\\(0\\);" onclick="openMobileCategories\\(\\);" class="mobile-nav-item">\\s*<i class="ph-fill ph-squares-four"></i>\\s*<span>{page_name}</span>',
            f'<a href="javascript:void(0);" onclick="openMobileCategories();" class="mobile-nav-item active">\n        <i class="ph-fill ph-squares-four"></i>\n        <span>{page_name}</span>',
            content
        )
    
    with open(filename, "w") as f:
        f.write(content)
        
print("Updated all HTML files!")
