document.addEventListener('DOMContentLoaded', () => {
  const state = {
    environment: 'living',
    shape: 'line',
    dimensions: [200],
    light: 'white',
    temperature: 3000,
    technology: 'cob',
    profile: 'surface',
    diffuser: 'milky',
    powerPlacement: 'slim',
    control: 'switch',
    plugPlay: false,
    proMode: false
  };

  const environments = {
    living: { name: 'Salon', ip: 20, image: 'images/configurator/living_new.png', powerBias: 0 },
    kitchen: { name: 'Kuchnia', ip: 44, image: 'images/configurator/kitchen_new.png', powerBias: 2 },
    bathroom: { name: 'Łazienka', ip: 65, image: 'images/configurator/bathroom_new.png', powerBias: 2 },
    outdoor: { name: 'Elewacja', ip: 67, image: 'images/configurator/outdoor_new.png', powerBias: 4 }
  };
  const shapes = {
    line: { name: 'Linia prosta', arms: 1, labels: ['Długość'] },
    l: { name: 'Kąt L', arms: 2, labels: ['Ramię A', 'Ramię B'] },
    u: { name: 'Podkowa U', arms: 3, labels: ['Ramię A', 'Ramię B', 'Ramię C'] },
    o: { name: 'Obwód O', arms: 4, labels: ['Góra', 'Prawa strona', 'Dół', 'Lewa strona'] }
  };
  const profiles = {
    surface: { name: 'Nawierzchniowy', unit: 31, sku: 'PROF-N14' },
    recessed: { name: 'Wpuszczany', unit: 38, sku: 'PROF-W12' },
    corner: { name: 'Kątowy 45°', unit: 43, sku: 'PROF-K10' }
  };
  const diffusers = {
    clear: { name: 'transparentny', loss: .88, price: 5 },
    frosted: { name: 'szroniony', loss: .8, price: 7 },
    milky: { name: 'mleczny', loss: .72, price: 9 },
    black: { name: 'czarny', loss: .48, price: 18 }
  };
  const controls = {
    switch: { name: 'Zwykły włącznik', price: 0, sku: null },
    remote: { name: 'Pilot radiowy', price: 69, sku: 'CTRL-RF' },
    wifi: { name: 'Sterownik Wi‑Fi', price: 119, sku: 'CTRL-WIFI' },
    zigbee: { name: 'Sterownik Zigbee', price: 149, sku: 'CTRL-ZB' }
  };
  const stepTitles = ['Miejsce montażu', 'Kształt i wymiary', 'Rodzaj światła', 'Profil i klosz', 'Automatyczne zasilanie', 'Sterowanie'];
  const currency = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', minimumFractionDigits: 2 });
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const roundCut = (value) => Math.max(5, Math.ceil((Number(value) || 0) / 5) * 5);
  const formatLength = (meters) => `${meters.toLocaleString('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} m`;
  let currentStep = 0;
  let completedStep = 0;
  let calc = {};
  let toastTimer;

  function calculate() {
    const roundedDimensions = state.dimensions.map(roundCut);
    const lengthCm = roundedDimensions.reduce((sum, value) => sum + value, 0);
    const length = Math.max(.05, lengthCm / 100);
    const tapeWidth = state.light === 'rgbw' ? 12 : state.light === 'cct' ? 10 : 8;
    const wattsPerMeter = (state.light === 'rgbw' ? 18 : state.light === 'cct' ? 16 : 12) + environments[state.environment].powerBias;
    const power = Math.ceil(length * wattsPerMeter);
    const required = Math.ceil(power * 1.2);
    const voltage = length > 5 || power > 72 || state.environment === 'outdoor' ? 24 : 12;
    const supplySteps = [20, 30, 40, 60, 75, 100, 120, 150, 200, 240, 300, 360];
    const supply = supplySteps.find((value) => value >= required) || Math.ceil(required / 50) * 50;
    const tapeRate = state.technology === 'cob' ? 46 : 31;
    const lightPremium = state.light === 'rgbw' ? 24 : state.light === 'cct' ? 13 : 0;
    const environmentPremium = state.environment === 'outdoor' ? 18 : state.environment === 'bathroom' ? 11 : 0;
    const tapePrice = length * (tapeRate + lightPremium + environmentPremium);
    const profileLength = Math.ceil(length / 2) * 2;
    const profilePrice = profileLength * profiles[state.profile].unit;
    const diffuserPrice = profileLength * diffusers[state.diffuser].price;
    const corners = state.shape === 'l' ? 1 : state.shape === 'u' ? 2 : state.shape === 'o' ? 4 : 0;
    const accessoriesPrice = 18 + corners * 12;
    const supplyPrice = 49 + supply * .72 + (state.powerPlacement === 'wall' ? 30 : state.powerPlacement === 'plug' ? 22 : 0);
    const controlPrice = controls[state.control].price + (state.light === 'rgbw' && state.control === 'switch' ? 79 : 0);
    const plugPlayPrice = state.plugPlay ? 89 : 0;
    const total = Math.round(tapePrice + profilePrice + diffuserPrice + accessoriesPrice + supplyPrice + controlPrice + plugPlayPrice);
    const lumens = Math.round(length * (state.technology === 'cob' ? 960 : 820) * diffusers[state.diffuser].loss);
    const amplifier = power / voltage > 10 && ['remote', 'wifi', 'zigbee'].includes(state.control);
    return { roundedDimensions, lengthCm, length, tapeWidth, wattsPerMeter, power, required, voltage, supply, profileLength, corners, tapePrice, profilePrice, diffuserPrice, accessoriesPrice, supplyPrice, controlPrice, plugPlayPrice, total, lumens, amplifier };
  }

  function temperatureLabel() {
    const tone = state.temperature < 3500 ? 'ciepła' : state.temperature < 5000 ? 'neutralna' : 'zimna';
    return `${state.temperature} K · ${tone}`;
  }

  function lightShort() {
    if (state.light === 'rgbw') return 'Kolor RGBW';
    if (state.light === 'cct') return 'Zmienna biel';
    return state.temperature < 3500 ? 'Ciepła biel' : state.temperature < 5000 ? 'Neutralna biel' : 'Zimna biel';
  }

  function kelvinColor() {
    if (state.temperature <= 3000) return { core: '#fff1cb', glow: '#ffc477' };
    if (state.temperature <= 4200) return { core: '#fffdf3', glow: '#f2e2bd' };
    if (state.temperature <= 5200) return { core: '#eef9ff', glow: '#c4e9ff' };
    return { core: '#e1f4ff', glow: '#8fd2ff' };
  }

  function previewPath() {
    if (state.shape === 'l') return 'M220 92 V310 H570';
    if (state.shape === 'u') return 'M190 92 V310 H570 V92';
    if (state.shape === 'o') return 'M210 90 H550 V330 H210 Z';
    return 'M150 210 H610';
  }

  function updatePreview() {
    const path = previewPath();
    ['#ledCorePath', '#ledGlowPath', '#ledDotsPath', '#profileShadow'].forEach((selector) => $(selector).setAttribute('d', path));
    const color = kelvinColor();
    const rgb = state.light === 'rgbw';
    $('#ledCorePath').setAttribute('stroke', rgb ? 'url(#rgbGradient)' : color.core);
    $('#ledGlowPath').setAttribute('stroke', rgb ? 'url(#rgbGradient)' : color.glow);
    $('#ledGlowPath').setAttribute('opacity', state.diffuser === 'black' ? '.34' : state.diffuser === 'clear' ? '.86' : '.66');
    $('#ledCorePath').setAttribute('stroke-width', state.diffuser === 'clear' ? '5' : state.diffuser === 'milky' ? '9' : '7');
    $('#ledDotsPath').hidden = state.technology !== 'smd';
    $('#ledDotsPath').setAttribute('stroke', rgb ? 'url(#rgbGradient)' : '#fff');
    $('#dimensionMark').hidden = state.shape !== 'line';
    $('#dimensionText').textContent = `${calc.lengthCm} cm`;
    $('#shapeName').textContent = shapes[state.shape].name;
    $('#sceneMedia').style.backgroundImage = `url("${environments[state.environment].image}")`;
  }

  function selectButtons(field, value) {
    $$(`[data-field="${field}"]`).forEach((button) => {
      const selected = button.dataset.value === value;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function updateCompatibility() {
    const profileButtons = $$('.profile-card');
    profileButtons.forEach((button) => {
      button.disabled = Number(button.dataset.width) < calc.tapeWidth;
      button.setAttribute('aria-disabled', String(button.disabled));
    });
    if ($(`.profile-card[data-value="${state.profile}"]`)?.disabled) {
      state.profile = profileButtons.find((button) => !button.disabled)?.dataset.value || 'surface';
      selectButtons('profile', state.profile);
    }
    const blocked = profileButtons.filter((button) => button.disabled).length;
    $('#compatibilityNote').innerHTML = blocked
      ? `<i class="ph ph-shield-check" aria-hidden="true"></i><span>${blocked === 1 ? 'Profil 10 mm został zablokowany' : `${blocked} profile zostały zablokowane`}, ponieważ taśma ${state.light.toUpperCase()} ma ${calc.tapeWidth} mm szerokości.</span>`
      : `<i class="ph ph-check-circle" aria-hidden="true"></i><span>Wszystkie profile pasują do taśmy ${state.technology.toUpperCase()} ${calc.tapeWidth} mm.</span>`;
  }

  function buildBom() {
    const tapeName = state.light === 'rgbw' ? `Taśma ${state.technology.toUpperCase()} RGBW ${calc.voltage} V` : state.light === 'cct' ? `Taśma ${state.technology.toUpperCase()} CCT ${calc.voltage} V` : `Taśma ${state.technology.toUpperCase()} ${state.temperature} K ${calc.voltage} V`;
    const items = [
      { icon: 'ph-lightbulb-filament', sku: `LED-${state.technology.toUpperCase()}-${calc.voltage}V`, name: tapeName, qty: formatLength(calc.length), price: calc.tapePrice },
      { icon: 'ph-minus', sku: profiles[state.profile].sku, name: `Profil ${profiles[state.profile].name.toLowerCase()}`, qty: formatLength(calc.profileLength), price: calc.profilePrice },
      { icon: 'ph-selection-background', sku: `KLOSZ-${state.diffuser.toUpperCase()}`, name: `Klosz ${diffusers[state.diffuser].name}`, qty: formatLength(calc.profileLength), price: calc.diffuserPrice },
      { icon: 'ph-plugs-connected', sku: `PSU-${calc.voltage}V-${calc.supply}W`, name: `Zasilacz ${calc.voltage} V · ${calc.supply} W`, qty: '1 szt.', price: calc.supplyPrice },
      { icon: 'ph-screws', sku: `ACC-${state.shape.toUpperCase()}`, name: `Zaślepki, uchwyty i ${calc.corners ? `${calc.corners} łączniki kątowe` : 'przewody'}`, qty: 'komplet', price: calc.accessoriesPrice }
    ];
    if (controls[state.control].sku || state.light === 'rgbw') items.push({ icon: 'ph-sliders-horizontal', sku: controls[state.control].sku || 'CTRL-RGBW', name: controls[state.control].name, qty: '1 szt.', price: calc.controlPrice });
    if (calc.amplifier) items.push({ icon: 'ph-waveform', sku: 'AMP-10A', name: 'Wzmacniacz sygnału', qty: '1 szt.', price: 0, included: true });
    if (state.plugPlay) items.push({ icon: 'ph-wrench', sku: 'SERVICE-PNP', name: 'Usługa montażu Plug & Play', qty: '1 usł.', price: calc.plugPlayPrice });
    return items;
  }

  function renderBom() {
    $('#bomList').innerHTML = buildBom().map((item) => `<article class="bom-item"><i class="ph ${item.icon}" aria-hidden="true"></i><div><strong>${item.name}</strong><small>${item.sku} · ${item.qty}</small></div><b>${item.included ? 'w cenie' : currency.format(item.price)}</b></article>`).join('');
    $('#dialogTotal').textContent = currency.format(calc.total);
  }

  function updateAll() {
    calc = calculate();
    updateCompatibility();
    calc = calculate();
    updatePreview();
    $('#powerRingValue').textContent = calc.power;
    $('#powerSupplyTitle').textContent = `Zasilacz ${calc.voltage} V · ${calc.supply} W`;
    $('#powerSupplyCopy').textContent = `${calc.power} W obciążenia + 20% bezpiecznego zapasu mocy.`;
    $('#safetyMathText').textContent = `${formatLength(calc.length)} × ${calc.wattsPerMeter} W/m = ${calc.power} W · z zapasem: ${calc.required} W`;
    $('#voltageAlert').hidden = !(calc.length > 5 || calc.power > 72);
    $('#summaryName').textContent = `${state.technology.toUpperCase()} · ${lightShort().toLowerCase()} · ${formatLength(calc.length)}`;
    $('#summaryLength').textContent = formatLength(calc.length);
    $('#summaryPower').textContent = `${calc.power} W`;
    $('#summaryVoltage').textContent = `${calc.voltage} V`;
    $('#summarySupply').textContent = `${calc.supply} W`;
    $('#summaryPrice').textContent = currency.format(calc.total);
    $('#visualEnvironment').textContent = environments[state.environment].name;
    $('#visualLight').textContent = lightShort();
    $('#visualIp').textContent = `IP${environments[state.environment].ip}`;
    $('#visualLumens').textContent = `${calc.lumens.toLocaleString('pl-PL')} lm`;
    $('#temperatureValue').textContent = temperatureLabel();
    $('#temperatureValue').style.color = kelvinColor().glow;
    $('#temperatureRange').style.accentColor = kelvinColor().glow;
    $('#schemeSupply').textContent = `Zasilacz ${calc.voltage} V`;
    $('#schemeSupplyPower').textContent = `${calc.supply} W`;
    $('#schemeStripLength').textContent = formatLength(calc.length);
    const needsController = state.control !== 'switch' || ['cct', 'rgbw'].includes(state.light);
    $('#schemeController').style.opacity = needsController ? '1' : '.32';
    $('#schemeController span').textContent = needsController ? controls[state.control].name : 'Bez sterownika';
    $('#schemeController small').textContent = calc.amplifier ? '+ wzmacniacz sygnału' : needsController ? 'dobrany do obciążenia' : 'włącznik 230 V';
    document.body.classList.toggle('pro-mode', state.proMode);
    renderBom();
  }

  function renderDimensions() {
    const data = shapes[state.shape];
    while (state.dimensions.length < data.arms) state.dimensions.push(state.dimensions.at(-1) || 200);
    state.dimensions = state.dimensions.slice(0, data.arms);
    $('#dimensionFields').innerHTML = data.labels.map((label, index) => `<div class="dimension-field"><label for="dimension-${index}">${label}</label><span>Zakres 5–2000 cm</span><div><input id="dimension-${index}" type="number" min="5" max="2000" step="1" inputmode="numeric" value="${state.dimensions[index]}" data-dimension-index="${index}"><em>cm</em></div></div>`).join('');
    $$('[data-dimension-index]').forEach((input) => input.addEventListener('input', () => {
      const index = Number(input.dataset.dimensionIndex);
      const value = Math.min(2000, Math.max(5, Number(input.value) || 5));
      state.dimensions[index] = value;
      const rounded = roundCut(value);
      const anyRounded = state.dimensions.some((dimension) => roundCut(dimension) !== Number(dimension));
      $('#roundingNote').innerHTML = anyRounded ? `<i class="ph ph-info" aria-hidden="true"></i><span>Taśmę tniemy co 5 cm. Wymiar ${value} cm zaokrągliliśmy do ${rounded} cm.</span>` : `<i class="ph ph-ruler" aria-hidden="true"></i><span>Taśmę tniemy co 5 cm. Podane wymiary są zgodne z modułem cięcia.</span>`;
      updateAll();
    }));
  }

  function showStep(index) {
    currentStep = Math.max(0, Math.min(5, index));
    completedStep = Math.max(completedStep, currentStep);
    $$('.wizard-step').forEach((step, i) => { step.hidden = i !== currentStep; step.classList.toggle('active', i === currentStep); });
    $$('#stepTabs button').forEach((button, i) => {
      button.classList.toggle('active', i === currentStep);
      button.classList.toggle('complete', i < currentStep || i < completedStep);
      button.disabled = i > completedStep;
      i === currentStep ? button.setAttribute('aria-current', 'step') : button.removeAttribute('aria-current');
    });
    $('#stepCounter').textContent = `Krok ${currentStep + 1} z 6`;
    $('#stepShortTitle').textContent = stepTitles[currentStep];
    $('.wizard-progress').setAttribute('aria-valuenow', String(currentStep + 1));
    $('#progressFill').style.width = `${(currentStep + 1) / 6 * 100}%`;
    $('#backButton').hidden = currentStep === 0;
    $('#nextButton').innerHTML = currentStep === 5 ? `Zobacz zestaw<i class="ph ph-package" aria-hidden="true"></i>` : `Dalej<i class="ph ph-arrow-right" aria-hidden="true"></i>`;
    if (window.innerWidth <= 820 && currentStep > 0) window.scrollTo({ top: $('#wizardPanel').offsetTop - 62, behavior: 'smooth' });
    else $('.wizard-form').scrollTop = 0;
  }

  function openDialog(dialog) { dialog.showModal ? dialog.showModal() : dialog.setAttribute('open', ''); }
  function closeDialog(dialog) { dialog.close ? dialog.close() : dialog.removeAttribute('open'); }
  function showToast(message) {
    $('#configToast span').textContent = message;
    $('#configToast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#configToast').classList.remove('show'), 2800);
  }

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    const signature = [state.environment, state.shape, state.light, state.technology, state.profile, state.diffuser, state.control, state.plugPlay, calc.length].join('-');
    buildBom().filter((part) => !part.included).forEach((part) => {
      const item = {
        id: `led-config-${signature}-${part.sku}`,
        title: part.name,
        price: Math.round(part.price * 100) / 100,
        image: environments[state.environment].image,
        qty: 1,
        color: lightShort(),
        size: `${part.qty} · ${part.sku}`,
        isConfiguredLed: true,
        configurationGroup: signature,
        configuration: { ...state, calculations: calc }
      };
      const existing = cart.find((record) => record.id === item.id);
      existing ? existing.qty += 1 : cart.push(item);
    });
    localStorage.setItem('prescot_cart', JSON.stringify(cart));
    window.dispatchEvent(new StorageEvent('storage', { key: 'prescot_cart' }));
    if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    showToast('BOM zestawu LED dodany do koszyka.');
    closeDialog($('#bomDialog'));
  }

  $$('[data-field]').forEach((button) => button.addEventListener('click', () => {
    if (button.disabled) return;
    const { field, value } = button.dataset;
    state[field] = value;
    selectButtons(field, value);
    if (field === 'shape') renderDimensions();
    if (field === 'light') {
      $('#temperatureControl').hidden = value === 'rgbw';
      if (value === 'rgbw' && state.control === 'switch') { state.control = 'remote'; selectButtons('control', 'remote'); }
    }
    updateAll();
  }));
  $('#temperatureRange').addEventListener('input', (event) => { state.temperature = Number(event.target.value); updateAll(); });
  $('#plugPlay').addEventListener('change', (event) => { state.plugPlay = event.target.checked; updateAll(); });
  $('#proMode').addEventListener('change', (event) => { state.proMode = event.target.checked; updateAll(); });
  $('#nextButton').addEventListener('click', () => currentStep === 5 ? openDialog($('#bomDialog')) : showStep(currentStep + 1));
  $('#backButton').addEventListener('click', () => showStep(currentStep - 1));
  $$('#stepTabs button').forEach((button) => button.addEventListener('click', () => showStep(Number(button.dataset.goto))));
  $('#summaryDetailsButton').addEventListener('click', () => openDialog($('#bomDialog')));
  $('#addKitButton').addEventListener('click', addToCart);
  $('#dialogAddButton').addEventListener('click', addToCart);
  $('#schemeButton').addEventListener('click', () => openDialog($('#schemeDialog')));
  $('#headerHelpButton').addEventListener('click', () => openDialog($('#helpDialog')));
  $('#printSchemeButton').addEventListener('click', () => window.print());
  $$('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
  $$('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
  }));
  $('#menuButton').addEventListener('click', () => {
    const expanded = $('#menuButton').getAttribute('aria-expanded') === 'true';
    $('#menuButton').setAttribute('aria-expanded', String(!expanded));
    $('#mobileMenu').hidden = expanded;
  });
  const openCart = () => typeof window.openCartDrawer === 'function' ? window.openCartDrawer() : window.location.assign('cart.html');
  $('#headerCartButton').addEventListener('click', openCart);
  $('#mobileCartButton').addEventListener('click', openCart);

  renderDimensions();
  updateAll();
  showStep(0);
});
