import os
import re

html_files = [
    'about.html', 'admin.html', 'blog.html', 'cart.html', 'checkout.html',
    'configurator.html', 'contact.html', 'index.html', 'product.html', 'shop.html', 'ai-shopping.html'
]

# 1. Remove ai-glow-link from all files
for file in html_files:
    filepath = 'd:/MY-AI-AGENTS/sklepSC/' + file
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Remove ai-glow-link class
    html = html.replace('class="active ai-glow-link"', 'class="active"')
    html = html.replace('class="ai-glow-link"', '')
    html = html.replace('  class=""', '') # clean up if left empty

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Removed glow from {file}")

# 2. Simplify configurator.html hero section
config_path = 'd:/MY-AI-AGENTS/sklepSC/configurator.html'
with open(config_path, 'r', encoding='utf-8') as f:
    conf = f.read()

simple_hero = """
    <section class="page-hero" aria-labelledby="heroTitle" style="padding-top: 140px; padding-bottom: 40px; text-align: center;">
      <div class="container">
        <h1 id="heroTitle" style="font-size: clamp(32px, 5vw, 56px); margin-bottom: 16px;">Konfigurator</h1>
        <p class="hero-lead" style="font-size: clamp(16px, 2vw, 20px); color: #475569; max-width: 600px; margin: 0 auto;">Przeprowadzimy Cię przez proces doboru komponentów oświetlenia.</p>
      </div>
    </section>
"""

# The current hero starts at <section class="hero" and ends before <section class="configurator-section"
conf = re.sub(r'<section class="hero".*?</section>', simple_hero, conf, flags=re.DOTALL)

with open(config_path, 'w', encoding='utf-8') as f:
    f.write(conf)
print("Updated configurator.html hero section.")
