import urllib.request
import xml.etree.ElementTree as ET
import sys
import os

url = "https://prescot.wapromag.pl/prescotcloud.xml"
xml_path = "prescotcloud.xml"

print(f"Downloading XML from {url}...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response, open(xml_path, 'wb') as out_file:
        out_file.write(response.read())
    print("Download complete.")
except Exception as e:
    print(f"Error downloading XML: {e}")
    sys.exit(1)

print("Parsing XML structure...")
try:
    tree = ET.parse(xml_path)
    root = tree.getroot()
    print(f"Root tag: {root.tag}")
    
    # Inspect children
    children_tags = set(child.tag for child in root)
    print(f"Child tags under root: {children_tags}")

    # Inspect first few product items
    items = list(root)
    print(f"Total items in root: {len(items)}")
    
    for i in range(min(5, len(items))):
        item = items[i]
        print(f"\n--- Item {i+1} ({item.tag}) ---")
        for sub in item:
            text = (sub.text or "").strip()
            if len(text) > 80:
                text = text[:80] + "..."
            print(f"  {sub.tag}: {text}")
            
except Exception as e:
    print(f"Error parsing XML: {e}")
