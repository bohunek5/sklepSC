import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_slides = """
    <!-- Slide NEW 1: Silicone Profiles -->
    <div class="slide" data-tech="silicone">
      <div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
        <div class="slide-video desktop-bg" style="width: 100%; height: 100%; background: url('images/silicone_led_pro.jpg') center/cover no-repeat; animation: kenBurns 15s infinite alternate ease-in-out;"></div>
      </div>
      <div class="slide-banner-box" style="z-index: 2;">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <div class="banner-text">
          <h1>Koszulki Silikonowe Pro</h1>
          <p>Idealne linie świetlne dla profesjonalistów</p>
        </div>
        <a href="shop.html" class="mockup-btn"><div class="btn-slide-wrap"><span class="btn-txt-default">Odkryj</span><span class="btn-txt-hover">Odkryj</span></div></a>
      </div>
    </div>
    
    <!-- Slide NEW 2: Accessories -->
    <div class="slide" data-tech="accessories">
      <div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
        <div class="slide-video desktop-bg" style="width: 100%; height: 100%; background: url('images/led_accessories.jpg') center/cover no-repeat; animation: kenBurns 15s infinite alternate ease-in-out;"></div>
      </div>
      <div class="slide-banner-box" style="z-index: 2;">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <div class="banner-text">
          <h1>Akcesoria do LED</h1>
          <p>Innowacyjne konstrukcje i systemy montażu</p>
        </div>
        <a href="shop.html" class="mockup-btn"><div class="btn-slide-wrap"><span class="btn-txt-default">Odkryj</span><span class="btn-txt-hover">Odkryj</span></div></a>
      </div>
    </div>
    
    <!-- Slide NEW 3: CRI 97 -->
    <div class="slide" data-tech="cri97">
      <div class="slide-video-container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 1;">
        <div class="slide-video desktop-bg" style="width: 100%; height: 100%; background: url('images/cri97_led_garden.jpg') center/cover no-repeat; animation: kenBurns 15s infinite alternate ease-in-out;"></div>
      </div>
      <div class="slide-banner-box" style="z-index: 2;">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <div class="banner-text">
          <h1>Taśmy CRI 97</h1>
          <p>Perfekcyjne oddanie naturalnych barw</p>
        </div>
        <a href="shop.html" class="mockup-btn"><div class="btn-slide-wrap"><span class="btn-txt-default">Odkryj</span><span class="btn-txt-hover">Odkryj</span></div></a>
      </div>
    </div>
    """
    
    css_animation = """
  <style>
    @keyframes kenBurns {
      0% { transform: scale(1); }
      100% { transform: scale(1.15); }
    }
  </style>
"""

    if '<!-- Slide NEW 1' not in content:
        # Insert CSS
        if 'kenBurns' not in content:
            content = content.replace('</head>', css_animation + '\n</head>')
        
        # Insert slides before RGBW slide
        content = content.replace('<!-- Slide 3: RGBW -->', new_slides + '\n    <!-- Slide 3: RGBW -->')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Hero slides added")
