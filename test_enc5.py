import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("prescotcloud.xml", "rb") as f:
    full_data = f.read()

non_ascii = []
for i in range(3, len(full_data)): # Skip BOM
    byte = full_data[i]
    if byte > 127:
        non_ascii.append((i, byte, full_data[max(0, i-20):min(len(full_data), i+20)]))
        if len(non_ascii) >= 10:
            break

print("Non-ASCII occurrences after BOM:")
for i, byte, snip in non_ascii:
    print(f"Byte: {hex(byte)} ({byte}) | Snippet utf-8: {repr(snip.decode('utf-8', errors='replace'))}")
