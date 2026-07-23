import json
import os
import re

json_path = os.path.join("js", "prescot-imported-products.json")
with open(json_path, "r", encoding="utf-8") as f:
    products = json.load(f)

# Format products array as JS
js_content = "const defaultProducts = " + json.dumps(products, ensure_ascii=False, indent=2) + ";\n\n"

js_content += """function getProducts() {
  if (typeof window !== 'undefined' && localStorage) {
    const cacheVersion = "v_prescot_cloud_xml_v1";
    const storedVersion = localStorage.getItem('sklepSC_products_version');
    if (storedVersion !== cacheVersion) {
      localStorage.removeItem('sklepSC_products');
      localStorage.setItem('sklepSC_products_version', cacheVersion);
    }

    const localStr = localStorage.getItem('sklepSC_products');
    if (localStr) {
      try {
        return JSON.parse(localStr);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return defaultProducts;
}

var products = getProducts();
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { defaultProducts, getProducts, products };
}
"""

js_path = os.path.join("js", "products-data.js")
with open(js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Updated {js_path} with {len(products)} products.")
