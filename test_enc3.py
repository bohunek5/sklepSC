with open("prescotcloud.xml", "rb") as f:
    full_data = f.read()

# find "os" and check around it
pos = full_data.find(b"os")
while pos != -1:
    snippet = full_data[pos:pos+30]
    if b"slon" in snippet or b"s\xb3on" in snippet or b"s\xb9on" in snippet:
        print("Found snippet bytes:", snippet)
        print("utf-8 replace:", snippet.decode("utf-8", errors="replace"))
        print("windows-1250:", snippet.decode("windows-1250", errors="replace"))
        print("iso-8859-2:", snippet.decode("iso-8859-2", errors="replace"))
        break
    pos = full_data.find(b"os", pos+1)
