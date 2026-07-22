document.addEventListener('DOMContentLoaded', () => {
  // Configurator State
  let currentStep = 1;
  const totalSteps = 5;

  const configState = {
    location: 'kitchen',
    ipRating: 'IP20',
    lengthMeters: 5,
    colorTemp: '3000K',
    stripTech: 'COB',
    controlType: 'touch-remote'
  };

  // DOM Elements
  const progressFill = document.getElementById('progressFill');
  const stepItems = document.querySelectorAll('.step-item');
  const stepPanes = document.querySelectorAll('.step-pane');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  const lengthRangeInput = document.getElementById('lengthRangeInput');
  const lengthDisplayValue = document.getElementById('lengthDisplayValue');
  const calculatedPowerWatt = document.getElementById('calculatedPowerWatt');

  // Option Cards Listener Handler
  function bindOptionCards(paneId, keyToUpdate) {
    const pane = document.getElementById(paneId);
    if (!pane) return;
    const cards = pane.querySelectorAll('.option-select-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const val = card.dataset.value;
        configState[keyToUpdate] = val;

        if (card.dataset.ip) configState.ipRating = card.dataset.ip;
        if (card.dataset.tech) configState.stripTech = card.dataset.tech;

        updatePowerCalculation();
      });
    });
  }

  bindOptionCards('paneStep1', 'location');
  bindOptionCards('paneStep3', 'colorTemp');
  bindOptionCards('paneStep4', 'controlType');

  // Length Range Slider Handler
  if (lengthRangeInput) {
    lengthRangeInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      configState.lengthMeters = val;
      if (lengthDisplayValue) lengthDisplayValue.innerHTML = `${val} <span>metrów</span>`;
      updatePowerCalculation();
    });
  }

  function updatePowerCalculation() {
    const wattPerMeter = configState.colorTemp === 'RGB' ? 18.0 : (configState.stripTech === 'COB' ? 14.4 : 10.8);
    const rawPower = configState.lengthMeters * wattPerMeter;
    const safetyPower = rawPower * 1.20; // 20% safety margin for Scharfer power supply
    if (calculatedPowerWatt) {
      calculatedPowerWatt.textContent = `${safetyPower.toFixed(1)} W`;
    }
  }

  // Wizard Step Navigation
  function updateStepUI() {
    // Progress Fill %
    const fillPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (progressFill) progressFill.style.width = `${fillPercent}%`;

    // Step Items
    stepItems.forEach(item => {
      const stepNum = parseInt(item.dataset.step, 10);
      item.classList.remove('active', 'completed');
      if (stepNum === currentStep) item.classList.add('active');
      else if (stepNum < currentStep) item.classList.add('completed');
    });

    // Step Panes
    stepPanes.forEach((pane, idx) => {
      if (idx + 1 === currentStep) pane.classList.add('active');
      else pane.classList.remove('active');
    });

    // Buttons
    if (btnPrev) btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (btnNext) {
      if (currentStep === totalSteps) {
        btnNext.style.display = 'none';
      } else {
        btnNext.style.display = 'inline-block';
        btnNext.textContent = currentStep === totalSteps - 1 ? 'Podsumuj Zestaw ▶' : 'Dalej ▶';
      }
    }

    if (currentStep === totalSteps) {
      generateBundleRecommendation();
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });
  }

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetStep = parseInt(item.dataset.step, 10);
      if (targetStep <= currentStep || targetStep === currentStep + 1) {
        currentStep = targetStep;
        updateStepUI();
      }
    });
  });

  // Bundle Recommendation Generator (Step 5)
  function generateBundleRecommendation() {
    const bundleList = document.getElementById('bundleItemsList');
    const summaryCatalogPrice = document.getElementById('summaryCatalogPrice');
    const summaryFinalPrice = document.getElementById('summaryFinalPrice');
    const addBundleToCartBtn = document.getElementById('addBundleToCartBtn');

    if (!bundleList || typeof products === 'undefined') return;

    // 1. Select matching LED Strip
    let stripMatch = products.find(p => p.category && p.category.includes('Taśmy') && (p.title.includes(configState.colorTemp) || p.title.includes(configState.stripTech)));
    if (!stripMatch) stripMatch = products.find(p => p.category && p.category.includes('Taśmy')) || products[0];

    // 2. Select matching Scharfer Power Supply (Power >= Needed Power with 20% safety margin)
    const wattPerMeter = configState.colorTemp === 'RGB' ? 18.0 : 14.4;
    const requiredPower = configState.lengthMeters * wattPerMeter * 1.20;

    let psuMatch = products.find(p => p.category && p.category.includes('Zasilacze') && p.price >= (requiredPower * 0.8));
    if (!psuMatch) psuMatch = products.find(p => p.category && p.category.includes('Zasilacze')) || products[1];

    // 3. Select matching Prescot Controller
    let ctrlMatch = products.find(p => p.category && p.category.includes('Sterowniki') && (p.title.includes('touch') || p.title.includes('pilot')));
    if (!ctrlMatch) ctrlMatch = products.find(p => p.category && p.category.includes('Sterowniki')) || products[2];

    // Build Recommendation List Items
    const meters = configState.lengthMeters;
    const items = [
      {
        product: stripMatch,
        qty: meters,
        unit: 'm',
        customTitle: `${stripMatch.title} (${meters}m)`,
        priceTotal: stripMatch.price * meters
      },
      {
        product: psuMatch,
        qty: 1,
        unit: 'szt.',
        customTitle: `${psuMatch.title} (Zapas mocy +20%)`,
        priceTotal: psuMatch.price
      },
      {
        product: ctrlMatch,
        qty: 1,
        unit: 'szt.',
        customTitle: `${ctrlMatch.title}`,
        priceTotal: ctrlMatch.price
      }
    ];

    // Render HTML Items
    let html = '';
    let totalCatalog = 0;

    items.forEach(it => {
      totalCatalog += it.priceTotal;
      html += `
        <div class="bundle-item-card">
          <img src="${it.product.images[0]}" alt="${it.product.title}" class="bundle-item-img">
          <div class="bundle-item-info">
            <div class="bundle-item-title">${it.customTitle}</div>
            <div class="bundle-item-spec">Ilość: ${it.qty} ${it.unit} | ${it.product.category}</div>
          </div>
          <div class="bundle-item-price">${it.priceTotal.toFixed(2)} zł</div>
        </div>
      `;
    });

    bundleList.innerHTML = html;

    const totalDiscounted = totalCatalog * 0.90; // 10% Bundle Discount

    if (summaryCatalogPrice) summaryCatalogPrice.textContent = `${totalCatalog.toFixed(2)} zł`;
    if (summaryFinalPrice) summaryFinalPrice.innerHTML = `${totalDiscounted.toFixed(2)} <span>PLN</span>`;

    // Add Bundle to Cart
    if (addBundleToCartBtn) {
      addBundleToCartBtn.onclick = () => {
        let cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
        
        items.forEach(it => {
          const discountedUnitPrice = (it.priceTotal * 0.90) / it.qty;
          const existing = cart.find(c => c.id === it.product.id);
          if (existing) {
            existing.quantity += it.qty;
          } else {
            cart.push({
              id: it.product.id,
              title: it.product.title,
              price: discountedUnitPrice,
              image: it.product.images[0],
              quantity: it.qty,
              category: it.product.category
            });
          }
        });

        localStorage.setItem('prescot_cart', JSON.stringify(cart));
        
        // Trigger cart badge update
        if (typeof updateCartCount === 'function') updateCartCount();
        
        alert("Zestaw Prescot LED z 10% rabatem pakietowym został pomyślnie dodany do koszyka!");
        window.location.href = 'cart.html';
      };
    }
  }

  // Initialize
  updatePowerCalculation();
  updateStepUI();
});
