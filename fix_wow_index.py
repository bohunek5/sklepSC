import re

html_path = 'd:/MY-AI-AGENTS/sklepSC/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ADD MISSING SLIDES
# Let's insert COB, RGB, Silicone, and CRI97 to the slides.
# We will insert them right after the `<section class="mockup-hero-slider"> ... <svg...>`
# Wait, let's just replace the entire `<section class="mockup-hero-slider">` up to the end of it.
# It's better to dynamically inject the slides.
cob_slide = '''<!-- Slide 1: COB -->
<div class="slide active" data-tech="cob">
<div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
<div class="slide-video desktop-bg" style="width: 100%; height: 100%; background: url('images/hero_cob.webp') center/cover;"></div>
<div class="slide-video mobile-bg" style="width: 100%; height: 100%; background: url('images/hero_cob.webp') center/cover;"></div>
</div>
<div class="slide-banner-box" style="z-index: 2;">
<svg class="glass-border-svg">
<rect class="track" pathlength="100"></rect>
<rect class="car" pathlength="100"></rect>
</svg>
<div class="banner-text">
<h1>Taśmy LED Premium</h1>
<p>Niezawodne oświetlenie COB z linią światła bez punktów</p>
</div>
<a class="mockup-btn" href="shop.html"><div class="btn-slide-wrap"><span class="btn-txt-default">Kup teraz</span><span class="btn-txt-hover">Kup teraz</span></div></a>
</div>
</div>
'''

rgb_slide = '''<!-- Slide: RGB -->
<div class="slide" data-tech="rgb">
<div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
<div class="slide-video desktop-bg" style="width: 100%; height: 100%; background: url('images/hero_rgb.webp') center/cover;"></div>
<div class="slide-video mobile-bg" style="width: 100%; height: 100%; background: url('images/hero_rgb.webp') center/cover;"></div>
</div>
<div class="slide-banner-box" style="z-index: 2;">
<svg class="glass-border-svg">
<rect class="track" pathlength="100"></rect>
<rect class="car" pathlength="100"></rect>
</svg>
<div class="banner-text">
<h1>Taśmy LED RGB</h1>
<p>Miliony kolorów, nieskończone możliwości aranżacji</p>
</div>
<a class="mockup-btn" href="shop.html"><div class="btn-slide-wrap"><span class="btn-txt-default">Kup teraz</span><span class="btn-txt-hover">Kup teraz</span></div></a>
</div>
</div>
'''

silicone_slide = '''<!-- Slide: Silicone -->
<div class="slide" data-tech="silicone">
<div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
<div class="slide-video desktop-bg" style="width: 100%; height: 100%; background: url('images/hero_rgbcct.webp') center/cover;"></div>
<div class="slide-video mobile-bg" style="width: 100%; height: 100%; background: url('images/hero_rgbcct.webp') center/cover;"></div>
</div>
<div class="slide-banner-box" style="z-index: 2;">
<svg class="glass-border-svg">
<rect class="track" pathlength="100"></rect>
<rect class="car" pathlength="100"></rect>
</svg>
<div class="banner-text">
<h1>Neony Silikonowe</h1>
<p>Idealne kształty i pełna wodoodporność IP67</p>
</div>
<a class="mockup-btn" href="shop.html"><div class="btn-slide-wrap"><span class="btn-txt-default">Kup teraz</span><span class="btn-txt-hover">Kup teraz</span></div></a>
</div>
</div>
'''

cri97_slide = '''<!-- Slide: CRI97 -->
<div class="slide" data-tech="cri97">
<div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
<div class="slide-video desktop-bg" style="width: 100%; height: 100%; background: url('images/hero_scharfer.webp') center/cover;"></div>
<div class="slide-video mobile-bg" style="width: 100%; height: 100%; background: url('images/hero_scharfer.webp') center/cover;"></div>
</div>
<div class="slide-banner-box" style="z-index: 2;">
<svg class="glass-border-svg">
<rect class="track" pathlength="100"></rect>
<rect class="car" pathlength="100"></rect>
</svg>
<div class="banner-text">
<h1>Naturalne Barwy</h1>
<p>Wskaźnik oddawania barw CRI &gt; 97 dla perfekcyjnych detali</p>
</div>
<a class="mockup-btn" href="shop.html"><div class="btn-slide-wrap"><span class="btn-txt-default">Kup teraz</span><span class="btn-txt-hover">Kup teraz</span></div></a>
</div>
</div>
'''

# We need to remove the "active" class from the CCT slide since COB will be the first one.
html = html.replace('<div class="slide active" data-tech="cct">', '<div class="slide" data-tech="cct">')
# Inject the new slides before the CCT slide
inject_marker = '<!-- Slide 1: CCT -->'
html = html.replace(inject_marker, cob_slide + '\n' + rgb_slide + '\n' + silicone_slide + '\n' + cri97_slide + '\n' + inject_marker)

# 2. UPGRADE CATEGORY CARDS
# We will inject the glass-border-svg into every category-banner-card
# and add CSS to animate them on hover.
category_glass_svg = '''
  <svg class="glass-border-svg" style="z-index: 1;">
    <rect class="track" pathlength="100"></rect>
    <rect class="car" pathlength="100"></rect>
  </svg>
'''
# Find all occurrences of `<div class="category-banner-overlay"></div>`
# and replace them with the overlay + the svg
html = html.replace('<div class="category-banner-overlay"></div>', 
                    '<div class="category-banner-overlay"></div>' + category_glass_svg)

# Add styles for the category glass border
category_styles = '''
    /* CATEGORY WOW EFFECT */
    .category-banner-card {
      position: relative;
    }
    .category-banner-card .glass-border-svg {
      opacity: 0;
      transition: opacity 0.4s ease;
      border-radius: 12px;
    }
    .category-banner-card:hover .glass-border-svg {
      opacity: 1;
    }
    .category-banner-card .glass-border-svg .car {
      stroke: #ff5a00;
      stroke-width: 3px;
      animation: runTrack 3s linear infinite;
    }
    .category-banner-card:hover .category-banner-bg {
      transform: scale(1.05);
      filter: brightness(1.2);
    }
    .category-banner-card:hover {
      box-shadow: 0 25px 50px rgba(255, 90, 0, 0.15) !important;
      transform: translateY(-5px);
    }
'''

# Inject styles into the `<style>` tag. Let's find `/* Different frame animations for each slide */`
html = html.replace('/* Different frame animations for each slide */', category_styles + '\n    /* Different frame animations for each slide */')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Index.html updated with wow banners and categories.")
