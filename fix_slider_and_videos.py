import codecs
import os
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'
index_path = os.path.join(workspace, 'index.html')

with codecs.open(index_path, 'r', 'utf-8') as f:
    content = f.read()

# 1. Add loop attribute to all hero slide video tags
content = content.replace('muted autoplay playsinline preload="auto"', 'muted autoplay loop playsinline preload="auto"')

# 2. Clean up slider JS logic
js_start = "(function initHeroSlider() {"
js_end = "})();"

pattern = re.compile(re.escape(js_start) + r"(.*?)" + re.escape(js_end), re.DOTALL)

clean_js = """(function initHeroSlider() {
      const slides = document.querySelectorAll('.slide');
      if (!slides || slides.length === 0) return;
      
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');
      let currentSlide = 0;
      let slideTimeout = null;
  
      function showSlide(index) {
        if (slideTimeout) {
          clearTimeout(slideTimeout);
          slideTimeout = null;
        }
  
        const prevActive = document.querySelector('.slide.active');
        
        currentSlide = (index + slides.length) % slides.length;
        const activeSlide = slides[currentSlide];
  
        // Query indicators directly from DOM
        const indicators = document.querySelectorAll('.hero-indicator');
        indicators.forEach((ind, i) => {
          if (i === currentSlide) ind.classList.add('active');
          else ind.classList.remove('active');
        });
  
        if (prevActive && prevActive !== activeSlide) {
          prevActive.classList.remove('active');
          prevActive.classList.add('leaving');
          prevActive.querySelectorAll('video').forEach(v => {
            v.pause();
          });
        }
  
        activeSlide.classList.add('active');
        
        const isMobile = window.innerWidth <= 768;
        const activeVideo = isMobile ? (activeSlide.querySelector('video.mobile-bg') || activeSlide.querySelector('video')) : (activeSlide.querySelector('video.desktop-bg') || activeSlide.querySelector('video'));
        
        if (activeVideo) {
          try {
            activeVideo.currentTime = 0;
            activeVideo.play().catch(err => { console.log("Autoplay blocked:", err); });
          } catch(e) {}
        }
        
        resetTimeout(5000);
  
        if (prevActive && prevActive !== activeSlide) {
          setTimeout(() => {
            slides.forEach(s => {
              if (s !== activeSlide) {
                s.classList.remove('leaving');
              }
            });
          }, 1400);
        }
      }
  
      function resetTimeout(duration) {
        if (slideTimeout) clearTimeout(slideTimeout);
        slideTimeout = setTimeout(() => {
          showSlide(currentSlide + 1);
        }, duration);
      }
  
      if (prevBtn) {
        prevBtn.onclick = (e) => { e.preventDefault(); showSlide(currentSlide - 1); };
      }
      
      if (nextBtn) {
        nextBtn.onclick = (e) => { e.preventDefault(); showSlide(currentSlide + 1); };
      }
      
      document.querySelectorAll('.hero-indicator').forEach((ind, i) => {
        ind.onclick = (e) => { e.preventDefault(); showSlide(i); };
      });
  
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { showSlide(0); });
      } else {
        showSlide(0);
      }
    })();"""

if pattern.search(content):
    content = pattern.sub(clean_js, content)
    print("Cleaned up initHeroSlider JS in index.html.")
else:
    print("Could not match initHeroSlider pattern.")

with codecs.open(index_path, 'w', 'utf-8') as f:
    f.write(content)
