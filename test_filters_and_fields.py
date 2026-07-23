import xml.etree.ElementTree as ET

# Read raw bytes to check encoding declaration
with open("prescotcloud.xml", "rb") as f:
    first_line = f.readline()
    print("XML Header:", first_line)

tree = ET.parse("prescotcloud.xml")
root = tree.getroot()

# Map producers and responsible persons
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

print(f"Loaded {len(producers)} producers, {len(persons)} responsible persons.")
if producers:
    sample_pid = list(producers.keys())[0]
    print(f"Producer sample ({sample_pid}):", producers[sample_pid])

# Now test filters requested by user:
# 1. Taśmy LED które mają w nazwie: premium, coB, delux albo bread
# 2. Zasilacze LED scharfer
# 3. Sterowniki LED całość
# 4. Akcesoria do taśm LED i zasilaczy całość
# 5. Koszulki silikonowe pro całość

matched_counts = {
    "tasmy_led": 0,
    "zasilacze_scharfer": 0,
    "sterowniki_led": 0,
    "akcesoria": 0,
    "koszulki_silikonowe": 0,
    "other": 0
}

sample_matched = {k: [] for k in matched_counts.keys()}

for o in root.findall("o"):
    cat = ""
    cat_elem = o.find("cat")
    if cat_elem is not None and cat_elem.text:
        cat = cat_elem.text.strip()
    
    name = ""
    name_elem = o.find("name")
    if name_elem is not None and name_elem.text:
        name = name_elem.text.strip()
        
    name_lower = name.lower()
    cat_lower = cat.lower()

    matched_group = None
    
    # 1. Taśmy LED
    if "taśm" in cat_lower or "tasmu" in cat_lower or "taśma" in name_lower or "tasma" in name_lower or "taśmy" in cat_lower or "taśmy" in name_lower:
        if any(kw in name_lower for kw in ["premium", "cob", "delux", "bread"]):
            matched_group = "tasmy_led"
    
    # 2. Zasilacze LED scharfer
    if not matched_group:
        if ("zasilacz" in cat_lower or "zasilacz" in name_lower) and "scharfer" in name_lower:
            matched_group = "zasilacze_scharfer"
            
    # 3. Sterowniki LED całość
    if not matched_group:
        if "sterownik" in cat_lower or "sterownik" in name_lower or "sterowanie" in cat_lower:
            matched_group = "sterowniki_led"

    # 4. Akcesoria do taśm LED i zasilaczy całość
    if not matched_group:
        if "akcesoria" in cat_lower or "akcesoria" in name_lower:
            matched_group = "akcesoria"
            
    # 5. Koszulki silikonowe pro całość
    if not matched_group:
        if "koszulk" in cat_lower or "koszulk" in name_lower or ("silikon" in name_lower and "pro" in name_lower):
            matched_group = "koszulki_silikonowe"

    if matched_group:
        matched_counts[matched_group] += 1
        if len(sample_matched[matched_group]) < 3:
            sample_matched[matched_group].append((name, cat))

print("\nMatched counts:")
for k, v in matched_counts.items():
    print(f"  {k}: {v}")
    for name, cat in sample_matched[k]:
        print(f"     - Name: {name} | Cat: {cat}")
