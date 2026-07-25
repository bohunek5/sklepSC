import codecs
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

with codecs.open(f'{workspace}/index.html', 'r', 'utf-8') as f:
    content = f.read()

# Wrap slider JS in an IIFE to prevent HMR crashes
js_start = "const slides = document.querySelectorAll('.slide');"
js_end = "// Initialize first slide transition on page load"

pattern = re.compile(re.escape(js_start) + r"(.*?)" + re.escape(js_end), re.DOTALL)

new_js = """(function initHeroSlider() {
      const slides = document.querySelectorAll('.slide');
      if (!slides || slides.length === 0) return;
      
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');
      const indicators = document.querySelectorAll('.hero-indicator');
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
  
        indicators.forEach((ind, i) => {
          if (i === currentSlide) ind.classList.add('active');
          else ind.classList.remove('active');
        });
  
        if (prevActive && prevActive !== activeSlide) {
          prevActive.classList.remove('active');
          prevActive.classList.add('leaving');
          prevActive.querySelectorAll('video').forEach(v => {
            v.pause();
            v.onended = null;
          });
        }
  
        activeSlide.classList.add('active');
        
        const isMobile = window.innerWidth <= 768;
        const activeVideo = isMobile ? (activeSlide.querySelector('video.mobile-bg') || activeSlide.querySelector('video')) : (activeSlide.querySelector('video.desktop-bg') || activeSlide.querySelector('video'));
        
        if (activeVideo) {
          activeVideo.currentTime = 0;
          activeVideo.onended = () => {
            showSlide(currentSlide + 1);
          };
          activeVideo.play().catch(err => {
            console.log("Autoplay blocked:", err);
          });
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
        // Remove old listeners by cloning
        const newPrev = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        newPrev.addEventListener('click', () => { showSlide(currentSlide - 1); });
      }
      
      if (nextBtn) {
        const newNext = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        newNext.addEventListener('click', () => { showSlide(currentSlide + 1); });
      }
      
      const freshIndicators = document.querySelectorAll('.hero-indicator');
      freshIndicators.forEach((ind, i) => {
        const newInd = ind.cloneNode(true);
        ind.parentNode.replaceChild(newInd, ind);
        newInd.addEventListener('click', () => {
          showSlide(i);
        });
      });
  
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { showSlide(0); });
      } else {
        showSlide(0);
      }
    })();
    // Initialize first slide transition on page load"""

if pattern.search(content):
    content = pattern.sub(new_js, content)
    print("JS matched and replaced!")
else:
    print("Could not match JS pattern")

# Fix hero-controls-bar CSS
css_fix = """      /* Slider Controls */
      .hero-controls-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* ADDED FIX */
      }"""
content = content.replace("""      /* Slider Controls */
      .hero-controls-bar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }""", css_fix)

with codecs.open(f'{workspace}/index.html', 'w', 'utf-8') as f:
    f.write(content)
