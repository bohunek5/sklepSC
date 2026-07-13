import glob
import re

# 1. Get the best header CSS from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

start_marker = "/* Common Header with Glassmorphism */"
end_marker = ".mockup-actions {"

start_idx = index_content.find(start_marker)
end_idx = index_content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find CSS block in index.html!")
    exit(1)

header_css = index_content[start_idx:end_idx]

# Modify the active state in this CSS block to be the BLACK tile
# We want:
# .mockup-nav a.active { background: var(--primary-color) !important; border-color: var(--primary-color) !important; color: var(--white) !important; ... }
old_active_pattern = r"\.mockup-nav a\.active \{[^}]*\}"
new_active_css = """.mockup-nav a.active {
      background: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      color: var(--white) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }"""
header_css = re.sub(old_active_pattern, new_active_css, header_css)

# Also fix the scrolled active state
old_scrolled_active = r"\.mockup-header\.scrolled \.mockup-nav a\.active \{[^}]*\}"
new_scrolled_active = """.mockup-header.scrolled .mockup-nav a.active {
      background: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      color: var(--white) !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }"""
header_css = re.sub(old_scrolled_active, new_scrolled_active, header_css)

# Add dropdown fixes directly into this block so it is universal
dropdown_fix = """
    /* Magic Dropdown Universal Fix */
    body .magic-dropdown {
      opacity: 0;
      visibility: hidden;
      transition: var(--transition);
      background: var(--white);
    }
    body .has-mega-menu:hover .magic-dropdown {
      opacity: 1;
      visibility: visible;
    }
    .magic-dropdown ul li a {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      color: var(--primary-color) !important;
      padding: 12px 15px !important;
      border-radius: 8px !important;
    }
    .magic-dropdown ul li a:hover {
      background: rgba(0, 0, 0, 0.05) !important;
      color: var(--primary-color) !important;
      transform: translateX(5px) !important;
    }
    """
header_css += dropdown_fix + "\n    "

# 2. Apply to all files
html_files = glob.glob("*.html")
for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace CSS block
    f_start = content.find(start_marker)
    f_end = content.find(end_marker)
    if f_start != -1 and f_end != -1:
        content = content[:f_start] + header_css + content[f_end:]
    elif "/* Common Header with Glassmorphism */" not in content and ".mockup-header {" in content:
        # Some files might not have the comment, find by .mockup-header {
        f_start = content.find(".mockup-header {")
        f_end = content.find(".mockup-actions {")
        if f_start != -1 and f_end != -1:
            content = content[:f_start] + header_css + content[f_end:]
    
    # 3. Replace logo src in HTML
    content = content.replace('src="images/logo-dark.png" alt="Prescot Logo" id="headerLogo"', 'src="images/logo-white.png" alt="Prescot Logo" id="headerLogo"')
    content = content.replace('src="images/logo-dark.png" id="headerLogo"', 'src="images/logo-white.png" id="headerLogo"')
    
    # 4. Replace logo logic in JS
    js_scroll_logic_old = """      } else {
        if (header) header.classList.remove('scrolled');
        if (headerLogo) headerLogo.src = 'images/logo-dark.png';
      }"""
    js_scroll_logic_new = """      } else {
        if (header) header.classList.remove('scrolled');
        if (headerLogo) headerLogo.src = 'images/logo-white.png';
      }"""
    content = content.replace(js_scroll_logic_old, js_scroll_logic_new)
    
    # 5. Fix mobile menu display if needed. The user screenshot showed .magic-dropdown taking up space.
    # The dropdown fix added above should handle it by setting it to absolute/opacity 0.
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Headers updated universally!")
