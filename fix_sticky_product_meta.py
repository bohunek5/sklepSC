import os

product_path = "product.html"
with open(product_path, "r", encoding="utf-8") as f:
    content = f.read()

sticky_css = """
/* --- STICKY RIGHT BLOCK (BUY BOX / PRODUCT META) --- */
@media (min-width: 1025px) {
  .product-container {
    display: grid !important;
    grid-template-columns: 1.15fr 0.85fr !important;
    gap: 50px !important;
    align-items: start !important; /* Essential for sticky sidebar */
  }

  .product-gallery {
    display: flex !important;
    flex-direction: column !important;
    gap: 20px !important;
    min-width: 0 !important;
  }

  .product-meta {
    position: sticky !important;
    top: 110px !important;
    align-self: start !important;
    z-index: 10 !important;
    max-height: calc(100vh - 130px) !important;
    overflow-y: auto !important;
    padding-right: 8px !important;
    margin-bottom: 40px !important;
    scrollbar-width: thin !important;
    scrollbar-color: rgba(11, 26, 48, 0.2) transparent !important;
  }

  /* Custom smooth scrollbar for sticky product meta */
  .product-meta::-webkit-scrollbar {
    width: 5px;
  }
  .product-meta::-webkit-scrollbar-track {
    background: transparent;
  }
  .product-meta::-webkit-scrollbar-thumb {
    background: rgba(11, 26, 48, 0.15);
    border-radius: 10px;
  }
  .product-meta::-webkit-scrollbar-thumb:hover {
    background: rgba(11, 26, 48, 0.3);
  }
}
"""

# Insert sticky_css right before </head>
if "</head>" in content:
    content = content.replace("</head>", f"<style>{sticky_css}</style>\n</head>")
    with open(product_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Injected sticky product meta CSS into product.html.")
else:
    print("Error: </head> not found in product.html.")
