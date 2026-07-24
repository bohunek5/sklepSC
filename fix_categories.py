import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Darker gradients
content = content.replace(
    'rgba(11,26,48,0.92) 0%, rgba(11,26,48,0.4) 60%, rgba(11,26,48,0.1) 100%',
    'rgba(11,26,48,1) 0%, rgba(11,26,48,0.85) 60%, rgba(11,26,48,0.3) 100%'
)
content = content.replace(
    'rgba(11,26,48,0.95) 0%, rgba(11,26,48,0.5) 70%, transparent 100%',
    'rgba(11,26,48,1) 0%, rgba(11,26,48,0.85) 70%, rgba(11,26,48,0.3) 100%'
)
content = content.replace(
    'rgba(11,26,48,0.95) 0%, rgba(11,26,48,0.4) 100%',
    'rgba(11,26,48,1) 0%, rgba(11,26,48,0.8) 100%'
)
content = content.replace(
    'rgba(0, 0, 0, 0.6) 0%, transparent 60%',
    'rgba(0, 0, 0, 0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%'
)

# 2. Add white glass border to orange text
# The labels inside banners
labels_to_replace = [
    "PROFESJONALNE SYSTEMY", "GWARANCJA DO 7 LAT", "ZASILANIE", 
    "HIT SPRZEDAŻY", "KOLOROWE LED", "ZMIENNA BARWA", 
    "MOCNE I TRWAŁE", "SMART HOME", "DO MONTAŻU"
]

for label in labels_to_replace:
    # We will use regex to find the span containing this label and add the glass styles
    pattern = r'(<span style="[^"]*color:\s*var\(--accent-color\)[^"]*)(">)' + label + r'(</span>)'
    
    def repl(m):
        style = m.group(1)
        # Ensure it has inline-block instead of block, if block is there
        style = re.sub(r'display:\s*block;', 'display: inline-block;', style)
        # Add glassmorphism properties
        glass_style = ' background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 6px; padding: 4px 8px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); margin-bottom: 8px;'
        return style + glass_style + m.group(2) + label + m.group(3)
        
    content = re.sub(pattern, repl, content)

# 3. Mobile CSS fixes (button size and text wrapping)
mobile_css = """
      /* Smaller buttons on large category cards for mobile */
      .category-banner-card span.glass-banner-btn {
        padding: 8px 16px !important;
        font-size: 10px !important;
      }
      /* Prevent text truncation on category titles */
      .mockup-category-card h3, .glass-cat-title, .category-card h3, .category-banner-card h3 {
        white-space: normal !important;
        word-wrap: break-word !important;
        line-height: 1.2 !important;
      }
"""

if "/* Smaller buttons on large category cards for mobile */" not in content:
    content = content.replace('.category-banner-card.sub-card span.glass-banner-btn {', mobile_css + '\n      .category-banner-card.sub-card span.glass-banner-btn {')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html updated")
