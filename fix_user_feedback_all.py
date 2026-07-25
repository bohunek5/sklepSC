import codecs
import os
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

# --- 1. Fix ai-shopping.html background watermark logo ---
ai_shop_path = os.path.join(workspace, 'ai-shopping.html')
with codecs.open(ai_shop_path, 'r', 'utf-8') as f:
    ai_content = f.read()

# Update .ai-hero::before to be static and clean
old_wm_pattern = re.compile(r'\.ai-hero::before\s*\{[^}]*\}', re.DOTALL)
new_wm_css = """.ai-hero::before {
      content: '';
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50vw;
      height: 50vw;
      max-width: 500px;
      max-height: 500px;
      background: url('images/logo-white.png') center/contain no-repeat;
      opacity: 0.035; /* Static clean faint watermark */
      z-index: 0;
      pointer-events: none;
    }"""
ai_content = old_wm_pattern.sub(new_wm_css, ai_content)

# Remove .ai-hero.typing::before rule
ai_content = re.sub(r'\.ai-hero\.typing::before\s*\{[^}]*\}', '', ai_content)

# Save ai-shopping.html
with codecs.open(ai_shop_path, 'w', 'utf-8') as f:
    f.write(ai_content)
print("Updated ai-shopping.html background logo watermark to be static and clean.")


# --- 2. Fix js/ai-agent.js buttons to use Prescot brand orange #ff5a00 & pill styling ---
ai_agent_path = os.path.join(workspace, 'js', 'ai-agent.js')
with codecs.open(ai_agent_path, 'r', 'utf-8') as f:
    agent_content = f.read()

# Replace made-up orange codes
agent_content = agent_content.replace('#e14f27', '#ff5a00')
agent_content = agent_content.replace('rgba(225, 79, 39, 0.4)', 'rgba(255, 90, 0, 0.4)')
agent_content = agent_content.replace('rgba(225, 79, 39, 0.1)', 'rgba(255, 90, 0, 0.1)')

# Update quick reply and add to cart button styles
agent_content = agent_content.replace("cta.className = 'pro-product-card ai-add-all-btn' + (isBought ? ' bought' : '');", "cta.className = 'mockup-btn ai-add-all-btn' + (isBought ? ' bought' : '');")

with codecs.open(ai_agent_path, 'w', 'utf-8') as f:
    f.write(agent_content)
print("Updated js/ai-agent.js with official brand orange and mockup-btn styling.")


# --- 3. Fix index.html slider JS to avoid playhead seek resets ---
index_path = os.path.join(workspace, 'index.html')
with codecs.open(index_path, 'r', 'utf-8') as f:
    index_content = f.read()

js_start = "(function initHeroSlider() {"
js_end = "})();"

pattern = re.compile(re.escape(js_start) + r"(.*?)" + re.escape(js_end), re.DOTALL)

clean_slider_js = """(function initHeroSlider() {
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
              try { v.play().catch(() => {}); } catch(e) {}
            });
          } else {
            if (slide.classList.contains('active')) {
              slide.classList.add('leaving');
              setTimeout(() => slide.classList.remove('leaving'), 1200);
            }
            slide.classList.remove('active');
          }
        });

        // Update indicators
        document.querySelectorAll('.hero-indicator').forEach((ind, i) => {
          if (i === currentSlide) ind.classList.add('active');
          else ind.classList.remove('active');
        });

        startAutoSlide();
      }

      // Attach direct event handlers to prev, next and indicators
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');

      if (prevBtn) {
        prevBtn.onclick = (e) => { e.preventDefault(); showSlide(currentSlide - 1); };
      }
      if (nextBtn) {
        nextBtn.onclick = (e) => { e.preventDefault(); showSlide(currentSlide + 1); };
      }

      document.querySelectorAll('.hero-indicator').forEach((ind, i) => {
        ind.onclick = (e) => { e.preventDefault(); showSlide(i); };
      });

      // Global click fallback for arrows/indicators
      document.addEventListener('click', (e) => {
        const prev = e.target.closest('#prevSlide');
        if (prev) { e.preventDefault(); showSlide(currentSlide - 1); }
        const next = e.target.closest('#nextSlide');
        if (next) { e.preventDefault(); showSlide(currentSlide + 1); }
        const ind = e.target.closest('.hero-indicator');
        if (ind) {
          e.preventDefault();
          const idx = parseInt(ind.getAttribute('data-index') || '0', 10);
          showSlide(idx);
        }
      });

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { showSlide(0); });
      } else {
        showSlide(0);
      }
    })();"""

if pattern.search(index_content):
    index_content = pattern.sub(clean_slider_js, index_content)
    print("Updated initHeroSlider in index.html.")

with codecs.open(index_path, 'w', 'utf-8') as f:
    f.write(index_content)

print("All fixes applied successfully.")
