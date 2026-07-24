import os
import re

print("Starting fix_configurator_css_and_header.py...")

# 1. Re-apply images and texts to configurator.html
with open('d:/MY-AI-AGENTS/sklepSC/configurator.html', 'r', encoding='utf-8') as f:
    conf = f.read()

# Replace images for applications
conf = conf.replace("url('../images/kuchnia_opt.webp')", "url('../images/configurator/kitchen_new.png')")
conf = conf.replace("url('../images/elegant-interior-design-with-neutral-colors-2026-03-25-07-06-00-utc.webp')", "url('../images/configurator/living_new.png')")
conf = conf.replace("url('../images/configurator/application-stairs.webp')", "url('../images/configurator/stairs_new.png')")
conf = conf.replace("url('../images/configurator/application-bathroom.webp')", "url('../images/configurator/bathroom_new.png')")
conf = conf.replace("url('../images/configurator/application-outdoor.webp')", "url('../images/configurator/outdoor_new.png')")
conf = conf.replace("url('../images/configurator/application-retail.webp')", "url('../images/configurator/retail_new.png')")

# Replace images for intensity
conf = conf.replace("url('../images/configurator/intensity-decorative.webp')", "url('../images/configurator/intensity_decorative_new.png')")
conf = conf.replace("url('../images/configurator/intensity-functional.webp')", "url('../images/configurator/intensity_functional_new.png')")
conf = conf.replace("url('../images/configurator/intensity-strong.webp')", "url('../images/configurator/intensity_strong_new.png')")

# Replace images for color
conf = conf.replace("url('../images/configurator/color-warm.webp')", "url('../images/configurator/light_warm_new.png')")
conf = conf.replace("url('../images/configurator/color-neutral.webp')", "url('../images/configurator/light_neutral_new.png')")
conf = conf.replace("url('../images/configurator/color-cold.webp')", "url('../images/configurator/light_cold_new.png')")
conf = conf.replace("url('../images/configurator/color-cct.webp')", "url('../images/configurator/light_cct_new.png')")
conf = conf.replace("url('../images/configurator/color-rgb.webp')", "url('../images/configurator/light_rgb_new.png')")
conf = conf.replace("url('../images/configurator/color-rgbw.webp')", "url('../images/configurator/light_rgbw_new.png')")

# Replace images for env
conf = conf.replace("url('../images/configurator/env-dry.webp')", "url('../images/configurator/env_dry_new.png')")
conf = conf.replace("url('../images/configurator/env-damp.webp')", "url('../images/configurator/env_damp_new.png')")
conf = conf.replace("url('../images/configurator/env-outdoor.webp')", "url('../images/configurator/outdoor_new.png')")

# Replace images and texts for controls
conf = conf.replace("""<label class="choice-card visual-choice control-choice control-switch" style="--choice-image:url('../images/configurator/control-modes-v2.webp');--choice-background-size:300% 100%;--choice-position:left center"><input type="radio" name="control" value="switch"><span class="visual-card-index">01 · podstawowe</span><span class="visual-card-copy"><strong>Włącz / wyłącz</strong><small>Klasyczny włącznik; bez sterownika dla taśmy jednobarwnej.</small></span><span class="option-availability"></span></label>""", 
"""<label class="choice-card visual-choice control-choice control-switch" style="--choice-image:url('../images/configurator/control_switch_new.png');--choice-position:center"><input type="radio" name="control" value="switch"><span class="visual-card-index">01</span><span class="visual-card-copy"><strong>Nie potrzebuję</strong><small>Sama taśma bez dodatkowego sterowania.</small></span><span class="option-availability"></span></label>""")

conf = conf.replace("""<label class="choice-card visual-choice control-choice control-dimmer" style="--choice-image:url('../images/configurator/control-modes-v2.webp');--choice-background-size:300% 100%;--choice-position:center"><input type="radio" name="control" value="dimmer"><span class="visual-card-index">02 · regulacja</span><span class="visual-card-copy"><strong>Ściemnianie lub pilot</strong><small>Płynna regulacja i sterownik dobrany do liczby kanałów.</small></span><span class="option-availability"></span></label>""",
"""<label class="choice-card visual-choice control-choice control-dimmer" style="--choice-image:url('../images/configurator/control_dimmer_new.png');--choice-position:center"><input type="radio" name="control" value="dimmer"><span class="visual-card-index">02</span><span class="visual-card-copy"><strong>Zestaw sterownik + pilot</strong><small>Odbiornik ze sparowanym dedykowanym pilotem.</small></span><span class="option-availability"></span></label>""")

conf = conf.replace("""<label class="choice-card visual-choice control-choice control-smart" style="--choice-image:url('../images/configurator/control-modes-v2.webp');--choice-background-size:300% 100%;--choice-position:right center"><input type="radio" name="control" value="smart"><span class="visual-card-index">03 · aplikacja</span><span class="visual-card-copy"><strong>Smart / telefon</strong><small>Odbiornik Wi‑Fi albo kompatybilny system radiowy.</small></span><span class="option-availability"></span></label>""",
"""<label class="choice-card visual-choice control-choice control-smart" style="--choice-image:url('../images/configurator/control_smart_new.png');--choice-position:center"><input type="radio" name="control" value="smart"><span class="visual-card-index">03</span><span class="visual-card-copy"><strong>Sterowniki / piloty</strong><small>Osobno dobierane pod aplikację i system.</small></span><span class="option-availability"></span></label>""")

with open('d:/MY-AI-AGENTS/sklepSC/configurator.html', 'w', encoding='utf-8') as f:
    f.write(conf)
print("Updated configurator.html")

# 2. Add CSS back to configurator.css but WITHOUT margin changes
with open('d:/MY-AI-AGENTS/sklepSC/css/configurator.css', 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace("font-size: 8px;", "font-size: 12px;") # for .choice-card > .option-availability
css = css.replace("width: 3px;\n  height: 32px;", "width: 4px;\n  height: 42px;")
css = css.replace("width: 3px;\n  height: 30px;", "width: 4px;\n  height: 40px;")
css = css.replace(".application-card .application-index { position: absolute; top: 18px; left: 31px; color: rgba(255,255,255,.78); font-size: 10px; font-weight: 800; letter-spacing: .12em; }", ".application-card .application-index { position: absolute; top: 18px; left: 36px; color: rgba(255,255,255,.9); font-size: 16px; font-weight: 800; letter-spacing: .12em; }")
css = css.replace(".application-card .application-copy strong { margin: 0; color: #fff; font-size: 19px; }", ".application-card .application-copy strong { margin: 0; color: #fff; font-size: 26px; line-height: 1.15; }")
css = css.replace(".application-card .application-copy small { margin-top: 7px; color: #dbe2ea; font-size: 11px; }", ".application-card .application-copy small { margin-top: 7px; color: #dbe2ea; font-size: 14px; line-height: 1.4; }")
css = css.replace(".application-parameters { position: relative; z-index: 1; align-self: flex-start; margin-top: 13px; padding-top: 10px; color: #ff9a64; border-top: 1px solid rgba(255,255,255,.18); font-size: 9px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }", ".application-parameters { display: none !important; }")
css = css.replace(".application-card > .option-availability { top: 18px; right: 16px; bottom: auto; color: rgba(255,255,255,.85); font-size: 8px; }", ".application-card > .option-availability { top: 18px; right: 20px; bottom: auto; color: rgba(255,255,255,.95); font-size: 13px; font-weight: 800; }")

css = css.replace("""  left: 30px;
  z-index: 1;
  color: rgba(255,255,255,.9);
  font-size: 9px;""", """  left: 36px;
  z-index: 1;
  color: rgba(255,255,255,.9);
  font-size: 15px;""")

css = css.replace("""  font-size: 18px;
  line-height: 1.12;""", """  font-size: 24px;
  line-height: 1.12;""")

css = css.replace("""  font-size: 10px;
  line-height: 1.45;""", """  font-size: 13px;
  line-height: 1.45;""")

if "User requested hides for cleaner UI" not in css:
    css += """\n/* User requested hides for cleaner UI */
.configurator-intro,
.hero-facts,
.funnel-status,
.step-kicker,
.step-description {
  display: none !important;
}\n"""

with open('d:/MY-AI-AGENTS/sklepSC/css/configurator.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated css/configurator.css")

# 3. Inject .site-header into all other pages
match = re.search(r'(<header class="site-header" id="siteHeader">.*?</header>)', conf, re.DOTALL)
if match:
    header_html = match.group(1)
    html_files = [
        'about.html', 'admin.html', 'blog.html', 'cart.html', 'checkout.html',
        'contact.html', 'index.html', 'product.html', 'shop.html'
    ]

    for file in html_files:
        filepath = 'd:/MY-AI-AGENTS/sklepSC/' + file
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace whatever header is there (mockup-header or something else)
            if '<header class="mockup-header"' in content:
                content = re.sub(r'<header class="mockup-header".*?</header>', header_html, content, flags=re.DOTALL)
                content = re.sub(r'<!-- Mobile Menu -->\s*<div class="mobile-menu".*?</div>', '', content, flags=re.DOTALL)
            
            # Ensure css/configurator.css is linked (for the .site-header styles) if not already
            if 'css/configurator.css' not in content:
                content = content.replace('</head>', '  <link rel="stylesheet" href="css/configurator.css">\n</head>')

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print("Updated " + file)
else:
    print("Could not find site-header in configurator.html")
