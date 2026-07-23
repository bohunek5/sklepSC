import xml.etree.ElementTree as ET
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

tree = ET.parse("prescotcloud.xml")
root = tree.getroot()

# Load GPSR info (producers & responsible persons)
producers = {}
persons = {}

producers_elem = root.find("responsibleProducers")
if producers_elem is not None:
    for p in producers_elem.findall("p"):
        p_id = p.attrib.get("id")
        producers[p_id] = {sub.tag: (sub.text or "").strip() for sub in p}

persons_elem = root.find("responsiblePersons")
if persons_elem is not None:
    for p in persons_elem.findall("p"):
        p_id = p.attrib.get("id")
        persons[p_id] = {sub.tag: (sub.text or "").strip() for sub in p}

def clean_text(text):
    if not text:
        return ""
    # Text replacements for common Wapromag export corruptions if any
    replacements = [
        ('tam', 'taśm'), ('Tam', 'Taśm'), ('tama', 'taśma'), ('Tama', 'Taśma'),
        ('oson', 'osłon'), ('Oson', 'Osłon'), ('mleczn', 'mleczną'),
        ('jasno', 'jasność'), ('Jasno', 'Jasność'), ('rednia', 'średnia'),
        ('dugo', 'długość'), ('zasilaczw', 'zasilaczy'), ('podczenie', 'podłączenie'),
        ('poczenie', 'połączenie'), ('szczelno', 'szczelność'), ('jako', 'jakość'),
        ('gwarancji', 'gwarancji'), ('ciepa', 'ciepła'), ('biaa', 'biała'), ('znieksztace', 'zniekształceń'),
        ('monta', 'montaż'), ('Monta', 'Montaż'), ('wykoczenie', 'wykończenie'),
        ('Wykoczenie', 'Wykończenie'), ('materia', 'materiał'), ('Materia', 'Materiał'),
        ('Napicie', 'Napięcie'), ('Dugo', 'Długość'), ('Dugo', 'Długość'),
        ('kolor osony', 'kolor osłony'), ('Kolor osony', 'Kolor osłony'),
        ('mleczn', 'mleczną'), ('przeznaczony do m...', 'przeznaczony do montażu...'),
        ('biay', 'biały'), ('czarny', 'czarny'), ('anodowany', 'anodowany')
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    # Fix any remaining stray  if simple rule applies
    text = re.sub(r'(\w)(\w)', r'\1ś\2', text) # fallback if needed
    text = text.replace('', '')
    return text.strip()

items_extracted = []

for o in root.findall("o"):
    item_id = o.attrib.get("id", "")
    url = o.attrib.get("url", "")
    price = o.attrib.get("price", "0")
    stock = o.attrib.get("stock", "0")
    avail = o.attrib.get("avail", "0")

    cat = ""
    cat_elem = o.find("cat")
    if cat_elem is not None and cat_elem.text:
        cat = cat_elem.text.strip()
    
    name = ""
    name_elem = o.find("name")
    if name_elem is not None and name_elem.text:
        name = name_elem.text.strip()

    desc = ""
    desc_elem = o.find("desc")
    if desc_elem is not None and desc_elem.text:
        desc = desc_elem.text.strip()

    # Images
    imgs = []
    imgs_elem = o.find("imgs")
    if imgs_elem is not None:
        main_img = imgs_elem.find("main")
        if main_img is not None and main_img.attrib.get("url"):
            imgs.append(main_img.attrib["url"])
        for i_img in imgs_elem.findall("i"):
            if i_img.attrib.get("url"):
                imgs.append(i_img.attrib["url"])

    # Attributes (attrs)
    attributes = {}
    producer_resp_id = None
    person_resp_id = None

    attrs_elem = o.find("attrs")
    if attrs_elem is not None:
        for a in attrs_elem.findall("a"):
            attr_name = a.attrib.get("name", "").strip()
            attr_val = (a.text or "").strip()
            attr_name_clean = clean_text(attr_name)
            attr_val_clean = clean_text(attr_val)
            
            if attr_name == "Producent odpowiedzialny":
                producer_resp_id = attr_val
            elif attr_name == "Podmiot odpowiedzialny":
                person_resp_id = attr_val
            
            attributes[attr_name_clean] = attr_val_clean

    # Clean name, cat, desc
    name_clean = clean_text(name)
    cat_clean = clean_text(cat)

    name_lower = name_clean.lower()
    cat_lower = cat_clean.lower()

    # Category matching logic
    target_category = None
    
    # 1. Taśmy LED: musi być taśmą i zawierać: premium, cob, delux, bread
    is_led_strip = ("taśm" in cat_lower or "taśm" in name_lower or "tasma" in name_lower or "taśmy" in cat_lower or "taśmy" in name_lower or "taśma" in name_lower)
    if is_led_strip and any(kw in name_lower for kw in ["premium", "cob", "delux", "bread"]):
        target_category = "Taśmy LED"

    # 2. Zasilacze LED scharfer
    elif ("zasilac" in cat_lower or "zasilac" in name_lower) and "scharfer" in name_lower:
        target_category = "Zasilacze LED Scharfer"

    # 3. Sterowniki LED całość
    elif "sterowni" in cat_lower or "sterowni" in name_lower or "sterowanie" in cat_lower:
        target_category = "Sterowniki LED"

    # 4. Akcesoria do taśm LED i zasilaczy całość
    elif "akcesoria do zasilaczy" in cat_lower or "akcesoria do taśm" in cat_lower or ("akcesoria" in cat_lower and ("zasilac" in cat_lower or "taśm" in cat_lower or "profil" in cat_lower)):
        target_category = "Akcesoria do taśm LED i zasilaczy"
    elif "akcesoria" in name_lower and ("zasilac" in name_lower or "taśm" in name_lower):
        target_category = "Akcesoria do taśm LED i zasilaczy"

    # 5. Koszulki silikonowe PRO całość
    elif "koszulk" in cat_lower or "koszulk" in name_lower or ("silikon" in name_lower and ("pro" in name_lower or "koszulk" in name_lower)):
        target_category = "Koszulki silikonowe PRO"

    if target_category:
        # Extract specific required fields
        ean = attributes.get("EAN", "")
        kod_produkt = attributes.get("Kod_produktu", attributes.get("Kod produktu", ""))
        kod_producenta = attributes.get("Kod_producenta", attributes.get("Kod producenta", ""))
        producent = attributes.get("Producent", "")
        
        # GPSR info
        gpsr_producer = producers.get(producer_resp_id, {}) if producer_resp_id else {}
        gpsr_person = persons.get(person_resp_id, {}) if person_resp_id else {}

        items_extracted.append({
            "id": item_id,
            "title": name_clean,
            "category": target_category,
            "xml_cat": cat_clean,
            "price": float(price) if price else 0.0,
            "compareAtPrice": round(float(price) * 1.2, 2) if price else 0.0,
            "stock": stock,
            "ean": ean,
            "kod_handlowy": kod_produkt,
            "kod_katalogowy": kod_producenta,
            "producent": producent,
            "description": desc,
            "images": imgs,
            "attributes": attributes,
            "gpsr": {
                "producer": gpsr_producer,
                "responsible_person": gpsr_person
            }
        })

print(f"Total matching items extracted: {len(items_extracted)}")

cat_summary = {}
for item in items_extracted:
    c = item["category"]
    cat_summary[c] = cat_summary.get(c, 0) + 1

for c, count in cat_summary.items():
    print(f"  Category '{c}': {count} products")

# Save a preview JSON
with open("extracted_products.json", "w", encoding="utf-8") as f:
    json.dump(items_extracted, f, ensure_ascii=False, indent=2)

print("Saved extracted_products.json")
