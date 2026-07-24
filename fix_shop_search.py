with open('shop.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Remove the broken search pill completely
content = re.sub(r'<input type="text" id="mobileSearchInput" placeholder="Szukaj">.*?<button class="search-action-btn" id="mobileSearchAction"><i class="ph ph-magnifying-glass"></i></button>\s*</div>', '', content, flags=re.DOTALL)

with open('shop.html', 'w', encoding='utf-8') as f:
    f.write(content)
