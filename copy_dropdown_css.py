import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# The mega menu CSS starts with /* MAGIC DROPDOWN - DESKTOP */
# Let's extract everything from /* MAGIC DROPDOWN - DESKTOP */ up to but not including /* End of mega menu */ or similar.
# In index.html, let's find the second occurrence (around line 3953) because it's the newer one.
matches = list(re.finditer(r'/\*\s*MAGIC DROPDOWN - DESKTOP\s*\*/.*?(?=(/\*|</style>))', index_content, flags=re.DOTALL))
if not matches:
    print("Could not find magic dropdown CSS in index.html")
    exit(1)

# We want the last match, which is the newest one.
mega_menu_css = matches[-1].group(0)

# But wait, it might stop at the next comment!
# Let's write a better regex to extract the whole block.
# Let's just find the exact block.
