import glob

html_files = glob.glob("*.html")
for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "/* --- OVERRIDE MENU STYLES START --- */" in content:
        start_idx = content.find("/* --- OVERRIDE MENU STYLES START --- */")
        end_idx = content.find("/* --- OVERRIDE MENU STYLES END --- */") + len("/* --- OVERRIDE MENU STYLES END --- */")
        content = content[:start_idx] + content[end_idx:]
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
print("Removed bad override!")
