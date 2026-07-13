import re

file = 'checkout.html'
with open(file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace InPost
content = content.replace('https://inpost.pl/sites/default/files/logo-inpost.svg', 'https://upload.wikimedia.org/wikipedia/commons/c/c5/InPost_logo.svg')

# Replace DPD
content = content.replace('https://upload.wikimedia.org/wikipedia/commons/b/b3/DPD_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/DPD_logo_%282015%29.svg')

# Replace Rohlig SUUS
content = content.replace('<img src="https://upload.wikimedia.org/wikipedia/commons/e/ea/Rohlig_SUUS_Logistics_logo.svg" alt="Rohlig SUUS" style="height: 22px; max-width: 90px; object-fit: contain;">', '<span style="font-weight:bold; color:#d22b2b;">SUUS</span>')

with open(file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed logos in checkout.html")
