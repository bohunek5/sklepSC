import codecs
with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'r', 'utf-8') as f:
    html = f.read()

html = html.replace("const header = document.getElementById('mainHeader');", "const header = document.getElementById('siteHeader');")
html = html.replace("const headerLogo = document.getElementById('headerLogo');", "const headerLogo = document.querySelector('.brand img');")

with codecs.open('d:/MY-AI-AGENTS/sklepSC/index.html', 'w', 'utf-8') as f:
    f.write(html)
print("Header script fixed!")
