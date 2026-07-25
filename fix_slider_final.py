import codecs
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

with codecs.open(f'{workspace}/index.html', 'r', 'utf-8') as f:
    content = f.read()

# 1. Remove 'loop ' from video tags so they can end
content = content.replace('muted autoplay loop playsinline', 'muted autoplay playsinline')

# 2. Rewrite JS logic using Regex
js_start = "const slides = document.querySelectorAll('.slide');"
js_end = "// Initialize first slide transition on page load"

pattern = re.compile(re.escape(js_start) + r"(.*?)" + re.escape(js_end), re.DOTALL)

new_js = """const slides = document.querySelectorAll('.slide');
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
  
        // Update indicators
        indicators.forEach((ind, i) => {
          if (i === currentSlide) ind.classList.add('active');
          else ind.classList.remove('active');
        });
  
        if (prevActive && prevActive !== activeSlide) {
          prevActive.classList.remove('active');
          prevActive.classList.add('leaving');
          // Pause videos and remove ended event listener
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
        
        // Always force switch after exactly 5 seconds
        resetTimeout(5000);
  
        // Clean up leaving class after transition finishes
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
  
      if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); });
      if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); });
      
      indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
          showSlide(i);
        });
      });
  
      // Initialize first slide transition on page load"""

if pattern.search(content):
    content = pattern.sub(new_js, content)
    print("JS matched and replaced!")
else:
    print("Could not match JS pattern")

with codecs.open(f'{workspace}/index.html', 'w', 'utf-8') as f:
    f.write(content)
