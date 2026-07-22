document.addEventListener('DOMContentLoaded', () => {
  let step = 1;
  const maxSteps = 5;

  const state = {
    location: 'kitchen',
    meters: 5.0,
    colorTemp: '3000K',
    tech: 'COB',
    control: 'touch-remote'
  };

  const nodes = document.querySelectorAll('.timeline-node');
  const panes = document.querySelectorAll('.step-pane');
  const btnPrev = document.getElementById('btnWizardPrev');
  const btnNext = document.getElementById('btnWizardNext');

  const meterSlider = document.getElementById('lengthMeterSlider');
  const heroMeterValue = document.getElementById('heroMeterValue');
  const calculatedWattsText = document.getElementById('calculatedWattsText');

  // Option Cards Listener
  document.querySelectorAll('.wizard-card-option').forEach(card => {
    card.addEventListener('click', () => {
      const parentPane = card.closest('.step-pane');
      if (parentPane) {
        parentPane.querySelectorAll('.wizard-card-option').forEach(c => c.classList.remove('selected'));
      }
      card.classList.add('selected');

      const key = card.dataset.key;
      const val = card.dataset.val;
      if (key && val) state[key] = val;
      if (card.dataset.tech) state.tech = card.dataset.tech;

      recalculateWatts();
    });
  });

  // Slider Input Listener
  if (meterSlider) {
    meterSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.meters = val;
      if (heroMeterValue) heroMeterValue.innerHTML = `${val} <span>metrów</span>`;
      recalculateWatts();
    });
  }

  function recalculateWatts() {
    const wPerM = state.colorTemp === 'RGB' ? 18.0 : (state.tech === 'COB' ? 14.4 : 10.8);
    const rawPower = state.meters * wPerM;
    const safetyPower = rawPower * 1.20; // 20% Scharfer safety margin
    if (calculatedWattsText) calculatedWattsText.textContent = `${safetyPower.toFixed(1)} W`;
  }

  // Step Switcher
  function renderStep() {
    nodes.forEach(n => {
      const s = parseInt(n.dataset.step, 10);
      n.classList.remove('active', 'completed');
      if (s === step) n.classList.add('active');
      else if (s < step) n.classList.add('completed');
    });

    panes.forEach((p, idx) => {
      if (idx + 1 === step) p.classList.add('active');
      else p.classList.remove('active');
    });

    if (btnPrev) btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
    if (btnNext) {
      if (step === maxSteps) {
        btnNext.style.display = 'none';
      } else {
        btnNext.style.display = 'inline-block';
        btnNext.textContent = step === maxSteps - 1 ? 'Podsumuj Zestaw ▶' : 'Dalej ▶';
      }
    }

    if (step === maxSteps) {
      renderSchematicSummary();
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (step < maxSteps) {
        step++;
        renderStep();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (step > 1) {
        step--;
        renderStep();
      }
    });
  }

  nodes.forEach(n => {
    n.addEventListener('click', () => {
      const s = parseInt(n.dataset.step, 10);
      if (s <= step || s === step + 1) {
        step = s;
        renderStep();
      }
    });
  });

  // Step 5 Recommendation System Rendering
  function renderSchematicSummary() {
    const listEl = document.getElementById('schematicItemsList');
    const catalogPriceText = document.getElementById('catalogPriceText');
    const finalPriceHero = document.getElementById('finalPriceHero');
    const btnAddCart = document.getElementById('btnAddSystemToCart');

    if (!listEl || typeof products === 'undefined') return;

    // 1. Matching LED Strip
    let strip = products.find(p => p.category && p.category.includes('Taśmy') && (p.title.includes(state.colorTemp) || p.title.includes(state.tech)));
    if (!strip) strip = products.find(p => p.category && p.category.includes('Taśmy')) || products[0];

    // 2. Matching Scharfer Power Supply (+20% reserve)
    const wPerM = state.colorTemp === 'RGB' ? 18.0 : 14.4;
    const requiredW = state.meters * wPerM * 1.20;

    let psu = products.find(p => p.category && p.category.includes('Zasilacze') && p.price >= (requiredW * 0.75));
    if (!psu) psu = products.find(p => p.category && p.category.includes('Zasilacze')) || products[1];

    // 3. Matching Prescot Touch Remote Controller
    let ctrl = products.find(p => p.category && p.category.includes('Sterowniki') && (p.title.toLowerCase().includes('touch') || p.title.toLowerCase().includes('pilot')));
    if (!ctrl) ctrl = products.find(p => p.category && p.category.includes('Sterowniki')) || products[2];

    const meters = state.meters;
    const bundleItems = [
      {
        product: strip,
        qty: meters,
        unit: 'm',
        displayTitle: `${strip.title} (${meters}m)`,
        total: strip.price * meters
      },
      {
        product: psu,
        qty: 1,
        unit: 'szt.',
        displayTitle: `${psu.title} (Zapas mocy +20%)`,
        total: psu.price
      },
      {
        product: ctrl,
        qty: 1,
        unit: 'szt.',
        displayTitle: `${ctrl.title}`,
        total: ctrl.price
      }
    ];

    let html = '';
    let totalCat = 0;

    bundleItems.forEach(it => {
      totalCat += it.total;
      html += `
        <div class="schematic-item-row">
          <img src="${it.product.images[0]}" alt="${it.product.title}" class="schematic-img">
          <div class="schematic-details">
            <div class="schematic-title">${it.displayTitle}</div>
            <div class="schematic-sub">Ilość: ${it.qty} ${it.unit} | Kategoria: ${it.product.category}</div>
          </div>
          <div class="schematic-price">${it.total.toFixed(2)} zł</div>
        </div>
      `;
    });

    listEl.innerHTML = html;

    const totalFinal = totalCat * 0.90; // 10% Bundle Discount

    if (catalogPriceText) catalogPriceText.textContent = `${totalCat.toFixed(2)} zł`;
    if (finalPriceHero) finalPriceHero.innerHTML = `${totalFinal.toFixed(2)} <span>PLN</span>`;

    if (btnAddCart) {
      btnAddCart.onclick = () => {
        let cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
        
        bundleItems.forEach(it => {
          const discPrice = (it.total * 0.90) / it.qty;
          const existing = cart.find(c => c.id === it.product.id);
          if (existing) {
            existing.quantity += it.qty;
          } else {
            cart.push({
              id: it.product.id,
              title: it.product.title,
              price: discPrice,
              image: it.product.images[0],
              quantity: it.qty,
              category: it.product.category
            });
          }
        });

        localStorage.setItem('prescot_cart', JSON.stringify(cart));
        if (typeof updateCartCount === 'function') updateCartCount();
        alert("Zestaw Systemowy Prescot LED z 10% rabatem został pomyślnie dodany do koszyka!");
        window.location.href = 'cart.html';
      };
    }
  }

  recalculateWatts();
  renderStep();
});
