import glob
import re

# We will update all HTML files to fix button roundness and arrow shapes
override_style = """
  <style>
    /* Make buttons fully rounded as requested */
    .mockup-btn, 
    .add-to-cart-btn, 
    .checkout-btn, 
    .submit-order-btn,
    .qv-add-cart-btn,
    .glass-banner-btn {
      border-radius: 30px !important;
    }
    
    /* Make slider arrows and scroll down circle perfectly round */
    .scroll-down-circle,
    .slider-arrow {
      border-radius: 50% !important;
    }
    
    /* Enable native smooth scrolling */
    html {
      scroll-behavior: smooth !important;
    }
  </style>
"""

for filepath in glob.glob("*.html"):
    if filepath == 'old_index.html': continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the previous 2px rectangular override if it exists
    if "/* Make buttons more rectangular */" in content:
        # We can just replace the old block with the new block
        content = re.sub(r'<style>\s*/\* Make buttons more rectangular \*/.*?</style>', override_style, content, flags=re.DOTALL)
    elif "/* Make buttons fully rounded as requested */" not in content:
        content = content.replace("</head>", f"{override_style}\n</head>")

    # Remove the JS event listener for the scroll-down arrow so native anchor link takes over
    if filepath == 'index.html':
        js_to_remove = """    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    if (scrollDownArrow) {
      scrollDownArrow.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('#kategorie-banners');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }"""
        if js_to_remove in content:
            content = content.replace(js_to_remove, "")
        
        js_to_remove_old = """    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    if (scrollDownArrow) {
      scrollDownArrow.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('#kategorie-banners');
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    }"""
        if js_to_remove_old in content:
            content = content.replace(js_to_remove_old, "")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Shapes and scroll bug fixed.")
