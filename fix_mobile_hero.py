import os
import re

def fix_mobile_hero():
    index_path = r"d:\MY-AI-AGENTS\sklepSC\index.html"
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_css = """
/* MOBILE HERO BOX & DOTS FIX */
@media (max-width: 768px) {
  .slider-dots {
    display: none !important;
  }
  .slide-banner-box {
    padding: 16px 20px !important;
    max-width: 85% !important;
    bottom: 10% !important;
  }
  .slide-banner-box h1 {
    font-size: 22px !important;
    margin-bottom: 4px !important;
  }
  .slide-banner-box p {
    font-size: 13px !important;
    margin-bottom: 12px !important;
  }
  .slide-banner-box .mockup-btn {
    height: 40px !important;
    padding: 0 20px !important;
    font-size: 12px !important;
  }
}
"""
    if "/* MOBILE HERO BOX & DOTS FIX */" not in content:
        # Inject just before </style> or at the end of the first style block
        content = content.replace("</style>", new_css + "\n</style>", 1)
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed mobile hero in index.html")
    else:
        print("Already fixed")

if __name__ == '__main__':
    fix_mobile_hero()
