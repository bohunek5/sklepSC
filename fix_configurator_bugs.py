import re

print("Applying specific bugfixes from user feedback...")

with open("configurator.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Remove square-product-images-override
html = re.sub(r'<style id="square-product-images-override">.*?</style>', '', html, flags=re.DOTALL)

# 2. Remove class="active" from Dobierz Sam
html = html.replace('<a href="configurator.html" class="active">Dobierz Sam</a>', '<a href="configurator.html">Dobierz Sam</a>')

# 3. Add ?v=2 to cache bust configurator.js
html = html.replace('src="js/configurator.js"', 'src="js/configurator.js?v=2"')

with open("configurator.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Fixes applied to configurator.html")
