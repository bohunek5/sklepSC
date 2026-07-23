with open("prescotcloud.xml", "rb") as f:
    full_data = f.read()

# Search for the string "anodowany" in raw bytes
pos = full_data.find(b"anodowany")
if pos != -1:
    snippet = full_data[max(0, pos-50):pos+100]
    print("Raw bytes snippet:", snippet)
    print("\nutf-8 (errors='replace'):", snippet.decode("utf-8", errors="replace"))
    print("\nwindows-1250:", snippet.decode("windows-1250", errors="replace"))
    print("\niso-8859-2:", snippet.decode("iso-8859-2", errors="replace"))
