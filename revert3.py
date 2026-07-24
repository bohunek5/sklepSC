import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert the "white glass border" for categories
    labels = [
        "PROFESJONALNE SYSTEMY", "GWARANCJA DO 7 LAT", "ZASILANIE", 
        "HIT SPRZEDAŻY", "KOLOROWE LED", "ZMIENNA BARWA", 
        "MOCNE I TRWAŁE", "SMART HOME", "DO MONTAŻU"
    ]
    for label in labels:
        # Search for the span containing the glassmorphism css
        glass_css = ' background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 6px; padding: 4px 8px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); margin-bottom: 8px;'
        content = content.replace(glass_css, '')
        content = content.replace('display: inline-block;', 'display: block;')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
