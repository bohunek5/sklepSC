
window.triggerConfiguratorInquiry = function(paramName, paramVal) {
  const locNames = { kitchen: 'Kuchnia & Blat', living: 'Salon, sufit i wnęka', stairs: 'Schody i komunikacja', bathroom: 'Łazienka i strefa wilgotna', outdoor: 'Elewacja, taras i ogród', commercial: 'Ekspozycja i długie ciągi' };
  const lightNames = { '3000K': 'Ciepła 3000K (COB)', '4000K': 'Neutralna 4000K', '6500K': 'Zimna 6500K', 'RGB': 'RGB Multikolor', warm: 'Ciepła 3000K', neutral: 'Neutralna 4000K', cold: 'Zimna 6500K', cct: 'CCT Dual White', rgbw: 'RGBW Multikolor' };
  const controlNames = { 'touch-remote': 'Pilot dotykowy RF Prescot', 'wall-panel': 'Panel ścienny Prescot', 'smart-wifi': 'Smart WiFi (Tuya/App)', switch: 'Przełącznik ON/OFF', dimmer: 'Ściemniacz', smart: 'Smart WiFi' };
  const envNames = { dry: 'IP20 (sucho)', damp: 'IP63+ (wilgoć)', outdoor: 'IP65/IP67 (zewnętrzne)' };

  let loc = (typeof state !== 'undefined' && (state.location || state.application)) ? (locNames[state.location || state.application] || state.location || state.application) : 'Standardowe';
  let len = (typeof state !== 'undefined' && (state.lengthMeters || state.length)) ? (state.lengthMeters || state.length) + ' m' : '5 m';
  let light = (typeof state !== 'undefined' && (state.colorTemp || state.light)) ? (lightNames[state.colorTemp || state.light] || state.colorTemp || state.light) : 'Biała';
  let ctrl = (typeof state !== 'undefined' && (state.controlType || state.control)) ? (controlNames[state.controlType || state.control] || state.controlType || state.control) : 'Pilot RF';
  let env = (typeof state !== 'undefined' && (state.ipRating || state.environment)) ? (envNames[state.ipRating || state.environment] || state.ipRating || state.environment) : 'IP20';

  let presetMessage = `Dzień dobry,\n\nProszę o przygotowanie wyceny indywidualnej dla taśmy LED i zasilacza o preferowanych parametrach:\n` +
    `• Przeznaczenie / miejsce: ${loc}\n` +
    `• Szacowana długość: ${len}\n` +
    `• Barwa światła / technologia: ${light}\n` +
    `• Klasa szczelności: ${env}\n` +
    `• Sposób sterowania: ${ctrl}\n` +
    (paramName ? `• Wybrany parametr: ${paramName} (${paramVal})\n` : '') +
    `\nProszę o kontakt w sprawie doradztwa i dopasowania wariantu z oferty Prescot.`;

  if (typeof window.openInquiryModal === 'function') {
    window.openInquiryModal(presetMessage);
  } else {
    alert("Dziękujemy za zainteresowanie. Otwórz formularz zapytania lub skontaktuj się z nami.");
  }
};

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

  const normalize = (value) => String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const productText = (product) => normalize([
    product.title,
    product.original_category,
    ...Object.entries(product.attributes || {}).flat()
  ].join(' '));

  const stockNumber = (product) => Number.parseFloat(String(product.stock ?? '0').replace(',', '.')) || 0;
  const firstNumber = (text, expression) => {
    const match = text.match(expression);
    return match ? Number.parseFloat(match[1].replace(',', '.')) : null;
  };
  const productVoltage = (product) => firstNumber(productText(product), /(?:^|\s|\|)(12|24|48)\s*v(?:dc)?(?:\s|\||$)/i);
  const productPower = (product) => firstNumber(productText(product), /(\d+(?:[.,]\d+)?)\s*w\s*\/\s*m/i);
  const productLumens = (product) => firstNumber(productText(product), /(\d+(?:[.,]\d+)?)\s*lm\s*\/\s*m/i);
  const productIp = (product) => firstNumber(productText(product), /ip\s*(20|63|65|67|68)/i) || 20;
  const productCri = (product) => firstNumber(productText(product), /cri\s*(\d{2,3})/i);
  const productWidth = (product) => firstNumber(productText(product), /(\d+(?:[.,]\d+)?)\s*mm/i);
  const productTechnology = (product) => /cob/i.test(productText(product)) ? 'COB' : /smd/i.test(productText(product)) ? 'SMD' : null;

  function productLight(product) {
    const text = productText(product);
    if (/rgb\s*\+\s*cct|rgbcct|rgbww|rgb\s*\+\s*(?:ciepla|neutralna|zimna|white)|rgbw|4w1/.test(text)) return 'rgbw';
    if (/\brgb\b/.test(text)) return 'rgb';
    if (/\bcct\b|dual\s*white|biala\s*regulowana/.test(text)) return 'cct';
    if (/(?:2700|2800|3000|3200)\s*k|ciepla\s*biala/.test(text)) return 'warm';
    if (/(?:3800|4000|4200|4500)\s*k|neutralna\s*biala/.test(text)) return 'neutral';
    if (/(?:6000|6500|7000)\s*k|zimna\s*biala/.test(text)) return 'cold';
    return null;
  }

  function normalizeTape(product) {
    return {
      product,
      voltage: productVoltage(product),
      power: productPower(product),
      lumens: productLumens(product),
      ip: productIp(product),
      cri: productCri(product),
      width: productWidth(product),
      technology: productTechnology(product),
      light: productLight(product),
      stock: stockNumber(product)
    };
  }

  function isTape(product) {
    const category = normalize(product.category);
    return category.includes('tasmy led') || category.includes('tasma led');
  }

  function hasRequiredTapeData(tape) {
    return tape.stock > 0 && Number(tape.product.price) > 0 && tape.voltage && tape.power && tape.ip && tape.technology && tape.light;
  }

  function applicationMatches(tape, application) {
    if (!application) return true;
    if (application === 'outdoor') return tape.ip >= 65;
    if (application === 'bathroom') return tape.ip >= 63;
    if (application === 'stairs') return tape.power <= 15;
    return true;
  }

  function intensityMatches(power, intensity) {
    if (!intensity) return true;
    if (intensity === 'decorative') return power <= 12;
    if (intensity === 'functional') return power >= 8 && power <= 16;
    return power >= 15;
  }

  function environmentMatches(tape, environment, application) {
    if (!environment) return true;
    if (application === 'outdoor' && environment !== 'outdoor') return false;
    if (application === 'bathroom' && environment === 'dry') return false;
    if (environment === 'dry') return tape.ip === 20;
    if (environment === 'damp') return tape.ip >= 63;
    return tape.ip >= 65;
  }

  function controlMatches(configuration) {
    return !(configuration.control === 'switch' && ['cct', 'rgb', 'rgbw'].includes(configuration.light));
  }

  function tapeMatches(tape, configuration) {
    if (!applicationMatches(tape, configuration.application)) return false;
    if (!intensityMatches(tape.power, configuration.intensity)) return false;
    if (configuration.technology && configuration.technology !== 'auto' && tape.technology.toLowerCase() !== configuration.technology) return false;
    if (configuration.light && tape.light !== configuration.light) return false;
    if (!environmentMatches(tape, configuration.environment, configuration.application)) return false;
    if (configuration.voltage && configuration.voltage !== 'auto' && tape.voltage !== Number(configuration.voltage)) return false;
    return controlMatches(configuration);
  }

  const filteredTapes = (configuration = state) => tapes.filter((tape) => tapeMatches(tape, configuration));

  function optionCount(input) {
    const hypothetical = { ...state, [input.name]: input.value };
    if (input.name === 'technology' && input.value === 'auto') hypothetical.technology = 'auto';
    if (input.name === 'voltage' && input.value === 'auto') hypothetical.voltage = 'auto';
    return filteredTapes(hypothetical).length;
  }

    function refreshOptionAvailability() {
    form.querySelectorAll('input[type="radio"]').forEach((input) => {
      const label = input.closest('label, .wizard-card-option, .option-select-card, .choice-card');
      if (!label) return;
      let availability = label.querySelector('.option-availability');
      if (!availability) {
        availability = document.createElement('span');
        availability.className = 'option-availability';
        label.appendChild(availability);
      }
      const count = optionCount(input);
      input.disabled = count === 0;
      label.classList.toggle('is-unavailable', count === 0);
      if (count > 0) {
        availability.innerHTML = `${count} zgodnych`;
      } else {
        availability.innerHTML = `<button type="button" class="btn-inquiry-unavailable" onclick="event.preventDefault(); event.stopPropagation(); triggerConfiguratorInquiry('${input.name}', '${input.value}');">✉ Zapytaj o taki produkt</button>`;
      }
    });
  }

function currentStepValid() {
    if (currentStep === 0) return Boolean(state.application);
    if (currentStep === 1) return Boolean(state.intensity && state.technology);
    if (currentStep === 2) return Boolean(state.light);
    if (currentStep === 3) return state.length >= 0.5 && state.length <= 200 && state.segments >= 1 && state.segments <= 20;
    if (currentStep === 4) return Boolean(state.environment);
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

  function parseRollLength(product) {
    const text = normalize(product.title);
    if (/tasma\s*na\s*metry/.test(text)) return 1;
    return firstNumber(text, /rolka\s*(\d+(?:[.,]\d+)?)\s*m/i) || firstNumber(text, /(?:^|\s)(1|5|10|50)\s*m(?:\s|$)/i) || 5;
  }

  function scoreTape(tape) {
    const targetPower = state.intensity === 'decorative' ? 8 : state.intensity === 'strong' ? 19 : 11;
    let score = 180 - Math.abs(tape.power - targetPower) * 8;
    if (state.technology !== 'auto' && tape.technology.toLowerCase() === state.technology) score += 80;
    if (state.technology === 'auto' && tape.technology === 'COB') score += 18;
    if (state.length >= 20 && tape.voltage === 48) score += 70;
    else if (state.length > 5 && tape.voltage === 24) score += 42;
    else if (state.length <= 5 && [12, 24].includes(tape.voltage)) score += 20;
    if (['kitchen', 'commercial', 'bathroom'].includes(state.application) && tape.cri >= 90) score += 28;
    if (tape.lumens) score += Math.min(tape.lumens / 180, 15);
    score += Math.min(tape.stock, 100) / 20;
    return score;
  }

  function chooseCandidates() {
    return filteredTapes()
      .slice()
      .sort((a, b) => scoreTape(b) - scoreTape(a))
      .filter((tape, index, array) => array.findIndex((candidate) => candidate.product.id === tape.product.id) === index)
      .slice(0, 3);
  }

  function categoryProducts(fragment) {
    const normalizedFragment = normalize(fragment);
    return catalog.filter((product) => normalize(product.category).includes(normalizedFragment) && stockNumber(product) > 0 && Number(product.price) > 0);
  }

  function powerSupplyPlan(tape) {
    if (tape.voltage === 48) return { product: null, quantity: 0, capacity: 0, load: tape.power * state.length, required: tape.power * state.length * 1.2, reason: 'W lokalnym katalogu nie ma obecnie zasilacza Scharfer 48 V.' };
    const totalLoad = tape.power * state.length;
    const required = totalLoad * 1.2;
    const segmentRequired = required / state.segments;
    const supplies = categoryProducts('zasilacze led scharfer')
      .map((product) => ({ product, voltage: productVoltage(product), watts: firstNumber(productText(product), /(\d+(?:[.,]\d+)?)\s*w/i) }))
      .filter((supply) => supply.voltage === tape.voltage && supply.watts)
      .sort((a, b) => a.watts - b.watts);
    if (!supplies.length) return { product: null, quantity: 0, capacity: 0, load: totalLoad, required, reason: `Brak dostępnego zasilacza ${tape.voltage} V.` };
    const maxSupply = supplies[supplies.length - 1];
    const selected = supplies.find((supply) => supply.watts >= segmentRequired) || maxSupply;
    const unitsPerSegment = Math.max(1, Math.ceil(segmentRequired / selected.watts));
    const quantity = unitsPerSegment * state.segments;
    return { product: selected.product, quantity, wattsEach: selected.watts, capacity: selected.watts * quantity, load: totalLoad, required, reason: null };
  }

  function controllerChannels(light) {
    if (light === 'cct') return 'cct';
    if (light === 'rgb') return 'rgb';
    if (light === 'rgbw') return 'rgbw';
    return 'mono';
  }

  function controllerPlan(tape, psuPlan) {
    const required = state.control !== 'switch' || ['cct', 'rgb', 'rgbw'].includes(state.light);
    if (!required) return { required: false, product: null, quantity: 0 };
    const channel = controllerChannels(state.light);
    const candidates = categoryProducts('sterowniki led').filter((product) => {
      const text = productText(product);
      const channelMatch = channel === 'mono' ? /mono|sciem|dimmer|5w1/.test(text) : channel === 'cct' ? /cct|5w1/.test(text) : channel === 'rgb' ? /\brgb\b|5w1/.test(text) : /rgbw|rgbcct|5w1/.test(text);
      const modeMatch = state.control !== 'smart' || /wi\s*-?\s*fi|wifi|tuya|app/.test(text);
      const voltageMatch = text.includes(`${tape.voltage}v`) || /12\s*-\s*48\s*v|12\s*-\s*24\s*v/.test(text);
      return channelMatch && modeMatch && voltageMatch;
    });
    if (!candidates.length) return { required: true, product: null, quantity: 0, reason: 'Brak dostępnego sterownika o zgodnej liczbie kanałów i napięciu.' };
    const ranked = candidates.map((product) => ({
      product,
      amperes: firstNumber(productText(product), /max\.?\s*(\d+(?:[.,]\d+)?)\s*a/i) || firstNumber(productText(product), /(\d+(?:[.,]\d+)?)\s*a\s*\/\s*kan/i) || 10
    })).sort((a, b) => b.amperes - a.amperes);
    const selected = ranked[0];
    const totalCurrent = psuPlan.load / tape.voltage;
    return { required: true, product: selected.product, quantity: Math.max(1, Math.ceil(totalCurrent / selected.amperes)), current: totalCurrent, maxCurrent: selected.amperes };
  }

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
    return `<article class="system-item"><div class="system-image"><img src="${escapeHtml(productImage(product))}" alt="" loading="lazy"></div><div class="system-info"><span class="system-role">${escapeHtml(role)}</span><h4><a href="${productUrl(product)}">${escapeHtml(product.title)}</a></h4><div class="spec-pills">${specs.map((spec) => `<span>${escapeHtml(spec)}</span>`).join('')}<span>${quantity} szt.</span></div></div><div class="system-price"><strong>${formatPrice(product.price * quantity)}</strong><small>${formatPrice(product.price)} / szt.</small></div></article>`;
  }

  function renderAlternatives(alternatives) {
    if (!alternatives.length) return '';
    return `<section class="alternatives funnel-alternatives"><div class="alternatives-header"><h3>Jeszcze ${alternatives.length === 1 ? 'jeden zgodny wariant' : 'dwa zgodne warianty'}</h3><span>Różnią się parametrami lub długością rolki</span></div><div class="alternatives-grid">${alternatives.map((tape) => `<article class="alternative-card"><img src="${escapeHtml(productImage(tape.product))}" alt="" loading="lazy"><div class="alternative-body"><h4>${escapeHtml(tape.product.title)}</h4><strong>${formatPrice(tape.product.price)}</strong></div><button class="button-secondary select-product-button" type="button" data-select-tape="${tape.product.id}">Wybierz ten wariant</button></article>`).join('')}</div></section>`;
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
      <article class="selected-tape-card"><div class="selected-tape-media"><span class="best-match-badge">Najlepsze dopasowanie</span><img src="${escapeHtml(productImage(tapeProduct))}" alt="${escapeHtml(tapeProduct.title)}"></div><div class="selected-tape-content"><span class="product-origin">Prescot LED · dostępny produkt</span><h3>${escapeHtml(tapeProduct.title)}</h3><div class="product-codes"><span><b>SKU:</b> ${escapeHtml(tapeProduct.kod_handlowy || tapeProduct.kod_katalogowy || tapeProduct.id)}</span><span><b>EAN:</b> ${escapeHtml(tapeProduct.ean || '—')}</span></div><div class="product-spec-grid"><div><small>Napięcie</small><strong>${primary.voltage} V</strong></div><div><small>Moc</small><strong>${primary.power} W/m</strong></div><div><small>Ochrona</small><strong>IP${primary.ip}</strong></div><div><small>Technologia</small><strong>${primary.technology}</strong></div><div><small>Strumień</small><strong>${primary.lumens || '—'}${primary.lumens ? ' lm/m' : ''}</strong></div></div><div class="selection-reasons"><strong>Dlaczego ten wariant</strong><ul>${selectionReasons(primary)}</ul></div><p class="packaging-warning">Potrzebujesz ${state.length} m. Produkt jest rozliczany jako ${rollLength === 1 ? 'metr bieżący' : `rolka ${rollLength} m`}; do koszyka trafi ${tapeQuantity} ${rollLength === 1 ? 'm' : 'szt.'}. Cena wymaga potwierdzenia w backendzie przed płatnością.</p><div class="selected-buy-row"><div class="selected-price"><strong>${formatPrice(tapeProduct.price)}</strong><small>cena katalogowa produktu</small></div><a class="product-link-button" href="${productUrl(tapeProduct)}">Karta produktu</a><button class="button-primary tape-cart-button" type="button" data-action="add-tape">Dodaj taśmę</button></div></div></article>
      ${renderAlternatives(alternatives)}
      <div class="system-section-title"><div><p class="section-kicker">Plan kompatybilnego toru</p><h3>Zasilanie i sterowanie</h3></div><p>Obciążenie liczymy z mocy wybranej taśmy i dodajemy co najmniej 20% rezerwy. Przy dużej mocy system dzielimy na kilka zasilaczy.</p></div>
      <div class="result-grid"><div class="system-list"><div class="system-list-header"><h3>Elementy systemu</h3><span>${ready ? 'Elementy katalogowe dobrane' : 'Wymagana konsultacja techniczna'}</span></div>${systemItems.join('')}</div><aside class="bundle-summary"><h3>Podsumowanie techniczne</h3><p>Bez fikcyjnego rabatu i bez udawania ostatecznej wyceny instalacji.</p><div class="calculation"><div><span>Moc taśmy</span><strong>${psu.load.toFixed(1)} W</strong></div><div><span>Wymagana moc z rezerwą</span><strong>${psu.required.toFixed(1)} W</strong></div><div><span>Dobrane zasilanie</span><strong>${psu.product ? `${psu.quantity} × ${psu.wattsEach} W` : 'do konsultacji'}</strong></div><div><span>Opakowania / metry taśmy</span><strong>${tapeQuantity}</strong></div></div><div class="bundle-total"><span>Suma produktów</span><strong>${formatPrice(bundleTotal)}</strong></div><button class="button-primary bundle-button" type="button" data-action="add-bundle" ${ready ? '' : 'disabled'}>Dodaj dostępny zestaw</button><p class="bundle-note">Cena, stany i zamówienie muszą zostać potwierdzone przez backend.</p>${ready ? '' : '<p class="result-warning">Zestaw nie jest kompletny w lokalnym katalogu. Dodaj samą taśmę albo skonsultuj brakujący element.</p>'}${longRun ? '<p class="result-warning">Długi ciąg wymaga projektu punktów zasilania, przekrojów przewodów i kontroli spadków napięcia.</p>' : ''}</aside></div>`;

    selectedResult = { primary, alternatives, tapeQuantity, psu, controller, ready };
    results.hidden = false;
    bindResultActions();
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderResults() {
    const candidates = chooseCandidates();
    if (!candidates.length) {
      results.hidden = false;
      resultContent.innerHTML = '<div class="no-results"><h3>Ta kombinacja nie występuje w aktualnym katalogu.</h3><p>Wróć o krok i zmień jeden parametr. Konfigurator nie zastąpi brakującego produktu przypadkowym odpowiednikiem.</p><button class="button-secondary" type="button" id="returnToConfiguration">Wróć do konfiguracji</button></div>';
      document.getElementById('returnToConfiguration').onclick = () => document.getElementById('configurator').scrollIntoView({ behavior: 'smooth' });
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
    document.querySelector('[data-action="add-bundle"]')?.addEventListener('click', () => {
      if (!selectedResult.ready) return;
      const items = [cartRecord(selectedResult.primary.product, selectedResult.tapeQuantity), cartRecord(selectedResult.psu.product, selectedResult.psu.quantity)];
      if (selectedResult.controller.product) items.push(cartRecord(selectedResult.controller.product, selectedResult.controller.quantity));
      addItemsToCart(items);
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
      document.querySelector('.configurator-shell').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    document.getElementById('configurator').scrollIntoView({ behavior: 'smooth' });
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

    function hideLoadingOverlay() {
    const loadingEl = document.getElementById('catalogLoading');
    if (loadingEl) loadingEl.hidden = true;
    const loaderContainer = document.querySelector('.loading-overlay');
    if (loaderContainer) loaderContainer.style.display = 'none';
  }

  async function loadCatalog() {
    if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
      catalog = products;
    } else if (typeof getProducts === 'function') {
      catalog = getProducts();
    } else if (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) {
      catalog = defaultProducts;
    }

    try {
      const response = await fetch('js/prescot-imported-products.json', { cache: 'no-store' });
      if (response.ok) {
        const importedData = await response.json();
        if (Array.isArray(importedData) && importedData.length > 0) {
          catalog = importedData;
        }
      }
    } catch (error) {
      // Fallback to existing catalog
    }

    if (!catalog || !catalog.length) {
      if (typeof products !== 'undefined' && Array.isArray(products)) catalog = products;
    }

    if (catalog && catalog.length) {
      tapes = catalog.filter(isTape).map(normalizeTape).filter(hasRequiredTapeData);
      if (!tapes.length) {
        tapes = catalog.filter(isTape).map(normalizeTape);
      }
    }

    hideLoadingOverlay();
    updateCartBadge();
    updateLengthTip();
    renderStep();
  }

  updateHeader();
  loadCatalog();
});
