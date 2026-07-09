import re
import glob

# 1. Update contact.html form button
with open('contact.html', 'r', encoding='utf-8') as f:
    contact_html = f.read()

# Change .submit-btn styles to match the awesome glassmorphism style or at least a better style.
submit_btn_css = """
    .submit-btn {
      width: 100%;
      padding: 16px;
      background: var(--primary-color);
      color: var(--white);
      border: 1px solid rgba(255,255,255,0.1);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 13px;
      cursor: pointer;
      border-radius: 99px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .submit-btn:hover {
      background: var(--accent-color);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 90, 0, 0.2);
      color: #fff;
    }
"""
contact_html = re.sub(r'\.submit-btn\s*\{[^}]*\}\s*\.submit-btn:hover\s*\{[^}]*\}', submit_btn_css.strip(), contact_html)
with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(contact_html)

# 2. Update about.html hero
with open('about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

about_hero_new = """<section class="page-hero" style="background: url('/images/lb2.jpg') center/cover no-repeat; padding: 120px 20px; text-align: center; position: relative;">
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 26, 48, 0.6);"></div>
    <div style="position: relative; z-index: 1;">
      <h1 style="color: #fff; font-size: 64px; font-weight: 800; font-family: 'Outfit', sans-serif; margin-bottom: 10px; text-transform: uppercase; letter-spacing: -1px; text-shadow: 0 4px 12px rgba(0,0,0,0.3);">Nasza historia</h1>
      <p style="color: #eee; font-size: 16px;">Poznaj markę Prescot LED</p>
      <div class="hero-breadcrumbs" style="font-size: 14px; color: #ccc; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px;">
        <a href="/index.html" style="color: #fff; text-decoration: none; transition: 0.3s;" onmouseover="this.style.color='var(--accent-color)'" onmouseout="this.style.color='#fff'">Home</a> 
        <span style="margin: 0 10px; color: rgba(255,255,255,0.5);">/</span> 
        <span style="color: var(--accent-color);">O nas</span>
      </div>
    </div>
  </section>"""
about_html = re.sub(r'<section class="about-hero">\s*<h1>Nasza historia</h1>\s*</section>', about_hero_new, about_html)
with open('about.html', 'w', encoding='utf-8') as f:
    f.write(about_html)

# 3. Add glassmorphism hover to index.html hero button
with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()
# Hero button text is "Odkryj". Let's add a style class to it.
index_html = index_html.replace(
    'style="display: inline-block; padding: 16px 40px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 99px; text-decoration: none; color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; backdrop-filter: blur(10px); transition: all 0.4s ease;"',
    'class="hero-btn-glass" style="display: inline-block; padding: 16px 40px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 99px; text-decoration: none; color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; backdrop-filter: blur(10px); transition: all 0.4s ease;"'
)
# Add hero-btn-glass to CSS in index.html
hero_btn_css = """
    .hero-btn-glass:hover {
      background: rgba(255, 255, 255, 0.6) !important;
      color: var(--primary-color) !important;
      font-weight: 700 !important;
      border-color: rgba(255, 255, 255, 0.8) !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
      transform: translateY(-2px);
    }
"""
if '.hero-btn-glass' not in index_html:
    index_html = index_html.replace('</style>', hero_btn_css + '</style>')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

# 4. Global CSS for Glassmorphism Icons
glass_icons_css = """
    /* Awesome Glassmorphism Icons */
    .icon-glass-sm {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.03);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 0, 0, 0.05);
      color: var(--accent-color);
      box-shadow: inset 0 2px 5px rgba(255,255,255,0.5), 0 2px 10px rgba(0,0,0,0.02);
      transition: all 0.3s ease;
      margin-right: 8px;
    }
    
    .icon-glass-md {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: var(--accent-color);
      box-shadow: inset 0 2px 5px rgba(255,255,255,0.6), 0 4px 15px rgba(0,0,0,0.03);
      transition: all 0.3s ease;
      font-size: 24px;
    }
    
    .icon-glass-lg {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.02);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      color: var(--accent-color);
      box-shadow: inset 0 2px 5px rgba(255,255,255,0.8), 0 8px 25px rgba(0,0,0,0.04);
      transition: all 0.3s ease;
      font-size: 36px;
      margin-bottom: 20px;
    }
    
    .icon-glass-sm:hover, .icon-glass-md:hover, .icon-glass-lg:hover {
      transform: translateY(-3px);
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.1);
      box-shadow: inset 0 2px 5px rgba(255,255,255,1), 0 10px 30px rgba(0,0,0,0.08);
    }
"""

# Replace in about.html
with open('about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()
if '.icon-glass-lg' not in about_html:
    about_html = about_html.replace('</style>', glass_icons_css + '</style>')
about_html = about_html.replace('<div class="value-icon">', '<div class="icon-glass-lg">')
with open('about.html', 'w', encoding='utf-8') as f:
    f.write(about_html)

# Replace in contact.html
with open('contact.html', 'r', encoding='utf-8') as f:
    contact_html = f.read()
if '.icon-glass-md' not in contact_html:
    contact_html = contact_html.replace('</style>', glass_icons_css + '</style>')
contact_html = contact_html.replace('<div class="info-icon">', '<div class="icon-glass-md">')
with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(contact_html)

# Replace in product.html
with open('product.html', 'r', encoding='utf-8') as f:
    product_html = f.read()
if '.icon-glass-sm' not in product_html:
    product_html = product_html.replace('</style>', glass_icons_css + '</style>')
product_html = product_html.replace('<i class="ph ph-intersect"></i>', '<span class="icon-glass-sm"><i class="ph ph-intersect"></i></span>')
product_html = product_html.replace('<i class="ph ph-question"></i>', '<span class="icon-glass-sm"><i class="ph ph-question"></i></span>')
# There are also icons in "shipping-info" and others?
product_html = product_html.replace('<i class="ph ph-truck"></i>', '<span class="icon-glass-sm"><i class="ph ph-truck"></i></span>')
product_html = product_html.replace('<i class="ph ph-arrow-u-up-left"></i>', '<span class="icon-glass-sm"><i class="ph ph-arrow-u-up-left"></i></span>')
product_html = product_html.replace('<i class="ph ph-shield-check"></i>', '<span class="icon-glass-sm"><i class="ph ph-shield-check"></i></span>')
# Make sure we didn't break layout by adding margin to span.
with open('product.html', 'w', encoding='utf-8') as f:
    f.write(product_html)

print("Done modifications!")
