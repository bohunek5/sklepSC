document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('configuratorForm');
  if (!form) return;
  if (typeof window.initSharedPopups === 'function') window.initSharedPopups();

  const state = {
    application: null,
    intensity: null,
    technology: 'auto',
    light: null,
    length: 5,
    segments: 1,
    environment: null,
    control: null,
    voltage: 'auto'
  };

  const applicationData = {
    kitchen: { title: 'Blat i zabudowa kuchenna', meta: 'Światło robocze · preferowane CRI 90+', image: 'images/kuchnia_opt.webp' },
    living: { title: 'Salon, sufit i wnęka', meta: 'Światło pośrednie lub dekoracyjne', image: 'images/elegant-interior-design-with-neutral-colors-2026-03-25-07-06-00-utc.webp' },
    stairs: { title: 'Schody i komunikacja', meta: 'Linia orientacyjna · umiarkowana moc', image: 'images/configurator/application-stairs.webp' },
    bathroom: { title: 'Łazienka i strefa wilgotna', meta: 'Wymagana weryfikacja strefy i IP', image: 'images/configurator/application-bathroom.webp' },
    outdoor: { title: 'Elewacja, taras i ogród', meta: 'Warunki zewnętrzne · IP65 lub IP67', image: 'images/configurator/application-outdoor.webp' },
    commercial: { title: 'Ekspozycja i długie ciągi', meta: 'Wysokie CRI · systemy do 48 V', image: 'images/configurator/application-retail.webp' }
  };

  const labels = {
    application: { kitchen: 'Kuchnia', living: 'Salon / wnęka', stairs: 'Schody', bathroom: 'Łazienka', outdoor: 'Zewnętrzne', commercial: 'Komercyjne' },
    intensity: { decorative: 'Akcent', functional: 'Funkcjonalne', strong: 'Wysoki strumień' },
    technology: { auto: 'Automatycznie', cob: 'COB', smd: 'SMD' },
    light: { warm: 'Ciepła biel', neutral: 'Neutralna biel', cold: 'Zimna biel', cct: 'CCT', rgb: 'RGB', rgbw: 'RGBW / RGB+CCT' },
    environment: { dry: 'IP20 · sucho', damp: 'IP63+ · wilgoć', outdoor: 'IP65 / IP67 · zewnętrzne' },
    control: { switch: 'Włącz / wyłącz', dimmer: 'Ściemnianie / pilot', smart: 'Aplikacja / smart' }
  };

  const stepElements = [...document.querySelectorAll('.config-step')];
  const stepIndicators = [...document.querySelectorAll('#stepList li')];
  const nextButton = document.getElementById('nextButton');
  const previousButton = document.getElementById('previousButton');
  const validationMessage = document.getElementById('validationMessage');
  const funnelStatus = document.getElementById('funnelStatus');
  const funnelCount = document.getElementById('funnelCount');
  const funnelMessage = document.getElementById('funnelMessage');
  const results = document.getElementById('results');
  const resultContent = document.getElementById('resultContent');
  const lengthInput = document.getElementById('lengthInput');
  const segmentsInput = document.getElementById('segmentsInput');
  let currentStep = 0;
  let catalog = [];
  let tapes = [];
  let selectedResult = null;

  const normalize = ConfiguratorCore.normalize;

  const productText = ConfiguratorCore.productText;

  const stockNumber = ConfiguratorCore.stockNumber;
  const firstNumber = ConfiguratorCore.firstNumber;
  const productVoltage = ConfiguratorCore.productVoltage;
  const productPower = ConfiguratorCore.productPower;
  const productLumens = ConfiguratorCore.productLumens;
  const productIp = ConfiguratorCore.productIp;
  const productCri = ConfiguratorCore.productCri;
  const productWidth = ConfiguratorCore.productWidth;
  const productTechnology = ConfiguratorCore.productTechnology;

  const productLight = ConfiguratorCore.productLight;

  const normalizeTape = ConfiguratorCore.normalizeTape;

  const isTape = ConfiguratorCore.isTape;

  const hasRequiredTapeData = ConfiguratorCore.hasRequiredTapeData;

  const applicationMatches = ConfiguratorCore.applicationMatches;

  const intensityMatches = ConfiguratorCore.intensityMatches;

  const environmentMatches = ConfiguratorCore.environmentMatches;

  const controlMatches = ConfiguratorCore.controlMatches;

  const tapeMatches = ConfiguratorCore.tapeMatches;

  const filteredTapes = (configuration = state) => ConfiguratorCore.filteredTapes(tapes, configuration);

  function optionCount(input) {
    const hypothetical = { ...state, [input.name]: input.value };
    if (input.name === 'technology' && input.value === 'auto') hypothetical.technology = 'auto';
    if (input.name === 'voltage' && input.value === 'auto') hypothetical.voltage = 'auto';
    return filteredTapes(hypothetical).length;
  }

  function refreshOptionAvailability() {
    form.querySelectorAll('input[type="radio"]').forEach((input) => {
      const label = input.closest('label');
      if (!label) return;
      const availability = label.querySelector('.option-availability');
      const count = optionCount(input);
      input.disabled = count === 0;
      label.classList.toggle('is-unavailable', count === 0);
      if (availability) availability.textContent = count ? `${count} zgodnych` : 'Brak zgodnych';
    });
  }

  function currentStepValid() {
    if (currentStep === 0) return Boolean(state.application);
    if (currentStep === 1) return Boolean(state.intensity);
    if (currentStep === 2) return Boolean(state.technology);
    if (currentStep === 3) return Boolean(state.light);
    if (currentStep === 4) return state.length >= 0.5 && state.length <= 200 && state.segments >= 1 && state.segments <= 20;
    if (currentStep === 5) return Boolean(state.environment);
    return Boolean(state.control && state.voltage && controlMatches(state) && filteredTapes().length);
  }

  function refreshFunnel() {
    refreshOptionAvailability();
    const count = filteredTapes().length;
    funnelCount.textContent = String(count);
    funnelStatus.classList.toggle('is-empty', count === 0);
    funnelMessage.textContent = count ? 'taśm spełnia dotychczasowe warunki' : 'zmień ostatni wybór — ta kombinacja nie występuje w katalogu';
    nextButton.disabled = !currentStepValid();
    validationMessage.textContent = count ? '' : 'Ta kombinacja parametrów nie ma dostępnego produktu.';
  }

  function updateProjectVisual() {
    const data = applicationData[state.application];
    if (!data) return;
    const visual = document.getElementById('projectVisual');
    visual.style.backgroundImage = `linear-gradient(0deg, rgba(6,19,36,.92), rgba(6,19,36,.08)), url("${data.image}")`;
    document.getElementById('projectVisualTitle').textContent = data.title;
    document.getElementById('projectVisualMeta').textContent = data.meta;
  }

  function updateLengthTip() {
    const tip = document.getElementById('lengthTip');
    if (state.length >= 20) tip.textContent = `${state.length} m to długi ciąg. Porównamy 24 V i 48 V oraz podzielimy obciążenie zasilaczy.`;
    else if (state.length > 10) tip.textContent = `${state.length} m może wymagać zasilania z kilku punktów lub podziału na krótsze sekcje.`;
    else tip.textContent = `Dla ${state.length} m standardowy system 12 V lub 24 V zwykle nie wymaga złożonego podziału.`;
  }

  function renderStep() {
    stepElements.forEach((element, index) => { element.hidden = index !== currentStep; });
    const currentFieldset = stepElements[currentStep];
    const h2 = currentFieldset.querySelector('.step-description') || currentFieldset.querySelector('h3, h2');
    const actions = document.querySelector('.step-actions');
    if (h2 && actions) {
      h2.insertAdjacentElement('afterend', actions);
    }
    stepIndicators.forEach((element, index) => {
      element.classList.toggle('active', index === currentStep);
      element.classList.toggle('complete', index < currentStep);
    });
    document.getElementById('progressText').textContent = `${currentStep + 1} / ${stepElements.length}`;
    document.getElementById('progressBar').style.width = `${((currentStep + 1) / stepElements.length) * 100}%`;
    previousButton.hidden = currentStep === 0;
    nextButton.textContent = currentStep === stepElements.length - 1 ? 'Pokaż konkretne produkty' : 'Dalej';
    refreshFunnel();
  }

  const parseRollLength = ConfiguratorCore.parseRollLength;

  const scoreTape = (tape) => ConfiguratorCore.scoreTape(tape, state);

  const chooseCandidates = () => ConfiguratorCore.chooseCandidates(tapes, state);

  const categoryProducts = (fragment) => ConfiguratorCore.categoryProducts(catalog, fragment);

  const powerSupplyPlan = (tape) => ConfiguratorCore.powerSupplyPlan(tape, state, catalog);

  const controllerChannels = ConfiguratorCore.controllerChannels;

  const controllerPlan = (tape, psuPlan) => ConfiguratorCore.controllerPlan(tape, psuPlan, state, catalog);

  function formatPrice(value) {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(Number(value) || 0);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function productImage(product) {
    return product?.images?.[0] || 'images/okladka-produkty.webp';
  }

  function productUrl(product) {
    return `product.html?id=${encodeURIComponent(product.id)}`;
  }

  function selectionReasons(tape) {
    const reasons = [
      `${tape.technology} i ${tape.power} W/m odpowiadają wybranemu efektowi`,
      `${tape.voltage} V pasuje do długości i wybranej architektury systemu`,
      `IP${tape.ip}${tape.cri ? ` · CRI ${tape.cri}` : ''}${tape.lumens ? ` · ${tape.lumens} lm/m` : ''}`
    ];
    return reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('');
  }

  function renderSystemItem(role, product, quantity, specs = []) {
    return `<article class="system-item" style="cursor: pointer;" onclick="if(window.openQuickView) window.openQuickView('${product.id}')"><div class="system-image"><img src="${escapeHtml(productImage(product))}" alt="" loading="lazy"></div><div class="system-info"><span class="system-role">${escapeHtml(role)}</span><h4>${escapeHtml(product.title)}</h4><div class="spec-pills">${specs.map((spec) => `<span>${escapeHtml(spec)}</span>`).join('')}<span>${quantity} szt.</span></div></div><div class="system-price"><strong>${formatPrice(product.price * quantity)}</strong><small>${formatPrice(product.price)} / szt.</small></div></article>`;
  }

  function renderAlternatives(alternatives) {
    if (!alternatives.length) return '';
    return `<section class="alternatives funnel-alternatives"><div class="alternatives-header"><h3>Jeszcze ${alternatives.length === 1 ? 'jeden zgodny wariant' : 'dwa zgodne warianty'}</h3><span>Różnią się parametrami lub długością rolki</span></div><div class="alternatives-grid">${alternatives.map((tape) => `<article class="alternative-card"><img src="${escapeHtml(productImage(tape.product))}" alt="" loading="lazy"><div class="alternative-body"><h4>${escapeHtml(tape.product.title)}</h4><strong>${formatPrice(tape.product.price)}</strong></div><button class="mockup-btn mockup-btn-outline select-product-button" type="button" data-select-tape="${tape.product.id}" style="height: 36px; padding: 0 15px;">Wybierz ten wariant</button></article>`).join('')}</div></section>`;
  }

  function renderResult(primary, alternatives) {
    const tapeProduct = primary.product;
    const rollLength = parseRollLength(tapeProduct);
    const tapeQuantity = Math.max(1, Math.ceil(state.length / rollLength));
    const psu = powerSupplyPlan(primary);
    const controller = controllerPlan(primary, psu);
    const ready = Boolean(psu.product && (!controller.required || controller.product));
    const systemItems = [];
    if (psu.product) systemItems.push(renderSystemItem('Zasilanie', psu.product, psu.quantity, [`${psu.wattsEach} W / szt.`, `${primary.voltage} V`, `rezerwa ≥ 20%`]));
    if (controller.product) systemItems.push(renderSystemItem('Sterowanie', controller.product, controller.quantity, [controllerChannels(state.light).toUpperCase(), `${primary.voltage} V`, labels.control[state.control]]));
    systemItems.push(`<article class="system-item advisory"><div class="advisory-icon">P</div><div class="system-info"><span class="system-role">Profil i montaż</span><h4>Dobierz profil do szerokości ${primary.width ? `${primary.width} mm` : 'taśmy'} i sposobu odprowadzania ciepła</h4><div class="spec-pills"><span>profil aluminiowy</span><span>klosz</span><span>przewody i złącza</span></div></div><span class="status-pill warning">Do weryfikacji</span></article>`);
    if (!psu.product) systemItems.unshift(`<article class="system-item advisory"><div class="advisory-icon">!</div><div class="system-info"><span class="system-role">Zasilanie</span><h4>${escapeHtml(psu.reason)}</h4><div class="spec-pills"><span>${psu.required.toFixed(1)} W z rezerwą</span><span>${primary.voltage} V</span></div></div><span class="status-pill warning">Brak w katalogu</span></article>`);
    if (controller.required && !controller.product) systemItems.push(`<article class="system-item advisory"><div class="advisory-icon">!</div><div class="system-info"><span class="system-role">Sterowanie</span><h4>${escapeHtml(controller.reason)}</h4></div><span class="status-pill warning">Brak w katalogu</span></article>`);

    const bundleTotal = tapeProduct.price * tapeQuantity + (psu.product ? psu.product.price * psu.quantity : 0) + (controller.product ? controller.product.price * controller.quantity : 0);
    const longRun = state.length > 10 || primary.voltage === 48;
    resultContent.innerHTML = `
      <div class="funnel-result-summary"><i>→</i><strong>1 produkt główny${alternatives.length ? ` + ${alternatives.length} alternatyw${alternatives.length === 1 ? 'a' : 'y'}` : ''}</strong><small>z puli ${filteredTapes().length} zgodnych taśm</small></div>
      <div class="result-context"><span>${escapeHtml(labels.application[state.application])}</span><span>${escapeHtml(labels.intensity[state.intensity])}</span><span>${escapeHtml(labels.light[state.light])}</span><span>${state.length} m · ${state.segments} odc.</span><span>${escapeHtml(labels.environment[state.environment])}</span><span>${primary.voltage} V</span></div>
      <article class="selected-tape-card" style="cursor: pointer;" onclick="if(window.openQuickView) window.openQuickView('${tapeProduct.id}')"><div class="selected-tape-media"><span class="best-match-badge">Najlepsze dopasowanie</span><img src="${escapeHtml(productImage(tapeProduct))}" alt="${escapeHtml(tapeProduct.title)}"></div><div class="selected-tape-content"><span class="product-origin">Prescot LED · dostępny produkt</span><h3>${escapeHtml(tapeProduct.title)}</h3><div class="product-codes"><span><b>SKU:</b> ${escapeHtml(tapeProduct.kod_handlowy || tapeProduct.kod_katalogowy || tapeProduct.id)}</span><span><b>EAN:</b> ${escapeHtml(tapeProduct.ean || '—')}</span></div><div class="product-spec-grid"><div><small>Napięcie</small><strong>${primary.voltage} V</strong></div><div><small>Moc</small><strong>${primary.power} W/m</strong></div><div><small>Ochrona</small><strong>IP${primary.ip}</strong></div><div><small>Technologia</small><strong>${primary.technology}</strong></div><div><small>Strumień</small><strong>${primary.lumens || '—'}${primary.lumens ? ' lm/m' : ''}</strong></div></div><div class="selection-reasons"><strong>Dlaczego ten wariant</strong><ul>${selectionReasons(primary)}</ul></div><p class="packaging-warning">Potrzebujesz ${state.length} m. Produkt jest rozliczany jako ${rollLength === 1 ? 'metr bieżący' : `rolka ${rollLength} m`}; do koszyka trafi ${tapeQuantity} ${rollLength === 1 ? 'm' : 'szt'}.</p><div class="selected-buy-row" style="flex-wrap: wrap; gap: 12px;"><div class="selected-price" style="width: 100%; margin-bottom: 5px;"><strong>${formatPrice(tapeProduct.price)}</strong><small>cena katalogowa produktu</small></div><div class="configurator-actions-row" style="display: flex; flex-direction: column; gap: 8px; width: 100%;"><button class="add-to-cart-btn tape-cart-button" type="button" data-action="add-tape" aria-label="Dodaj do koszyka" style="width: 100%; border: none; padding: 0;" onclick="event.stopPropagation();"><span class="btn-slide-wrap"><span class="btn-txt-default">Dodaj do koszyka</span><span class="btn-txt-hover"><i class="ph ph-shopping-cart-simple" style="margin-right: 6px;"></i> Dodaj teraz!</span></span></button><button class="mockup-btn mockup-btn-outline" type="button" style="width: 100%; height: 42px;" onclick="event.stopPropagation(); if(window.openQuickView) window.openQuickView('${tapeProduct.id}')">Sprawdź produkt</button></div></div></div></article>
      ${renderAlternatives(alternatives)}
      <div class="system-section-title"><div><p class="section-kicker">Plan kompatybilnego toru</p><h3>Zasilanie i sterowanie</h3></div><p>Obciążenie liczymy z mocy wybranej taśmy i dodajemy co najmniej 20% rezerwy. Przy dużej mocy system dzielimy na kilka zasilaczy.</p></div>
      <div class="result-grid"><div class="system-list"><div class="system-list-header"><h3>Elementy systemu</h3><span>${ready ? 'Elementy katalogowe dobrane' : 'Wymagana konsultacja techniczna'}</span></div>${systemItems.join('')}</div><aside class="bundle-summary"><h3>Podsumowanie techniczne</h3><p>Bez fikcyjnego rabatu i bez udawania ostatecznej wyceny instalacji.</p><div class="calculation"><div><span>Moc taśmy</span><strong>${psu.load.toFixed(1)} W</strong></div><div><span>Wymagana moc z rezerwą</span><strong>${psu.required.toFixed(1)} W</strong></div><div><span>Dobrane zasilanie</span><strong>${psu.product ? `${psu.quantity} × ${psu.wattsEach} W` : 'do konsultacji'}</strong></div><div><span>Opakowania / metry taśmy</span><strong>${tapeQuantity}</strong></div></div><div class="bundle-total"><span>Suma produktów</span><strong>${formatPrice(bundleTotal)}</strong></div><div class="configurator-actions-row" style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 12px;"><button class="add-to-cart-btn bundle-button" type="button" data-action="add-bundle" style="width: 100%; border: none; padding: 0;" ${ready ? '' : 'disabled'}><span class="btn-slide-wrap"><span class="btn-txt-default">Dodaj zestaw</span><span class="btn-txt-hover"><i class="ph ph-shopping-cart-simple" style="margin-right: 6px;"></i> Dodaj teraz!</span></span></button></div><p class="bundle-note">Cena, stany i zamówienie muszą zostać potwierdzone przez backend.</p>${ready ? '' : '<p class="result-warning">Zestaw nie jest kompletny w lokalnym katalogu. Dodaj samą taśmę albo skonsultuj brakujący element.</p>'}${longRun ? '<p class="result-warning">Długi ciąg wymaga projektu punktów zasilania, przekrojów przewodów i kontroli spadków napięcia.</p>' : ''}</aside></div>`;

    selectedResult = { primary, alternatives, tapeQuantity, psu, controller, ready };
    results.hidden = false;
    bindResultActions();
      }

  function renderResults() {
    const candidates = chooseCandidates();
    if (!candidates.length) {
      results.hidden = false;
      resultContent.innerHTML = '<div class="no-results"><h3>Ta kombinacja nie występuje w aktualnym katalogu.</h3><p>Wróć o krok i zmień jeden parametr. Konfigurator nie zastąpi brakującego produktu przypadkowym odpowiednikiem.</p><button class="mockup-btn mockup-btn-outline" type="button" id="returnToConfiguration" style="margin-top: 15px;">Wróć do konfiguracji</button></div>';
      document.getElementById('returnToConfiguration').onclick = () => { results.hidden = true; };
      return;
    }
    renderResult(candidates[0], candidates.slice(1));
  }

  function cartRecord(product, quantity) {
    return { id: product.id, title: product.title, price: Number(product.price), image: productImage(product), qty: quantity, category: product.category };
  }

  function addItemsToCart(items) {
    const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    items.forEach((item) => {
      const existing = cart.find((entry) => String(entry.id) === String(item.id));
      if (existing) existing.qty = Number(existing.qty || existing.quantity || 0) + item.qty;
      else cart.push(item);
    });
    localStorage.setItem('prescot_cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(items.length > 1 ? 'Zestaw zapisany w koszyku.' : 'Taśma zapisana w koszyku.');
  }

  function bindResultActions() {
    document.querySelector('[data-action="add-tape"]')?.addEventListener('click', () => addItemsToCart([cartRecord(selectedResult.primary.product, selectedResult.tapeQuantity)]));
    document.querySelector('[data-action="quick-buy-tape"]')?.addEventListener('click', () => {
      addItemsToCart([cartRecord(selectedResult.primary.product, selectedResult.tapeQuantity)]);
      window.location.href = 'checkout.html';
    });
    document.querySelector('[data-action="add-bundle"]')?.addEventListener('click', () => {
      if (!selectedResult.ready) return;
      const items = [cartRecord(selectedResult.primary.product, selectedResult.tapeQuantity), cartRecord(selectedResult.psu.product, selectedResult.psu.quantity)];
      if (selectedResult.controller.product) items.push(cartRecord(selectedResult.controller.product, selectedResult.controller.quantity));
      addItemsToCart(items);
    });
    document.querySelector('[data-action="quick-buy-bundle"]')?.addEventListener('click', () => {
      if (!selectedResult.ready) return;
      const items = [cartRecord(selectedResult.primary.product, selectedResult.tapeQuantity), cartRecord(selectedResult.psu.product, selectedResult.psu.quantity)];
      if (selectedResult.controller.product) items.push(cartRecord(selectedResult.controller.product, selectedResult.controller.quantity));
      addItemsToCart(items);
      window.location.href = 'checkout.html';
    });
    document.querySelectorAll('[data-select-tape]').forEach((button) => button.addEventListener('click', () => {
      const id = String(button.dataset.selectTape);
      const selected = selectedResult.alternatives.find((tape) => String(tape.product.id) === id);
      if (!selected) return;
      const remaining = [selectedResult.primary, ...selectedResult.alternatives.filter((tape) => String(tape.product.id) !== id)].slice(0, 2);
      renderResult(selected, remaining);
    }));
  }

  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    const count = cart.reduce((total, item) => total + Number(item.qty || item.quantity || 0), 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = String(count);
    if (typeof window.updateCartCount === 'function') window.updateCartCount();
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  form.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.type === 'radio') state[input.name] = input.value;
    if (input.name === 'application') updateProjectVisual();
    refreshFunnel();
  });

  [lengthInput, segmentsInput].forEach((input) => input.addEventListener('input', () => {
    state.length = Number(lengthInput.value);
    state.segments = Number(segmentsInput.value);
    updateLengthTip();
    refreshFunnel();
  }));

  nextButton.addEventListener('click', () => {
    if (!currentStepValid()) {
      validationMessage.textContent = 'Uzupełnij ten krok, aby przejść dalej.';
      return;
    }
    if (currentStep < stepElements.length - 1) {
      currentStep += 1;
      renderStep();
          } else renderResults();
  });

  previousButton.addEventListener('click', () => {
    if (currentStep === 0) return;
    currentStep -= 1;
    results.hidden = true;
    renderStep();
  });

  document.getElementById('editConfiguration').addEventListener('click', () => {
    results.hidden = true;
      });

  const header = document.getElementById('siteHeader');
  const logo = header.querySelector('.brand img');
  function updateHeader() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    logo.src = scrolled || header.classList.contains('menu-active') ? logo.dataset.dark : logo.dataset.light;
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
    header.classList.toggle('menu-active', !expanded);
    document.body.classList.toggle('menu-open', !expanded);
    updateHeader();
  });

  async function loadCatalog() {
    try {
      const response = await fetch('js/prescot-imported-products.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      catalog = await response.json();
    } catch (error) {
      if (typeof products !== 'undefined' && Array.isArray(products)) catalog = products;
      else {
        document.getElementById('catalogError').hidden = false;
        document.getElementById('catalogLoading').hidden = true;
        form.hidden = true;
        console.error('Błąd katalogu konfiguratora:', error);
        return;
      }
    }
    tapes = catalog.filter(isTape).map(normalizeTape).filter(hasRequiredTapeData);
    document.getElementById('catalogLoading').hidden = true;
    updateCartBadge();
    updateLengthTip();
    renderStep();
  }

  updateHeader();
  loadCatalog();

  

});
