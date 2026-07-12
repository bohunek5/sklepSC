import glob

for filepath in glob.glob("*.html"):
    if filepath == 'old_index.html': continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. More rectangular buttons
    # We will inject overriding CSS for `.mockup-btn`, `.add-to-cart-btn`, `.checkout-btn`, `.submit-order-btn`
    # We can just put this before </head>
    
    override_style = """
  <style>
    /* Make buttons more rectangular */
    .mockup-btn, 
    .add-to-cart-btn, 
    .checkout-btn, 
    .submit-order-btn,
    .qv-add-cart-btn,
    .glass-banner-btn {
      border-radius: 2px !important;
    }
  </style>
"""
    if "/* Make buttons more rectangular */" not in content:
        content = content.replace("</head>", f"{override_style}</head>")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Injected rectangular buttons override to {filepath}")
