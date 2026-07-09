import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace button styles
btn_css = """    .slide-banner-box .mockup-btn {
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 0.8s ease 1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s, background 0.3s, border-color 0.3s, color 0.3s;
      background: transparent;
      color: var(--white);
      border: 1px solid var(--white);
      padding: 15px 38px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-decoration: none;
      text-transform: uppercase;
      cursor: pointer;
      display: inline-block;
    }

    .slide-banner-box .mockup-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--accent-color);
      color: var(--accent-color);
    }

    @keyframes pulseBtn {
      0% { transform: scale(1); border-color: rgba(255,255,255,1); }
      50% { transform: scale(1.03); border-color: rgba(255,255,255,0.6); }
      100% { transform: scale(1); border-color: rgba(255,255,255,1); }
    }

    .slide.active .slide-banner-box h1,
    .slide.active .slide-banner-box p {
      opacity: 1;
      transform: translateY(0);
    }

    .slide.active .slide-banner-box .mockup-btn {
      opacity: 1;
      transform: translateY(0);
      animation: pulseBtn 2s infinite ease-in-out 1.8s;
    }"""

# Using regex to replace the old .mockup-btn CSS
content = re.sub(
    r'\.slide-banner-box \.mockup-btn \{.*?(?=\.slider-arrows \{)',
    btn_css + '\n\n    ',
    content,
    flags=re.DOTALL
)

# Replace the mono video
content = content.replace('/videos/sterownik_mono.mp4', '/videos/ok%20wieksza%20jasnosc.mp4')

# Fix slider timer: remove setInterval, handle video ended
js_replace = """    // Auto rotate slides when video ends
    slides.forEach((slide, idx) => {
      const desktopVideo = slide.querySelector('video.desktop-bg');
      const mobileVideo = slide.querySelector('video.mobile-bg');
      
      // Remove loop so ended event can fire
      if(desktopVideo) desktopVideo.removeAttribute('loop');
      if(mobileVideo) mobileVideo.removeAttribute('loop');

      if (desktopVideo) {
        desktopVideo.addEventListener('ended', () => {
          if(slide.classList.contains('active')) {
            showSlide(currentSlide + 1);
          }
        });
      }
    });

    // We also need to restart videos when a slide becomes active
    const originalShowSlide = showSlide;
    showSlide = function(index) {
      originalShowSlide(index);
      const activeSlide = slides[currentSlide];
      const desktopVideo = activeSlide.querySelector('video.desktop-bg');
      const mobileVideo = activeSlide.querySelector('video.mobile-bg');
      if(desktopVideo) {
        desktopVideo.currentTime = 0;
        desktopVideo.play();
      }
      if(mobileVideo) {
        mobileVideo.currentTime = 0;
        mobileVideo.play();
      }
    };"""

content = re.sub(r'// Auto rotate slides every 6 seconds.*?setInterval\(\(\) => \{.*?\}, 6000\);', js_replace, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
