import codecs
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

with codecs.open(f'{workspace}/index.html', 'r', 'utf-8') as f:
    content = f.read()

# Fix pointer-events for slider arrows and scroll down arrow on desktop
css_fix = """
    .hero-controls-bar .slider-arrow, .hero-controls-bar .scroll-down-arrow {
      pointer-events: auto !important;
    }
"""

if "pointer-events: auto !important;" not in content.split('.hero-controls-bar')[1][:500]:
    # Inject it into the style block
    content = content.replace('.slider-arrows {', css_fix + '\n    .slider-arrows {')

with codecs.open(f'{workspace}/index.html', 'w', 'utf-8') as f:
    f.write(content)
print("Fixed pointer events for arrows")
