import os

shop_path = "shop.html"
with open(shop_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace variables declaration in shop.html
old_vars = """    let currentSearch = '';
    let currentCategory = 'all';
    let currentColor = 'all';
    let currentPriceRange = 'all';
    let currentSort = 'default';
    let currentPage = 1;
    const itemsPerPage = 12;"""

new_vars = """    let currentSearch = '';
    let currentCategory = 'all';
    let currentColor = 'all';
    let currentPriceRange = 'all';
    let currentVoltage = 'all';
    let currentColorTemp = 'all';
    let currentLumens = 'all';
    let currentIP = 'all';
    let currentSort = 'default';
    let currentPage = 1;
    const itemsPerPage = 24;"""

content = content.replace(old_vars, new_vars)

# Replace price ranges filter logic
old_price_logic = """      // 4. Price Filter
      if (currentPriceRange !== 'all') {
        if (currentPriceRange === '0-50') {
          filtered = filtered.filter(p => p.price <= 50);
        } else if (currentPriceRange === '50-100') {
          filtered = filtered.filter(p => p.price > 50 && p.price <= 100);
        } else if (currentPriceRange === '100+') {
          filtered = filtered.filter(p => p.price > 100);
        }
      }"""

new_price_logic = """      // 4. Price Filter (PLN)
      if (currentPriceRange !== 'all') {
        if (currentPriceRange === '0-50') {
          filtered = filtered.filter(p => p.price <= 50);
        } else if (currentPriceRange === '50-100') {
          filtered = filtered.filter(p => p.price > 50 && p.price <= 100);
        } else if (currentPriceRange === '100-250') {
          filtered = filtered.filter(p => p.price > 100 && p.price <= 250);
        } else if (currentPriceRange === '250+') {
          filtered = filtered.filter(p => p.price > 250);
        }
      }

      // 5. Voltage Filter
      if (currentVoltage !== 'all') {
        filtered = filtered.filter(p => {
          const attrV = (p.attributes && p.attributes["Napięcie wejściowe"]) || "";
          const title = p.title || "";
          return attrV.includes(currentVoltage) || title.includes(currentVoltage);
        });
      }

      // 6. Color Temp / Barwa światła Filter
      if (currentColorTemp !== 'all') {
        filtered = filtered.filter(p => {
          const attrB = (p.attributes && p.attributes["Barwa światła"]) || "";
          const title = (p.title || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          if (currentColorTemp === 'ciepła') return attrB.toLowerCase().includes('ciepła') || title.includes('3000k') || title.includes('ciepła') || desc.includes('ciepła');
          if (currentColorTemp === 'neutralna') return attrB.toLowerCase().includes('neutralna') || title.includes('4000k') || title.includes('neutralna') || desc.includes('neutralna');
          if (currentColorTemp === 'zimna') return attrB.toLowerCase().includes('zimna') || title.includes('6500k') || title.includes('zimna') || desc.includes('zimna');
          if (currentColorTemp === 'rgb') return attrB.toLowerCase().includes('rgb') || attrB.toLowerCase().includes('cct') || title.includes('rgb') || title.includes('cct');
          return true;
        });
      }

      // 7. Lumens / Jasność Filter
      if (currentLumens !== 'all') {
        filtered = filtered.filter(p => {
          const attrJ = (p.attributes && p.attributes["Jasność"]) || (p.attributes && p.attributes["Strumień świetlny"]) || "";
          const title = p.title || "";
          const match = (attrJ + " " + title).match(/(\\d+)\\s*lm/i);
          if (match) {
            const lm = parseInt(match[1], 10);
            if (currentLumens === 'low') return lm < 600;
            if (currentLumens === 'mid') return lm >= 600 && lm <= 1000;
            if (currentLumens === 'high') return lm > 1000;
          }
          return true;
        });
      }

      // 8. IP Rating Filter
      if (currentIP !== 'all') {
        filtered = filtered.filter(p => {
          const attrIP = (p.attributes && p.attributes["Klasa szczelności"]) || "";
          const title = p.title || "";
          if (currentIP === 'IP20') return attrIP.includes('IP20') || title.includes('IP20');
          if (currentIP === 'IP65+') return attrIP.includes('IP63') || attrIP.includes('IP65') || attrIP.includes('IP67') || title.includes('IP65') || title.includes('IP67');
          return true;
        });
      }"""

content = content.replace(old_price_logic, new_price_logic)

# Add event listener bindings for new filters
old_price_bind = """    // Price range binding
    priceRangesList.querySelectorAll('li').forEach(li => {
      if (li.dataset.range === currentPriceRange) {
        priceRangesList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');
      }
      li.addEventListener('click', (e) => {
        priceRangesList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');
        currentPriceRange = li.dataset.range;
        currentPage = 1;
        renderFilteredProducts();
      });
    });"""

new_price_bind = """    // Price range binding
    priceRangesList.querySelectorAll('li').forEach(li => {
      if (li.dataset.range === currentPriceRange) {
        priceRangesList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');
      }
      li.addEventListener('click', (e) => {
        priceRangesList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
        li.classList.add('active');
        currentPriceRange = li.dataset.range;
        currentPage = 1;
        renderFilteredProducts();
      });
    });

    // Voltage filter binding
    const voltageFilterList = document.getElementById('voltageFilterList');
    if (voltageFilterList) {
      voltageFilterList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          voltageFilterList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
          li.classList.add('active');
          currentVoltage = li.dataset.voltage;
          currentPage = 1;
          renderFilteredProducts();
        });
      });
    }

    // Color Temp binding
    const colorTempFilterList = document.getElementById('colorTempFilterList');
    if (colorTempFilterList) {
      colorTempFilterList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          colorTempFilterList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
          li.classList.add('active');
          currentColorTemp = li.dataset.colortemp;
          currentPage = 1;
          renderFilteredProducts();
        });
      });
    }

    // Lumens binding
    const lumensFilterList = document.getElementById('lumensFilterList');
    if (lumensFilterList) {
      lumensFilterList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          lumensFilterList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
          li.classList.add('active');
          currentLumens = li.dataset.lumens;
          currentPage = 1;
          renderFilteredProducts();
        });
      });
    }

    // IP Filter binding
    const ipFilterList = document.getElementById('ipFilterList');
    if (ipFilterList) {
      ipFilterList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          ipFilterList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
          li.classList.add('active');
          currentIP = li.dataset.ip;
          currentPage = 1;
          renderFilteredProducts();
        });
      });
    }"""

content = content.replace(old_price_bind, new_price_bind)

with open(shop_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated shop.html JS logic for all attribute filters.")
