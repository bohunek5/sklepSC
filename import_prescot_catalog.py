import xml.etree.ElementTree as ET
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

tree = ET.parse("prescotcloud.xml")
root = tree.getroot()

# Map producers and responsible persons for GPSR
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

extracted_products = []
category_counts = {}

for o in root.findall("o"):
    item_id = o.attrib.get("id", "")
    url = o.attrib.get("url", "")
    price = o.attrib.get("price", "0")
    stock = o.attrib.get("stock", "0")

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

    # Attributes
    attributes = {}
    producer_resp_id = None
    person_resp_id = None

    attrs_elem = o.find("attrs")
    if attrs_elem is not None:
        for a in attrs_elem.findall("a"):
            attr_name = a.attrib.get("name", "").strip()
            attr_val = (a.text or "").strip()
            
            if attr_name == "Producent odpowiedzialny":
                producer_resp_id = attr_val
            elif attr_name == "Podmiot odpowiedzialny":
                person_resp_id = attr_val
            
            if attr_name:
                attributes[attr_name] = attr_val

    name_lower = name.lower()
    cat_lower = cat.lower()

    target_category = None

    # Filter 1: Taśmy LED które mają w nazwie: premium, cob, delux albo bread
    is_led_strip = "taśm" in cat_lower or "taśm" in name_lower or "tasma" in name_lower or "taśmy" in cat_lower or "taśma" in name_lower
    if is_led_strip and any(kw in name_lower for kw in ["premium", "cob", "delux", "bread"]):
        target_category = "Taśmy LED Premium / COB / Delux / Bread"

    # Filter 2: Zasilacze LED scharfer
    elif ("zasilacz" in cat_lower or "zasilacz" in name_lower) and "scharfer" in name_lower:
        target_category = "Zasilacze LED Scharfer"

    # Filter 3: Sterowniki LED całość
    elif "sterownik" in cat_lower or "sterownik" in name_lower or "sterowanie" in cat_lower:
        target_category = "Sterowniki LED"

    # Filter 4: Akcesoria do taśm LED i zasilaczy całość
    elif "akcesoria do zasilaczy" in cat_lower or "akcesoria do taśm" in cat_lower or ("akcesoria" in cat_lower and ("zasilacz" in cat_lower or "taśm" in cat_lower or "led" in cat_lower)):
        target_category = "Akcesoria do taśm LED i zasilaczy"
    elif "akcesoria" in name_lower and ("zasilacz" in name_lower or "taśm" in name_lower):
        target_category = "Akcesoria do taśm LED i zasilaczy"

    # Filter 5: Koszulki silikonowe PRO całość
    elif "koszulk" in cat_lower or "koszulk" in name_lower or ("silikon" in name_lower and ("pro" in name_lower or "koszulk" in name_lower)):
        target_category = "Koszulki silikonowe PRO"

    if target_category:
        ean = attributes.get("EAN", "")
        kod_handlowy = attributes.get("Kod_produktu", attributes.get("Kod produktu", ""))
        kod_katalogowy = attributes.get("Kod_producenta", attributes.get("Kod producenta", ""))
        producent = attributes.get("Producent", "Prescot LED")
        
        gpsr_producer = producers.get(producer_resp_id, {}) if producer_resp_id else {}
        gpsr_person = persons.get(person_resp_id, {}) if person_resp_id else {}

        item_data = {
            "id": int(item_id) if item_id.isdigit() else item_id,
            "title": name,
            "category": target_category,
            "original_category": cat,
            "price": float(price) if price else 0.0,
            "compareAtPrice": round(float(price) * 1.15, 2) if price else 0.0,
            "stock": stock,
            "ean": ean,
            "kod_handlowy": kod_handlowy,
            "kod_katalogowy": kod_katalogowy,
            "producent": producent,
            "description": desc,
            "images": imgs,
            "attributes": attributes,
            "gpsr": {
                "producer": gpsr_producer,
                "responsible_person": gpsr_person
            }
        }

        extracted_products.append(item_data)
        category_counts[target_category] = category_counts.get(target_category, 0) + 1

print(f"=== Total extracted matching products: {len(extracted_products)} ===")
for cat_name, count in category_counts.items():
    print(f"  • {cat_name}: {count} szt.")

# Save full JSON data file
output_json_path = os.path.join("js", "prescot-imported-products.json")
with open(output_json_path, "w", encoding="utf-8") as f:
    json.dump(extracted_products, f, ensure_ascii=False, indent=2)

print(f"\nSaved products database to {output_json_path}")
