with open("prescotcloud.xml", "rb") as f:
    data = f.read(5000)

for enc in ["utf-8", "windows-1250", "iso-8859-2", "cp1250"]:
    try:
        decoded = data.decode(enc)
        print(f"=== Encoding: {enc} ===")
        # Find some text with polish letters
        lines = [line for line in decoded.splitlines() if "Ta" in line or "Profil" in line or "os" in line]
        for line in lines[:5]:
            print(" ", line[:100])
    except Exception as e:
        print(f"=== Encoding: {enc} -> Error: {e}")
