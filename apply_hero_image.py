import re

file_path = 'd:/MY-AI-AGENTS/sklepSC/configurator.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

new_hero = """
    <section class="page-hero" aria-labelledby="heroTitle" style="background: url('images/kuchnia.jpg') center/cover no-repeat; min-height: 280px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 120px 20px 40px; text-align: center; position: relative; box-sizing: border-box;">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 26, 48, 0.6);"></div>
      <div class="container" style="position: relative; z-index: 1;">
        <h1 id="heroTitle" style="font-size: clamp(32px, 5vw, 56px); margin: 0 0 16px; color: #fff; font-weight: 700;">Konfigurator</h1>
        <p class="hero-lead" style="font-size: clamp(16px, 2vw, 20px); color: rgba(255,255,255,0.8); max-width: 600px; margin: 0 auto;">Przeprowadzimy Cię przez proces doboru komponentów oświetlenia.</p>
      </div>
    </section>
"""

# Replace the current page-hero
html = re.sub(r'<section class="page-hero".*?</section>', new_hero, html, flags=re.DOTALL)

# Center the text "Gdzie powstaje linia światła?"
html = html.replace('<h3>Gdzie powstaje linia światła?</h3>', '<h3 style="text-align: center;">Gdzie powstaje linia światła?</h3>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated hero image and centered the text.")
