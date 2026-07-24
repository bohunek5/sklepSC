import re

# We need to trigger window.openCartDrawer() after adding items to cart in ai-agent.js
# and also dispatch a storage event so that shared-popups.js catches it.

js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Find addItemsToCart function
add_items = """  function addItemsToCart(items) {
    const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    items.forEach((item) => {
      const existing = cart.find((entry) => String(entry.id) === String(item.id));
      if (existing) existing.qty = Number(existing.qty || existing.quantity || 0) + item.qty;
      else cart.push(item);
    });
    localStorage.setItem('prescot_cart', JSON.stringify(cart));
    updateCartBadge();
  }"""

new_add_items = """  function addItemsToCart(items) {
    const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    items.forEach((item) => {
      const existing = cart.find((entry) => String(entry.id) === String(item.id));
      if (existing) existing.qty = Number(existing.qty || existing.quantity || 0) + item.qty;
      else cart.push(item);
    });
    localStorage.setItem('prescot_cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Trigger global events so shared-popups.js opens the sidebar cart
    window.dispatchEvent(new Event('storage'));
    if (typeof window.openCartDrawer === 'function') {
      window.openCartDrawer();
    }
  }"""

if add_items in js:
    js = js.replace(add_items, new_add_items)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated ai-agent.js to trigger openCartDrawer")
else:
    print("Could not find addItemsToCart function in ai-agent.js")
