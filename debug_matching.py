import xml.etree.ElementTree as ET
import sys

sys.stdout.reconfigure(encoding='utf-8')

tree = ET.parse("prescotcloud.xml")
root = tree.getroot()

for i, o in enumerate(root.findall("o")):
    cat_elem = o.find("cat")
    name_elem = o.find("name")
    cat = (cat_elem.text if cat_elem is not None else "") or ""
    name = (name_elem.text if name_elem is not None else "") or ""
    
    cat_lower = cat.lower()
    name_lower = name.lower()
    
    if "scharfer" in name_lower or "cob" in name_lower or "premium" in name_lower or "delux" in name_lower or "bread" in name_lower:
        print(f"Match {i}: Name='{name}' | Cat='{cat}'")
        if i > 200:
            break
