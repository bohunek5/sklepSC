import codecs
import re

with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'r', 'utf-8') as f:
    html = f.read()

# Desktop h1 font size
html = html.replace("font-size: clamp(20px, 3.2vw, 30px);", "font-size: clamp(18px, 2.5vw, 24px);")

# Desktop h1 text shadow
html = html.replace("text-shadow: 0 4px 14px rgba(0, 0, 0, 0.75), 0 1px 4px rgba(0, 0, 0, 0.9);", "text-shadow: 0 4px 24px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 1.0), 0 0 10px rgba(0, 0, 0, 0.8);")

# Mobile h1 font size (22px !important -> 18px !important)
html = html.replace("font-size: 22px !important;", "font-size: 18px !important;\n          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 1.0), 0 0 10px rgba(0, 0, 0, 0.8) !important;")

with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'w', 'utf-8') as f:
    f.write(html)
print("Updated index.html hero h1 styling")
