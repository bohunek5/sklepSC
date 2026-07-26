import glob, codecs, re

nav_replacement = '''    <nav class="desktop-nav" aria-label="Nawigacja glowna">
      <a class="{home_active}" href="index.html">Home</a>
      <div class="has-mega-menu" style="display:inline-block;">
        <a class="{shop_active}" href="shop.html" style="display:flex; align-items:center; gap:4px;">Sklep <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg></a>
        <div class="magic-dropdown" style="width: 700px; padding: 20px; margin-top:0px;">
          <div class="categories-sub-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
            <a href="shop.html?category=Ta%C5%9Bmy%20LED" class="sub-category-card" style="height:120px; border-radius:12px; overflow:hidden; position:relative; text-decoration:none;">
               <img src="images/cat_strip.png" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
               <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
               <span style="position:absolute; bottom:15px; left:15px; color:white; font-weight:700; font-size:14px; letter-spacing:1px; z-index:2;">TAŒMY LED</span>
            </a>
            <a href="shop.html?category=Profile%20LED" class="sub-category-card" style="height:120px; border-radius:12px; overflow:hidden; position:relative; text-decoration:none;">
               <img src="images/cat_profile.png" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
               <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
               <span style="position:absolute; bottom:15px; left:15px; color:white; font-weight:700; font-size:14px; letter-spacing:1px; z-index:2;">PROFILE LED</span>
            </a>
            <a href="shop.html?category=Zasilacze" class="sub-category-card" style="height:120px; border-radius:12px; overflow:hidden; position:relative; text-decoration:none;">
               <img src="images/cat_power.png" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
               <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
               <span style="position:absolute; bottom:15px; left:15px; color:white; font-weight:700; font-size:14px; letter-spacing:1px; z-index:2;">ZASILACZE</span>
            </a>
          </div>
        </div>
      </div>'''

for file in glob.glob('d:/MY-AI-AGENTS/sklepSC/*.html'):
    with codecs.open(file, 'r', 'utf-8') as f:
        content = f.read()
    
    # We want to replace the desktop-nav content.
    pattern = re.compile(r'<nav class="desktop-nav"[^>]*>\s*<a\s+(?:class="([^"]*)")?\s*href="index\.html">Home</a>\s*<a\s+(?:class="([^"]*)")?\s*href="shop\.html">Sklep</a>', re.IGNORECASE)
    
    def repl(m):
        home_cls = m.group(1) or ''
        shop_cls = m.group(2) or ''
        return nav_replacement.format(home_active=home_cls, shop_active=shop_cls)
    
    new_content = pattern.sub(repl, content)
    
    if new_content != content:
        with codecs.open(file, 'w', 'utf-8') as f:
            f.write(new_content)
        print('Updated', file)
