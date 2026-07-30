import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

categories = [
    ("Taśmy LED Premium", "GWARANCJA DO 7 LAT", "Taśmy COB i SMD w systemach 12 V, 24 V i 48 V.", "images/cat_living.png", "Taśmy LED"),
    ("Zasilacze Scharfer", "ZASILANIE", "Hermetyczne zasilacze IP67 z 7-letnią gwarancją.", "images/cat_kitchen.png", "Zasilacze LED Scharfer"),
    ("Taśmy COB", "HIT SPRZEDAŻY", "Jednolita linia światła, brak widocznych punktów.", "images/cat_bathroom.png", "COB"),
    ("Taśmy RGB", "KOLOROWE LED", "Stwórz wyjątkowy nastrój wieloma kolorami.", "images/cat_stairs.png", "RGB"),
    ("Taśmy CCT", "ZMIENNA BARWA", "Dostosuj temperaturę bieli do nastroju.", "images/cat_garden.png", "CCT"),
    ("Zasilacze Wnętrzowe", "MOCNE I TRWAŁE", "Niezawodne zasilanie do suchych pomieszczeń.", "images/cat_office.png", "Zasilacze Wnętrzowe"),
    ("Sterowniki SMART", "SMART HOME", "Zarządzaj oświetleniem z aplikacji i pilota.", "images/cat_showroom.png", "Sterowniki LED"),
    ("Akcesoria", "DO MONTAŻU", "Niezbędne dodatki ułatwiające instalację.", "images/cat_bedroom.png", "Akcesoria do taśm LED i zasilaczy"),
    ("Profile Aluminiowe", "RADIATOR I DESIGN", "Ochrona i odprowadzanie ciepła dla taśm.", "images/cat_living.png", "Profile Aluminiowe"),
    ("Neony LED", "EFEKT NEONU", "Giętkie węże LED idealne na reklamy i elewacje.", "images/cat_showroom.png", "Neony LED"),
    ("Złączki i Kable", "SZYBKI MONTAŻ", "Łączenie taśm bez lutowania i mocne przewody.", "images/cat_kitchen.png", "Złączki i Kable"),
    ("Czujniki Ruchu", "AUTOMATYKA", "Światło włącza się samo gdy tego potrzebujesz.", "images/cat_stairs.png", "Czujniki Ruchu"),
    ("Moduły LED", "REKLAMY I LITERY", "Wydajne moduły do kasetonów i banerów.", "images/cat_office.png", "Moduły LED"),
    ("Żarówki LED", "KLASYCZNY GWINT", "Energooszczędne zamienniki tradycyjnych żarówek.", "images/cat_bathroom.png", "Żarówki LED"),
    ("Narzędzia", "DLA INSTALATORÓW", "Lutownice, ściągacze izolacji i mierniki.", "images/cat_bedroom.png", "Narzędzia")
]

grid_html = '<div class="categories-main-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 100%; margin: 0 auto; width: 100%;">\n'

for title, subtitle, desc, img, cat in categories:
    grid_html += f'''<!-- {title} -->
<div class="category-banner-card" onclick="window.location.href='shop.html?category={cat}'" style="cursor: pointer; position: relative; overflow: hidden; border-radius: 12px; height: 420px; box-shadow: 0 15px 35px rgba(0,0,0,0.06); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; align-items: flex-end; padding: 30px;" style="background-size: cover; background-position: center;">
<video class="category-banner-bg" data-poster="{img}" preload="none" muted playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;"></video>
<div class="category-banner-overlay"></div>
<div style="position: relative; z-index: 2; width: 100%; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;">
<span class="glass-banner-btn">ZOBACZ</span>
<div style="text-align: right; max-width: 70%; display: flex; flex-direction: column; align-items: flex-end;">
<span style="font-size: 13px; letter-spacing: 2px; color: var(--accent-color); font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 5px;">{subtitle}</span>
<h3 style="color: #fff; font-size: 24px; font-weight: 800; font-family: 'Outfit', sans-serif; margin: 5px 0 10px 0;">{title}</h3>
<p style="color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.5; margin-bottom: 0px; max-width: 100%;">{desc}</p>
</div>
</div>
</div>
'''

grid_html += '</div>\n'

# Use regex to find the section and replace the grids
pattern = r'<div class="categories-banners-grid".*?</div>\s*</div>\s*</section>'

new_content = re.sub(pattern, grid_html + '\n</div>\n</section>', content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done replacing HTML")
