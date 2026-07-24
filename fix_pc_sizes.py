import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pc_sizes = """
  <style>
    @media (min-width: 1025px) {
      /* Make top icons slightly larger */
      .mockup-action-icon {
        width: 48px !important;
        height: 48px !important;
      }
      .mockup-action-icon i {
        font-size: 22px !important;
      }
      
      /* Top menu text slightly larger */
      .mockup-nav ul li a {
        font-size: 13px !important;
        padding: 10px 24px !important;
      }
      
      /* Logo slightly larger */
      .mockup-header-logo img {
        height: 38px !important;
      }
      
      /* Slider arrows and scroll down slightly larger */
      .slider-arrow, .scroll-down-circle {
        width: 46px !important;
        height: 46px !important;
      }
      .slider-arrow svg, .scroll-down-circle svg {
        width: 20px !important;
        height: 20px !important;
      }
      
      /* Bottom banner (footer) slightly larger */
      .mockup-footer {
        padding: 60px 8% !important;
      }
      .mockup-footer h4 {
        font-size: 15px !important;
      }
      .mockup-footer ul li a, .mockup-footer p {
        font-size: 14px !important;
      }
    }
  </style>
"""
    if '/* Make top icons slightly larger */' not in content:
        content = content.replace('</head>', pc_sizes + '\n</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("PC sizes fixed")
