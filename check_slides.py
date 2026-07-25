import re

with open('d:/MY-AI-AGENTS/sklepSC/index.html', 'r', encoding='utf-8') as f:
    html = f.read()
    
# Let's find slide titles. They might be in <h1 class="..."> or <h2 class="...">
# or we can just extract everything that looks like a title in the hero section.
matches = re.findall(r'<h1[^>]*>(.*?)</h1>|<h2[^>]*>(.*?)</h2>', html, re.IGNORECASE)
for i, m in enumerate(matches):
    title = m[0] if m[0] else m[1]
    title = re.sub(r'<[^>]+>', '', title).strip()
    if title:
        print(f'{i+1}. {title}')
