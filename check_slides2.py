import re

with open('d:/MY-AI-AGENTS/sklepSC/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

slides = re.findall(r'<div class=\"slide\"(.*?)</div>\s*</div>\s*(?:</a>|</div>)', html, re.DOTALL)
print('Found:', len(slides))

for i, s in enumerate(slides):
    title = re.search(r'<h1[^>]*>(.*?)</h1>|<h2[^>]*>(.*?)</h2>', s, re.IGNORECASE)
    t = title.group(1) or title.group(2) if title else 'No Title'
    t = re.sub(r'<[^>]+>', '', t).strip()
    
    vid = re.search(r'<video[^>]*src=\"([^\"]+)\"', s)
    v = vid.group(1) if vid else 'No Video'
    
    print(f'Slide {i+1}: {t} | Video: {v}')
