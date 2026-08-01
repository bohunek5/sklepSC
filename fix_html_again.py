import os
import re

# We created prescot-pattern-white.png, let's use it as it requires no CSS filters
html_files = [f for f in os.listdir('.') if f.endswith('.html')]

target_icon = '<img class="gemini-icon" src="images/prescot-pattern.png" style="width: 24px; height: 24px; object-fit: contain; margin-bottom: 4px; filter: brightness(0) invert(1);">'
new_icon = '<img class="gemini-icon" src="images/prescot-pattern-white.png" style="width: 24px; height: 24px; object-fit: contain; margin-bottom: 2px;">'

target_icon_2 = '<img class="gemini-icon" src="images/prescot-pattern.png" style="width: 18px; height: 18px; object-fit: contain; margin-right: 6px; vertical-align: middle;">'
new_icon_2 = '<img class="gemini-icon" src="images/prescot-pattern-white.png" style="width: 18px; height: 18px; object-fit: contain; margin-right: 6px; vertical-align: middle; filter: brightness(0);">' # black version for desktop header? Wait, let's keep it simple.

for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Bottom nav and mobile side menu
    new_content = content.replace(target_icon, new_icon)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {html_file}")

