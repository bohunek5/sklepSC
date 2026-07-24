import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS
css_old = """    .mockup-blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      margin-top: 40px;
      max-width: 1800px;
      margin-left: auto;
      margin-right: auto;
    }
    @media (min-width: 1200px) {
      .mockup-blog-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }"""
    
css_new = """    .mockup-blog-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
      margin-top: 40px;
      max-width: 1800px;
      margin-left: auto;
      margin-right: auto;
    }
    @media (min-width: 1200px) {
      .mockup-blog-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    .blog-slider::-webkit-scrollbar { display: none; }
    .blog-slide-card {
      min-width: calc(50% - 15px);
      flex: 0 0 auto;
      scroll-snap-align: start;
    }
    @media (max-width: 768px) {
      .blog-slide-card { min-width: 100%; }
    }
    .slider-arrow:hover { background: rgba(255,255,255,0.9) !important; transform: translateY(-50%) scale(1.05) !important; }"""

content = content.replace(css_old, css_new)


# 2. Update HTML
html_start = """<div class="mockup-blog-grid">
<!-- Article 1 -->"""

html_end = """</div>
</section>
<!-- Advantages Section -->"""

# Extract the grid content
pattern = re.compile(r'<div class="mockup-blog-grid">(.*?)</div>\n</section>\n<!-- Advantages Section -->', re.DOTALL)
match = pattern.search(content)

if match:
    grid_inner = match.group(1)
    
    # We have 3 articles and 1 FAQ
    # Let's split by <!-- Article
    articles = grid_inner.split('<!-- Article')
    
    a1 = '<!-- Article' + articles[1]
    a2 = '<!-- Article' + articles[2]
    a3 = '<!-- Article' + articles[3]
    faq = '<!-- Article' + articles[4]
    
    # Add slide class to a1, a2, a3
    a1 = a1.replace('class="mockup-blog-card"', 'class="mockup-blog-card blog-slide-card"')
    a2 = a2.replace('class="mockup-blog-card"', 'class="mockup-blog-card blog-slide-card"')
    a3 = a3.replace('class="mockup-blog-card"', 'class="mockup-blog-card blog-slide-card"')
    
    # Wrap a1, a2, a3 in slider
    new_grid_inner = f"""
  <div class="blog-slider-wrapper" style="position: relative;">
     <button class="slider-arrow prev" onclick="document.getElementById('blogSlider').scrollBy({{left: -350, behavior: 'smooth'}})" style="position: absolute; left: -22px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; color: var(--primary-color); cursor: pointer; z-index: 10; box-shadow: 0 8px 20px rgba(0,0,0,0.1); transition: all 0.3s;"><i class="ph ph-caret-left" style="font-size: 20px;"></i></button>
     
     <div class="blog-slider" id="blogSlider" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 30px; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; padding: 10px 0;">
{a1}{a2}{a3}     </div>
     
     <button class="slider-arrow next" onclick="document.getElementById('blogSlider').scrollBy({{left: 350, behavior: 'smooth'}})" style="position: absolute; right: -22px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; color: var(--primary-color); cursor: pointer; z-index: 10; box-shadow: 0 8px 20px rgba(0,0,0,0.1); transition: all 0.3s;"><i class="ph ph-caret-right" style="font-size: 20px;"></i></button>
  </div>
{faq}"""
    
    content = content[:match.start()] + '<div class="mockup-blog-grid">\n' + new_grid_inner + '</div>\n</section>\n<!-- Advantages Section -->' + content[match.end():]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Success")
else:
    print("Could not find blog grid section")

