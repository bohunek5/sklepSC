import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

css = """
    @media (max-width: 991px) {
      .categories-main-grid {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    @media (max-width: 768px) {
      .categories-main-grid {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
      }
      .categories-main-grid .category-banner-card {
        height: 280px !important;
        padding: 20px !important;
      }
      .categories-main-grid h3 {
        font-size: 20px !important;
      }
      .categories-main-grid p {
        font-size: 12px !important;
      }
    }
</style>
"""

content = content.replace("</style>\n<section class=\"mockup-banners\"", css + "\n<section class=\"mockup-banners\"")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done appending CSS")
