import codecs
import re

workspace = r'd:\MY-AI-AGENTS\sklepSC'

with codecs.open(f'{workspace}/ai-shopping.html', 'r', 'utf-8') as f:
    content = f.read()

# Replace the pseudo-element CSS with the new HTML-based logo background CSS
old_css = """    /* Watermark background */
    .ai-hero::before {
      content: '';
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60vw;
      height: 60vw;
      max-width: 600px;
      max-height: 600px;
      background: url('images/logo-white.png') center/contain no-repeat;
      opacity: 0.02; /* Bardzo delikatny znak wodny */
      z-index: -1;
      pointer-events: none;
    }"""

new_css = """    /* Watermark Background with sweeping typing glow */
    .ai-bg-logo-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60vw;
      height: 60vw;
      max-width: 600px;
      max-height: 600px;
      z-index: -1;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .ai-bg-logo-base {
      position: absolute;
      width: 100%;
      height: auto;
      object-fit: contain;
      opacity: 0.02;
    }
    
    .ai-bg-logo-glow {
      position: absolute;
      width: 100%;
      height: auto;
      object-fit: contain;
      opacity: 0;
      /* Intense glowing orange color via filters */
      filter: brightness(0) saturate(100%) invert(48%) sepia(85%) saturate(2254%) hue-rotate(346deg) brightness(101%) contrast(106%) drop-shadow(0 0 20px rgba(225, 79, 39, 0.8));
      -webkit-mask-image: linear-gradient(to right, transparent 0%, transparent 40%, black 50%, transparent 60%, transparent 100%);
      -webkit-mask-size: 200% 100%;
      transition: opacity 0.3s ease;
    }

    .ai-bg-logo-glow.typing {
      opacity: 0.3; /* Gently glowing */
      animation: sweepGlow 1.2s linear infinite;
    }

    @keyframes sweepGlow {
      0% { -webkit-mask-position: 100% 0; }
      100% { -webkit-mask-position: 0% 0; }
    }"""

content = content.replace(old_css, new_css)

# Inject the HTML structure inside <section class="ai-hero">
html_to_inject = """<section class="ai-hero">
      <div class="ai-bg-logo-container">
        <img src="images/logo-white.png" class="ai-bg-logo-base" alt="">
        <img src="images/logo-white.png" class="ai-bg-logo-glow" alt="">
      </div>"""
      
content = content.replace('<section class="ai-hero">', html_to_inject)

# Inject JS for typing detection
js_to_inject = """<script>
    document.addEventListener('DOMContentLoaded', () => {
      // Header scroll logic
      const header = document.getElementById('siteHeader');
      function handleScroll() {
        if (window.scrollY > 40) {
          if (header) header.classList.add('scrolled');
        } else {
          if (header) header.classList.remove('scrolled');
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      // Typing background glow logic
      const aiChatInput = document.getElementById('aiChatInput');
      const glowLogo = document.querySelector('.ai-bg-logo-glow');
      let typingTimeout;

      if (aiChatInput && glowLogo) {
        aiChatInput.addEventListener('input', () => {
          glowLogo.classList.add('typing');
          clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => {
            glowLogo.classList.remove('typing');
          }, 400); // Effect lingers for 400ms after last keystroke
        });
      }
    });
  </script>
</body>"""

# Replace existing JS script block that handled header with the new combined one
content = re.sub(r"<script>.*?document\.addEventListener\('DOMContentLoaded', \(\) => {.*?const header = document\.getElementById\('siteHeader'\).*?\}\);.*?<\/script>\s*<\/body>", js_to_inject, content, flags=re.DOTALL)

with codecs.open(f'{workspace}/ai-shopping.html', 'w', 'utf-8') as f:
    f.write(content)

print("Updated ai-shopping.html with animated typing background logo")
