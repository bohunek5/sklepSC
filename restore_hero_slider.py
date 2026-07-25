import subprocess
import codecs
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

# 1. Get original index.html from af8f9b7
result = subprocess.run(['git', 'show', 'af8f9b7:index.html'], capture_output=True, text=True, cwd=workspace, encoding='utf-8')
original_html = result.stdout

# 2. Extract original hero slider
orig_slider_match = re.search(r'(<section class="mockup-hero-slider">.*?)</section>', original_html, flags=re.DOTALL)
if orig_slider_match:
    orig_slider = orig_slider_match.group(0)
else:
    print("Could not find original hero slider")
    exit(1)

# 3. Read current index.html
with codecs.open(f'{workspace}/index.html', 'r', 'utf-8') as f:
    current_html = f.read()

# 4. Replace current hero slider with original one
curr_slider_match = re.search(r'(<section class="mockup-hero-slider">.*?)</section>', current_html, flags=re.DOTALL)
if curr_slider_match:
    current_html = current_html.replace(curr_slider_match.group(0), orig_slider)
else:
    print("Could not find current hero slider")
    exit(1)

# 5. Make sure pointer-events for arrows are applied to the original slider controls!
css_fix = """
    .hero-controls-bar .slider-arrow, .hero-controls-bar .scroll-down-arrow {
      pointer-events: auto !important;
    }
"""
if "pointer-events: auto !important;" not in current_html.split('.hero-controls-bar')[1][:500]:
    current_html = current_html.replace('.slider-arrows {', css_fix + '\n    .slider-arrows {')

# 6. Write back
with codecs.open(f'{workspace}/index.html', 'w', 'utf-8') as f:
    f.write(current_html)

print("Restored original hero slider and kept arrows fixed.")
