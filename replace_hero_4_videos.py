import re
import codecs

workspace = r'd:\MY-AI-AGENTS\sklepSC'

with codecs.open(f'{workspace}/index.html', 'r', 'utf-8') as f:
    content = f.read()

# Extract the mockup-hero-slider section
slider_match = re.search(r'(<section class="mockup-hero-slider">)(.*?)(</section>)', content, flags=re.DOTALL)
if slider_match:
    start_tag = slider_match.group(1)
    inner_html = slider_match.group(2)
    end_tag = slider_match.group(3)
    
    svg_defs_match = re.search(r'<svg style="position: absolute; width: 0; height: 0; pointer-events: none;">.*?</svg>', inner_html, flags=re.DOTALL)
    controls_match = re.search(r'<div class="hero-controls-bar">.*', inner_html, flags=re.DOTALL)
    
    svg_defs = svg_defs_match.group(0) if svg_defs_match else ''
    controls = controls_match.group(0) if controls_match else ''
    
    slides_data = [
        {"id": "living", "title": "Salon & Elegancja", "desc": "Zjawiskowe oświetlenie nocne", "img": "hero_living_room"},
        {"id": "kitchen", "title": "Kuchenny Minimalizm", "desc": "Czyste światło do pracy", "img": "hero_kitchen"},
        {"id": "office", "title": "Nowoczesne Biuro", "desc": "Przestrzeń, która inspiruje", "img": "hero_office"},
        {"id": "stairs", "title": "Oświetlenie Schodów", "desc": "Bezpieczeństwo i styl", "img": "hero_staircase"}
    ]
    
    slides_html = ""
    for i, data in enumerate(slides_data):
        active_class = ' active' if i == 0 else ''
        slides_html += f"""
  <!-- Slide {i+1}: {data['title']} -->
  <div class="slide{active_class}" data-tech="{data['id']}">
    <div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
      <video class="slide-video desktop-bg" muted playsinline preload="auto" src="videos/{data['img']}.mp4" style="width: 100%; height: 100%; object-fit: cover;"></video>
      <video class="slide-video mobile-bg" muted playsinline preload="auto" src="videos/{data['img']}.mp4" style="width: 100%; height: 100%; object-fit: cover;"></video>
    </div>
    <div class="slide-banner-box" style="z-index: 2;">
      <svg class="glass-border-svg">
        <rect class="track" pathlength="100"></rect>
        <rect class="car" pathlength="100"></rect>
      </svg>
      <div class="banner-text">
        <h1>{data['title']}</h1>
        <p>{data['desc']}</p>
      </div>
      <a class="mockup-btn" href="shop.html"><div class="btn-slide-wrap"><span class="btn-txt-default">Odkryj</span><span class="btn-txt-hover">Odkryj</span></div></a>
    </div>
  </div>
"""

    if controls:
        indicators_html = ""
        for i in range(4):
            active_class = ' active' if i == 0 else ''
            indicators_html += f'      <div class="hero-indicator{active_class}" data-index="{i}"></div>\n'
        
        if '<div class="hero-indicators">' in controls:
            controls = re.sub(r'<div class="hero-indicators">.*?</div>', f'<div class="hero-indicators">\n{indicators_html}    </div>', controls, flags=re.DOTALL)
        else:
            # Inject indicators before the scroll arrow
            controls = controls.replace('<a class="scroll-down-arrow"', f'<div class="hero-indicators" style="position: absolute; bottom: 30px; width: 100%; display: flex; justify-content: center; gap: 8px; z-index: 20; pointer-events: none;">\n{indicators_html}    </div>\n  <a class="scroll-down-arrow"')
            # We also need some CSS for the indicators
            css_indicators = """
<style>
.hero-indicator {
  width: 10px; height: 10px; background: rgba(255,255,255,0.3); border-radius: 50%;
  transition: all 0.3s ease; pointer-events: auto; cursor: pointer;
}
.hero-indicator.active {
  background: #fff; width: 30px; border-radius: 10px;
}
</style>
"""
            slides_html += css_indicators
            
    new_inner_html = f"\n  {svg_defs}\n{slides_html}\n  {controls}\n"
    new_section = f"{start_tag}{new_inner_html}{end_tag}"
    
    new_content = content.replace(slider_match.group(0), new_section)
    
    with codecs.open(f'{workspace}/index.html', 'w', 'utf-8') as f:
        f.write(new_content)
    print("Updated hero slider with 4 new videos")
else:
    print("Could not find mockup-hero-slider")
