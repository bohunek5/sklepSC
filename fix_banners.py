import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# I will just write a simple regex to capture the 6 banners
def replace_banner(match):
    span1 = match.group(1) # <span style="font-size: 10px...
    span1 = span1.replace("font-size: 10px", "font-size: 13px")
    h3 = match.group(2) # <h3...
    p = match.group(3) # <p... or empty if no p
    btn = match.group(4) # <span class="glass-banner-btn"...
    
    p_str = p.replace('max-width: 440px;', 'max-width: 100%;') if p else ""

    # new layout: button on left, text on right
    new_html = f'''        <div style="position: relative; z-index: 2; width: 100%; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;">
          {btn}
          <div style="text-align: right; max-width: 70%; display: flex; flex-direction: column; align-items: flex-end;">
            {span1}
            {h3}
            {p_str}
          </div>
        </div>'''
    return new_html

pattern = re.compile(
    r'<div style="position: relative; z-index: 2; width: 100%;">\s*'
    r'(<span style="font-size: 10px;[^>]+>.*?</span>)\s*'
    r'(<h3[^>]+>.*?</h3>)\s*'
    r'(<p[^>]+>.*?</p>)?\s*'
    r'(<span class="glass-banner-btn"[^>]*>.*?</span>)\s*'
    r'</div>', re.DOTALL
)

new_content = pattern.sub(replace_banner, content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_content)
    
print("Updated banners in index.html")
