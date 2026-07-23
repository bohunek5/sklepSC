import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

json_path = os.path.join("js", "prescot-imported-products.json")
with open(json_path, "r", encoding="utf-8") as f:
    products = json.load(f)

attr_keys = {}
for p in products:
    for k, v in p.get("attributes", {}).items():
        attr_keys[k] = attr_keys.get(k, 0) + 1

print("Top attributes in database:")
sorted_keys = sorted(attr_keys.items(), key=lambda x: x[1], reverse=True)
for k, count in sorted_keys[:30]:
    print(f"  • '{k}': {count} products")

# Check values for specific interesting keys
interesting = ["Napięcie wejściowe", "Montaż", "Barwa światła", "Klasa szczelności", "Strumień świetlny", "Moc", "Jasność"]

for key in interesting:
    vals = {}
    for p in products:
        v = p.get("attributes", {}).get(key)
        if v:
            vals[v] = vals.get(v, 0) + 1
    if vals:
        print(f"\nValues for '{key}':")
        for v, count in sorted(vals.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   - '{v}': {count}")
