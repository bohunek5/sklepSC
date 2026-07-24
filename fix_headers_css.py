import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    index = f.read()

# We know the header CSS starts around line 1140 and ends where the next major section begins (e.g., .hero-controls-bar).
# Let's extract everything from .mockup-header { down to the end of the magic dropdown CSS.
# A better way is to find the exact block. Let's find the start of .mockup-header { and the end of .magic-dropdown css.
# Wait, it's safer to just extract the whole `<style>` block that contains .mockup-header {
# In index.html, there are multiple <style> blocks.
style_blocks = re.findall(r'<style>(.*?)</style>', index, re.DOTALL)
header_style = ""
for block in style_blocks:
    if '.mockup-header' in block:
        header_style = block
        break

# Now we need to modify this block for subpages:
# The header on subpages shouldn't be transparent by default.
# It should have a solid or frosted background by default, with dark text.
# Let's replace the .mockup-header background from transparent to the frosted one.
header_style = re.sub(
    r'\.mockup-header\s*\{[^}]*\}',
    '''.mockup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 4% !important;
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(15px) !important;
      -webkit-backdrop-filter: blur(15px) !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }''',
    header_style,
    count=1
)

# And we need to change the link colors in .mockup-nav a to be dark by default
header_style = re.sub(
    r'\.mockup-nav ul li a\s*\{([^}]*)\}?',
    r'.mockup-nav ul li a {\1\n      color: var(--primary-color) !important;\n      background: transparent !important;\n      border: none !important;\n    }',
    header_style
)

header_style = re.sub(
    r'\.mockup-action-icon\s*\{([^}]*)\}?',
    r'.mockup-action-icon {\1\n      color: var(--primary-color) !important;\n    }',
    header_style
)

# Wait, the user wants NO BOXES around the menu items!
# So let's remove background and border from .mockup-nav ul li a entirely!
header_style = re.sub(r'background:\s*rgba\([^)]+\)\s*;', '', header_style)
header_style = re.sub(r'border:\s*1px\s*solid[^;]+;', '', header_style)

# Write the processed style to a file to verify
with open('header_style.css', 'w', encoding='utf-8') as f:
    f.write(header_style)
print("Extracted header style to header_style.css")

