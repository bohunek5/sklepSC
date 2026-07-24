import re

# 1. Update JS to remove scrollIntoView
js_path = 'd:/MY-AI-AGENTS/sklepSC/js/configurator.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

js = re.sub(r'results\.scrollIntoView.*?;\n?', '', js)
js = re.sub(r'document\.getElementById\(\'configurator\'\)\.scrollIntoView.*?;\n?', '', js)
js = re.sub(r'document\.querySelector\(\'\.configurator-shell\'\)\.scrollIntoView.*?;\n?', '', js)
js = re.sub(r'results\.scrollIntoView.*?;\n?', '', js)
js = re.sub(r'\.scrollIntoView\(\{.*?\}\)', '', js)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

# 2. Update HTML to move step-actions
html_path = 'd:/MY-AI-AGENTS/sklepSC/configurator.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# find step actions
actions_pattern = r'<div class="step-actions">.*?</div>'
actions_match = re.search(actions_pattern, html, flags=re.DOTALL)
if actions_match:
    actions_html = actions_match.group(0)
    # remove from original position
    html = html.replace(actions_html, '')
    
    # insert after <form id="configuratorForm" novalidate>
    form_start = '<form id="configuratorForm" novalidate>'
    html = html.replace(form_start, f'{form_start}\n            {actions_html}')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 3. Add styling for the step actions so it looks good at the top
css_path = 'd:/MY-AI-AGENTS/sklepSC/css/configurator.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

css += """
/* Step actions at the top */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: sticky;
  top: 80px;
  z-index: 10;
  background: var(--white);
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}
"""
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Removed scroll jumping and moved buttons to the top.")
