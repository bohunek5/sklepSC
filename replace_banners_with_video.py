import codecs
import re

with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'r', 'utf-8') as f:
    html = f.read()

# We need to find all <div class="category-banner-bg" ...></div> inside the .mockup-banners section and replace them.
parts = html.split('<section class="mockup-banners"')
if len(parts) > 1:
    before = parts[0]
    after = '<section class="mockup-banners"' + parts[1]
    
    videos = [
        "cat_living",
        "cat_kitchen",
        "cat_bathroom",
        "cat_stairs",
        "cat_garden",
        "cat_office",
        "cat_showroom",
        "cat_bedroom"
    ]
    
    # regex to match the category-banner-bg div exactly
    pattern = re.compile(r'<div class="category-banner-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url\([^)]+\) center/cover no-repeat; transition: transform 0\.6s cubic-bezier\(0\.16, 1, 0\.3, 1\); pointer-events: none;"></div>')
    
    # Let's count matches to ensure we have exactly 8
    matches = pattern.findall(after)
    print(f"Found {len(matches)} category-banner-bg divs.")
    
    for i, v in enumerate(videos):
        replacement = f'<video class="category-banner-bg" src="videos/{v}.mp4#t=0,5" poster="images/{v}.png" autoplay loop muted playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;"></video>'
        after = pattern.sub(replacement, after, count=1)
        
    html = before + after
    
    with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'w', 'utf-8') as f:
        f.write(html)
    print("Updated index.html to use videos.")
else:
    print("Could not find .mockup-banners")
