import xml.etree.ElementTree as ET

tree = ET.parse("prescotcloud.xml")
root = tree.getroot()

print("Root attributes:", root.attrib)

# Find first few <o> elements
offers = root.findall("o")
print(f"Found {len(offers)} <o> elements.")

for i in range(min(3, len(offers))):
    o = offers[i]
    print(f"\n================ Offer {i+1} ================")
    print("Attributes:", o.attrib)
    for elem in o:
        print(f" Tag: {elem.tag}, Attributes: {elem.attrib}")
        if len(list(elem)) > 0:
            for sub in elem:
                print(f"   -> Subtag: {sub.tag}, Attributes: {sub.attrib}, Text: {repr((sub.text or '')[:60])}")
        else:
            text = (elem.text or "").strip()
            if len(text) > 100:
                text = text[:100] + "..."
            print(f"   Text: {repr(text)}")
