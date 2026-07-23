with open("prescotcloud.xml", "rb") as f:
    full_data = f.read()

non_ascii = []
for i, byte in enumerate(full_data):
    if byte > 127:
        non_ascii.append((i, byte, full_data[max(0, i-20):min(len(full_data), i+20)]))
        if len(non_ascii) >= 5:
            break

print(f"Total non-ASCII occurrences tested. First 5:")
for i, byte, snip in non_ascii:
    print(f"Byte: {hex(byte)} ({byte}) | Snippet: {snip}")
    print(" utf-8:", snip.decode("utf-8", errors="replace"))
    print(" win-1250:", snip.decode("windows-1250", errors="replace"))

