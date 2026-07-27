import glob
import re

def fix_all():
    html_files = glob.glob('*.html')
    
    # 1. Fix ai-shopping.html gradient
    if 'ai-shopping.html' in html_files:
        with open('ai-shopping.html', 'r', encoding='utf-8') as f:
            ai_content = f.read()
            
        old_gradient = """background: conic-gradient(
        from var(--halo-angle, 0deg), 
        rgba(5, 12, 25, 1) 0%,         /* Very dark navy */
        rgba(5, 12, 25, 1) 40%, 
        rgba(11, 26, 48, 1) 60%,       /* Deep navy */
        rgba(11, 26, 48, 0.7) 80%,    /* Brand orange fading in */
        #0b1a30 95%,                   /* Pure brand orange */
        rgba(5, 12, 25, 1) 100%        /* Seamless loop to dark navy */
      );"""
      
        new_gradient = """background: conic-gradient(
        from var(--halo-angle, 0deg), 
        #0b1a30 0%,
        #ffffff 33%,
        #FF5A00 66%,
        #0b1a30 100%
      );"""
      
        # Sometimes spacing differs, let's use regex
        pattern = re.compile(r'background:\s*conic-gradient\([^;]+;', re.MULTILINE | re.DOTALL)
        ai_content = pattern.sub(new_gradient, ai_content)
        
        with open('ai-shopping.html', 'w', encoding='utf-8') as f:
            f.write(ai_content)
            
    # 2. Fix global-config-nav-css invisible icons and remove .new-glass-nav overrides if they cause issues
    bad_css = """
  /* Fix cart button in top header to render like the old one */
  .site-header .header-icon, .mockup-header .header-icon {
    display: inline-flex !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  .site-header .header-icon svg, .mockup-header .header-icon svg {
    stroke: #0b1a30 !important;
    fill: none !important;
  }
  .index-page .site-header:not(.scrolled) .header-icon svg {
    stroke: #ffffff !important;
  }
  .menu-toggle, .menu-button {
    display: block !important;
  }
"""

    better_css = """
  /* Only force dark icons on white headers (scrolled) */
  .site-header.scrolled .header-icon svg, .mockup-header.scrolled .header-icon svg {
    stroke: #0b1a30 !important;
  }
  .menu-toggle, .menu-button {
    display: block !important;
  }
"""

    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        
        if bad_css.strip() in content:
            content = content.replace(bad_css.strip(), better_css.strip())
            modified = True
            
        if modified:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)

if __name__ == '__main__':
    fix_all()
    print("Done")
