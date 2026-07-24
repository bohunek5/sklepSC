import glob

filepath = "index.html"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove margin-bottom: 25px; from banner paragraphs
content = content.replace("margin-bottom: 25px; max-width: 100%;", "margin-bottom: 0px; max-width: 100%;")
content = content.replace("margin-bottom: 25px;", "margin-bottom: 0px;")

# 2. Add some CSS overrides to push the content down
override_style = """
  <style>
    /* Align banner text and button nicely at the bottom */
    .category-banner-card {
      padding-bottom: 25px !important; /* was 40px */
    }
    .category-banner-card.sub-card {
      padding-bottom: 20px !important; /* was 30px */
    }
    .category-banner-card p {
      margin-bottom: 0 !important;
    }
    .category-banner-card h3 {
      margin-bottom: 5px !important;
    }
  </style>
"""

if "/* Align banner text and button nicely at the bottom */" not in content:
    content = content.replace("</head>", f"{override_style}</head>")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
    
print("Banner alignment fixed in index.html")
