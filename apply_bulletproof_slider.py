import codecs
import os
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'
index_path = os.path.join(workspace, 'index.html')

with codecs.open(index_path, 'r', 'utf-8') as f:
    content = f.read()

# 1. Update CSS for .slide transitions to be 100% reliable opacity cross-fade
old_css_pattern = re.compile(r'\.slide\s*\{[^}]*\}[\s\S]*?\.slide\.leaving\s*\{[^}]*\}', re.DOTALL)

new_slide_css = """.slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      opacity: 0;
      visibility: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 0 40px 80px 40px;
      transition: opacity 1.2s ease-in-out, visibility 1.2s ease-in-out;
      pointer-events: none;
    }

    .slide.active {
      opacity: 1;
      visibility: visible;
      z-index: 10;
      pointer-events: auto;
    }

    .slide.leaving {
      opacity: 0;
      visibility: visible;
      z-index: 5;
      transition: opacity 1.2s ease-in-out;
    }"""

content = old_css_pattern.sub(new_slide_css, content)

# 2. Replace initHeroSlider JS block with bulletproof interval logic
js_start = "(function initHeroSlider() {"
js_end = "})();"

pattern = re.compile(re.escape(js_start) + r"(.*?)" + re.escape(js_end), re.DOTALL)

bulletproof_js = """(function initHeroSlider() {
      const slides = document.querySelectorAll('.slide');
      if (!slides || slides.length === 0) return;

      let currentSlide = 0;
      let slideTimer = null;

      function startAutoSlide() {
        stopAutoSlide();
        slideTimer = setInterval(() => {
          showSlide((currentSlide + 1) % slides.length);
        }, 5000);
      }

      function stopAutoSlide() {
        if (slideTimer) {
          clearInterval(slideTimer);
          slideTimer = null;
        }
      }

      function showSlide(targetIndex) {
        currentSlide = (targetIndex + slides.length) % slides.length;

        slides.forEach((slide, i) => {
          if (i === currentSlide) {
            slide.classList.add('active');
            slide.classList.remove('leaving');
            slide.querySelectorAll('video').forEach(v => {
              try {
                v.currentTime = 0;
                v.play().catch(() => {});
              } catch(e) {}
            });
          } else {
            if (slide.classList.contains('active')) {
              slide.classList.add('leaving');
              setTimeout(() => slide.classList.remove('leaving'), 1200);
            }
            slide.classList.remove('active');
            slide.querySelectorAll('video').forEach(v => {
              try { v.pause(); } catch(e) {}
            });
          }
        });

        // Update indicators
        document.querySelectorAll('.hero-indicator').forEach((ind, i) => {
          if (i === currentSlide) ind.classList.add('active');
          else ind.classList.remove('active');
        });

        startAutoSlide();
      }

      // Event delegation for arrows and indicators
      document.addEventListener('click', (e) => {
        const prevBtn = e.target.closest('#prevSlide');
        if (prevBtn) {
          e.preventDefault();
          showSlide(currentSlide - 1);
          return;
        }

        const nextBtn = e.target.closest('#nextSlide');
        if (nextBtn) {
          e.preventDefault();
          showSlide(currentSlide + 1);
          return;
        }

        const indicator = e.target.closest('.hero-indicator');
        if (indicator) {
          e.preventDefault();
          const idx = parseInt(indicator.getAttribute('data-index') || '0', 10);
          showSlide(idx);
          return;
        }
      });

      // Start slider immediately or on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { showSlide(0); });
      } else {
        showSlide(0);
      }
    })();"""

if pattern.search(content):
    content = pattern.sub(bulletproof_js, content)
    print("Replaced slider JS with bulletproof interval logic.")
else:
    print("Could not find pattern for initHeroSlider JS.")

with codecs.open(index_path, 'w', 'utf-8') as f:
    f.write(content)
