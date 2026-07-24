import os

# 1. Update configurator.css
css_path = 'd:/MY-AI-AGENTS/sklepSC/css/configurator.css'
with open(css_path, 'r', encoding='utf-8') as f: css = f.read()

# Replace variables
css = css.replace('--orange: #ff5a00;', '--orange: #0b1a30;')
css = css.replace('--orange-dark: #d94900;', '--orange-dark: #172237;')

# Replace explicit orange values
css = css.replace('background: linear-gradient(90deg, #ff5a00, #ff9a64);', 'background: #0b1a30;')
css = css.replace('background: #ff5a00;', 'background: #0b1a30;')
css = css.replace('box-shadow: 0 0 10px #ff5a00;', 'box-shadow: 0 0 10px rgba(11, 26, 48, 0.3);')
css = css.replace('color: #ff5a00 !important;', 'color: #0b1a30 !important;')
css = css.replace('border-bottom: 3px solid #ff5a00;', 'border-bottom: 3px solid #0b1a30;')
css = css.replace('border-left: 4px solid #ff5a00;', 'border-left: 4px solid #0b1a30;')
css = css.replace('color: #ff5a00;', 'color: #0b1a30;')

# Make selection border white for image cards
css = css.replace('box-shadow: inset 0 0 0 3px var(--orange), 0 18px 38px rgba(7,22,42,.22);', 'box-shadow: inset 0 0 0 3px #fff, 0 18px 38px rgba(7,22,42,.22);')
css = css.replace('box-shadow: inset 0 0 0 3px var(--orange), 0 17px 36px rgba(7,22,42,.22);', 'box-shadow: inset 0 0 0 3px #fff, 0 17px 36px rgba(7,22,42,.22);')

css = css.replace('box-shadow: inset 0 0 0 3px var(--orange);', 'box-shadow: inset 0 0 0 3px #fff;')

with open(css_path, 'w', encoding='utf-8') as f: f.write(css)

# 2. Update ai-agent.js
js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
if os.path.exists(js_path):
    with open(js_path, 'r', encoding='utf-8') as f: js = f.read()
    js = js.replace("'#ff5a00'", "'#0b1a30'") # Navy button
    js = js.replace("color: #ff9a64;", "color: #667286;") # Gray subheader
    js = js.replace("color: #ff5a00;", "color: #0b1a30;")
    with open(js_path, 'w', encoding='utf-8') as f: f.write(js)

# 3. Check for any other #ff5a00 in css files
for root, dirs, files in os.walk('d:/MY-AI-AGENTS/sklepSC/css'):
    for file in files:
        if file.endswith('.css') and file != 'configurator.css':
            fp = os.path.join(root, file)
            with open(fp, 'r', encoding='utf-8') as f: content = f.read()
            if '#ff5a00' in content or '#ff9a64' in content:
                content = content.replace('#ff5a00', '#0b1a30').replace('#ff9a64', '#172237')
                with open(fp, 'w', encoding='utf-8') as f: f.write(content)

# Update style.css specifically for the floating button or others if needed
style_path = 'd:/MY-AI-AGENTS/sklepSC/css/style.css'
if os.path.exists(style_path):
    with open(style_path, 'r', encoding='utf-8') as f: style_css = f.read()
    style_css = style_css.replace('#ff5a00', '#0b1a30').replace('#ff9a64', '#172237')
    style_css = style_css.replace('var(--orange)', 'var(--navy)')
    with open(style_path, 'w', encoding='utf-8') as f: f.write(style_css)

print('Replaced orange with navy, gray, and white.')
