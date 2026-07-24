import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS for .slide-bg
css_replacement = """    .slide-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      transform: scale(1.12);
      transition: transform 1.4s cubic-bezier(0.76, 0, 0.24, 1);
      object-fit: cover;
    }"""
content = re.sub(r'\s*\.slide-bg\s*\{\s*position: absolute;\s*top: 0;\s*left: 0;\s*width: 100%;\s*height: 100%;\s*background-size: cover;\s*background-position: center;\s*transform: scale\(1\.12\);\s*transition: transform 1\.4s cubic-bezier\(0\.76,\s*0,\s*0\.24,\s*1\);\s*\}', '\n' + css_replacement, content)

# 2. Add Bread and Digital CCT css
glow_css = """
    .slide[data-tech="digital"] .glass-border-svg .car {
      stroke: #ffffff;
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: buildDigital 4s linear forwards;
    }

    @keyframes buildDigital {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }

    .slide[data-tech="bread"] .glass-border-svg .car {
      stroke: #ffb347;
    }

    .slide[data-tech="digital_cct"] .glass-border-svg .car {
      stroke-dasharray: 6 10 6 10 6 62;
      animation: runTrack 3s linear infinite, cctColor 8s ease-in-out infinite alternate;
    }

    .slide[data-tech="mono"] .glass-border-svg .car {
      stroke: #ffea9f;
      animation: monoPulse 3s ease-in-out infinite alternate;
    }
    
    @keyframes monoPulse {
      0% { opacity: 0.3; stroke-width: 2px; }
      100% { opacity: 1; stroke-width: 4px; }
    }
"""
content = content.replace('.slide[data-tech="digital"] .glass-border-svg .car {', glow_css + '\n    /* OLD DIGITAL */\n    .old-digital {')

# 3. Replace the slides
new_slides = """    <!-- Slide 1: CCT -->
    <div class="slide active" data-tech="cct">
      <video class="slide-bg desktop-bg" src="/videos/cct_salon.mp4" autoplay loop muted playsinline></video>
      <video class="slide-bg mobile-bg" src="/videos/cct_salon.mp4" autoplay loop muted playsinline></video>
      <div class="slide-banner-box">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <h1>Taśmy LED CCT</h1>
        <p>Regulowana temperatura bieli.</p>
        <a href="/shop.html" class="mockup-btn">Kup teraz</a>
      </div>
    </div>

    <!-- Slide 2: Digital -->
    <div class="slide" data-tech="digital">
      <video class="slide-bg desktop-bg" src="/videos/cyfrowe_tasmy.mp4" autoplay loop muted playsinline></video>
      <video class="slide-bg mobile-bg" src="/videos/cyfrowe_tasmy.mp4" autoplay loop muted playsinline></video>
      <div class="slide-banner-box">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <h1>Inteligentne taśmy LED</h1>
        <p>Zyskaj pełną kontrolę i programuj efekty świetlne.</p>
        <a href="/shop.html" class="mockup-btn">Kup teraz</a>
      </div>
    </div>

    <!-- Slide 3: RGBW -->
    <div class="slide" data-tech="rgb">
      <video class="slide-bg desktop-bg" src="/videos/SALON%20RGBW%20CZAD.mp4" autoplay loop muted playsinline></video>
      <video class="slide-bg mobile-bg" src="/videos/SALON%20RGBW%20CZAD.mp4" autoplay loop muted playsinline></video>
      <div class="slide-banner-box">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <h1>Taśmy LED RGBW</h1>
        <p>Polska produkcja i aż 5 lat gwarancji.</p>
        <a href="/shop.html" class="mockup-btn">Kup teraz</a>
      </div>
    </div>

    <!-- Slide 4: Mono -->
    <div class="slide" data-tech="mono">
      <video class="slide-bg desktop-bg" src="/videos/sterownik_mono.mp4" autoplay loop muted playsinline></video>
      <video class="slide-bg mobile-bg" src="/videos/sterownik_mono.mp4" autoplay loop muted playsinline></video>
      <div class="slide-banner-box">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <h1>Sterowniki LED Mono</h1>
        <p>Steruj jasnością i dostosuj otoczenie do swoich potrzeb.</p>
        <a href="/shop.html" class="mockup-btn">Kup teraz</a>
      </div>
    </div>

    <!-- Slide 5: Bread -->
    <div class="slide" data-tech="bread">
      <video class="slide-bg desktop-bg" src="/videos/envato_video_gen_Oct_31_2025_17_15_42.mp4" autoplay loop muted playsinline></video>
      <video class="slide-bg mobile-bg" src="/videos/envato_video_gen_Oct_31_2025_17_15_42.mp4" autoplay loop muted playsinline></video>
      <div class="slide-banner-box">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <h1>Taśmy LED do pieczywa</h1>
        <p>Wypieki świeże i apetyczne w ciepłym świetle.</p>
        <a href="/shop.html" class="mockup-btn">Kup teraz</a>
      </div>
    </div>

    <!-- Slide 6: COB -->
    <div class="slide" data-tech="cob">
      <video class="slide-bg desktop-bg" src="/videos/ok%203.mp4" autoplay loop muted playsinline></video>
      <video class="slide-bg mobile-bg" src="/videos/ok%203.mp4" autoplay loop muted playsinline></video>
      <div class="slide-banner-box">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <h1>Taśmy LED COB</h1>
        <p>Idealnie jednolite linie światła bez punktów.</p>
        <a href="/shop.html" class="mockup-btn">Kup teraz</a>
      </div>
    </div>

    <!-- Slide 7: Digital CCT -->
    <div class="slide" data-tech="digital_cct">
      <video class="slide-bg desktop-bg" src="/videos/DIGITAL%20CCT%20EFEKT.mp4" autoplay loop muted playsinline></video>
      <video class="slide-bg mobile-bg" src="/videos/DIGITAL%20CCT%20EFEKT.mp4" autoplay loop muted playsinline></video>
      <div class="slide-banner-box">
        <svg class="glass-border-svg">
          <rect class="track" pathLength="100" />
          <rect class="car" pathLength="100" />
        </svg>
        <h1>Cyfrowe taśmy CCT</h1>
        <p>To Ty decydujesz o barwie i efektach.</p>
        <a href="/shop.html" class="mockup-btn">Kup teraz</a>
      </div>
    </div>"""

slides_regex = re.compile(r'<!-- Slide 1: Mono -->.*?<div class="slider-arrows">', re.DOTALL)
content = slides_regex.sub(new_slides + '\n\n    <div class="slider-arrows">', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
