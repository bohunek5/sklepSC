import codecs
import os
import glob
import subprocess

workspace = r'd:\MY-AI-AGENTS\sklepSC'
css_file = os.path.join(workspace, 'css', 'configurator.css')

scrolled_css = """

/* === SCROLLED HEADER DARK MENU CONTRAST FIX === */
.site-header.scrolled,
.site-header.menu-active,
.mockup-header.scrolled {
  background: rgba(255, 255, 255, 0.96) !important;
  box-shadow: 0 7px 25px rgba(8, 25, 47, 0.12) !important;
  backdrop-filter: blur(18px) !important;
  -webkit-backdrop-filter: blur(18px) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.site-header.scrolled .desktop-nav a:not(.active),
.site-header.menu-active .desktop-nav a:not(.active),
.mockup-header.scrolled .desktop-nav a:not(.active),
.scrolled .desktop-nav a:not(.active),
.scrolled .mockup-nav a:not(.active) {
  color: #0b1a30 !important;
  border-color: rgba(11, 26, 48, 0.18) !important;
  background: rgba(11, 26, 48, 0.05) !important;
  font-weight: 700 !important;
}

.site-header.scrolled .desktop-nav a:not(.active):hover,
.site-header.menu-active .desktop-nav a:not(.active):hover,
.mockup-header.scrolled .desktop-nav a:not(.active):hover,
.scrolled .desktop-nav a:not(.active):hover,
.scrolled .mockup-nav a:not(.active):hover {
  color: var(--accent-color, #e14f27) !important;
  border-color: rgba(225, 79, 39, 0.35) !important;
  background: rgba(225, 79, 39, 0.08) !important;
}

.site-header.scrolled .desktop-nav a.active,
.site-header.menu-active .desktop-nav a.active,
.mockup-header.scrolled .desktop-nav a.active,
.scrolled .desktop-nav a.active,
.scrolled .mockup-nav a.active {
  color: #ffffff !important;
  background: #0b1a30 !important;
  border-color: #0b1a30 !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 14px rgba(11, 26, 48, 0.25) !important;
}

.site-header.scrolled .header-search,
.site-header.menu-active .header-search,
.mockup-header.scrolled .header-search,
.scrolled .header-search {
  color: #0b1a30 !important;
  border-color: rgba(11, 26, 48, 0.22) !important;
  background: rgba(11, 26, 48, 0.04) !important;
}

.site-header.scrolled .header-search input,
.site-header.menu-active .header-search input,
.scrolled .header-search input {
  color: #0b1a30 !important;
}

.site-header.scrolled .header-search input::placeholder,
.site-header.menu-active .header-search input::placeholder,
.scrolled .header-search input::placeholder {
  color: rgba(11, 26, 48, 0.55) !important;
}

.site-header.scrolled .header-search button,
.site-header.scrolled .header-icon,
.site-header.scrolled .menu-button,
.site-header.menu-active .header-icon,
.site-header.menu-active .menu-button,
.scrolled .header-icon,
.scrolled .menu-button {
  color: #0b1a30 !important;
  border-color: rgba(11, 26, 48, 0.18) !important;
  background: rgba(11, 26, 48, 0.05) !important;
}

.site-header.scrolled .header-actions svg,
.scrolled .header-actions svg {
  stroke: #0b1a30 !important;
}

.site-header.scrolled .mobile-menu a,
.scrolled .mobile-menu a {
  color: #0b1a30 !important;
}
/* === END SCROLLED HEADER DARK MENU CONTRAST FIX === */
"""

with codecs.open(css_file, 'r', 'utf-8') as f:
    css_content = f.read()

if "SCROLLED HEADER DARK MENU CONTRAST FIX" not in css_content:
    css_content += scrolled_css
    with codecs.open(css_file, 'w', 'utf-8') as f:
        f.write(css_content)
    print("Updated configurator.css with dark menu scrolled rules.")

# Update scroll script in all main HTML files
html_files = [f for f in glob.glob(os.path.join(workspace, '*.html')) if not f.endswith('_old.html') and not f.endswith('original_index.html') and not 'index_' in f and not 'configurator_' in f]

scroll_js = """  <script id="standard-header-scroll-script">
    document.addEventListener('DOMContentLoaded', () => {
      const header = document.getElementById('siteHeader') || document.querySelector('.site-header') || document.querySelector('.mockup-header');
      const headerLogo = document.querySelector('.brand img') || document.querySelector('.mockup-header-logo img');
      function handleScroll() {
        if (window.scrollY > 40) {
          if (header) header.classList.add('scrolled');
          if (headerLogo) headerLogo.src = 'images/logo-dark.png';
        } else {
          if (header) header.classList.remove('scrolled');
          if (headerLogo) headerLogo.src = 'images/logo-white.png';
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    });
  </script>"""

for html_path in html_files:
    with codecs.open(html_path, 'r', 'utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Ensure header scroll script exists and handles logo-dark.png correctly
    if 'id="standard-header-scroll-script"' not in content:
        content = content.replace('</body>', f'{scroll_js}\n</body>')
        modified = True
    else:
        # Update existing script block
        import re
        content = re.sub(r'<script id="standard-header-scroll-script">.*?</script>', scroll_js, content, flags=re.DOTALL)
        modified = True
        
    if modified:
        with codecs.open(html_path, 'w', 'utf-8') as f:
            f.write(content)
        print(f"Updated header scroll script in {os.path.basename(html_path)}")

print("All files updated successfully.")
