const CATALOG_URL = 'js/prescot-imported-products.json';
const CART_KEY = 'prescot_cart';
const CONFIGURATIONS_KEY = 'prescot_configurations';
const POWER_RESERVE_FACTOR = 1.2;
const MAX_FINAL_CANDIDATES = 3;
const RULES_VERSION = 'local-v3-funnel-2026-07-23';
const FIELD_STEP = Object.freeze({
  application: 0,
  intensity: 1,
  technology: 1,
  light: 2,
  length: 3,
  segments: 3,
  environment: 4,
  control: 5,
  voltage: 5
});

const form = document.querySelector('#configuratorForm');
const steps = Array.from(document.querySelectorAll('.config-step'));
const indicators = Array.from(document.querySelectorAll('[data-step-indicator]'));
const nextButton = document.querySelector('#nextButton');
const backButton = document.querySelector('#backButton');
const validationMessage = document.querySelector('#validationMessage');
const progressBar = document.querySelector('#progressBar');
const progressPercent = document.querySelector('#progressPercent');
const loadingPanel = document.querySelector('#catalogLoading');
const catalogError = document.querySelector('#catalogError');
const funnelCount = document.querySelector('#funnelCount');
const funnelMessage = document.querySelector('#funnelMessage');
const resultsSection = document.querySelector('#results');
const resultsContent = document.querySelector('#resultsContent');
const editConfigurationButton = document.querySelector('#editConfiguration');
const cartBadge = document.querySelector('#cartBadge');
const toast = document.querySelector('#toast');

const state = {
  catalog: [],
  tapes: [],
  powerSupplies: [],
  controllers: [],
  currentStep: 0,
  catalogReady: false,
  initialTapeCount: 0,
  candidates: [],
  selectedTapeId: null,
  result: null
};

const currency = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN'
});

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function numeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value == null ? '' : value).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function attributes(product) {
  return product && product.attributes && typeof product.attributes === 'object' ? product.attributes : {};
}

function getAttribute(product, names) {
  const wanted = names.map(normalize);
  const found = Object.entries(attributes(product)).find(function (entry) {
    return wanted.includes(normalize(entry[0]));
  });
  return found ? String(found[1] == null ? '' : found[1]) : '';
}

function productText(product) {
  return [product && product.title, product && product.original_category]
    .concat(Object.values(attributes(product)))
    .join(' ');
}

function productImage(product) {
  if (product && Array.isArray(product.images) && product.images.length) return product.images[0];
  if (product && typeof product.image === 'string') return product.image;
  return 'images/logo-dark.png';
}

function stockAmount(product) {
  return numeric(product && product.stock);
}

function productVoltage(product) {
  const raw = [
    getAttribute(product, ['Napięcie wejściowe', 'Napięcie Wyjściowe', 'Napięcie wyjściowe', 'Napięcie']),
    product && product.title
  ].join(' ');
  const matches = Array.from(raw.matchAll(/(?:^|[^0-9])(12|24)\s*(?:-|–|do)?\s*(12|24)?\s*v\b/gi));
  const values = new Set();
  matches.forEach(function (match) {
    values.add(Number(match[1]));
    if (match[2]) values.add(Number(match[2]));
  });
  return Array.from(values).filter(function (value) {
    return value === 12 || value === 24;
  });
}

function tapePower(product) {
  const raw = [getAttribute(product, ['Moc']), product && product.title].join(' ');
  const match = raw.match(/(\d+(?:[.,]\d+)?)\s*w\s*\/?\s*m\b/i);
  return match ? numeric(match[1]) : 0;
}

function productIp(product) {
  const raw = [
    getAttribute(product, ['Klasa szczelności', 'Stopień ochrony']),
    product && product.title
  ].join(' ');
  const match = raw.match(/\bIP\s*(\d{2})\b/i);
  return match ? Number(match[1]) : 0;
}

function tapeWidth(product) {
  const raw = getAttribute(product, ['Szerokość taśmy']) || (product && product.title) || '';
  const match = raw.match(/(?:^|\s)(\d{1,2}(?:[.,]\d+)?)\s*mm\b/i);
  return match ? numeric(match[1]) : 0;
}

function tapeCri(product) {
  const raw = [getAttribute(product, ['CRI']), product && product.title].join(' ');
  const match = raw.match(/(?:cri|ra)\s*(\d{2})/i);
  return match ? Number(match[1]) : 0;
}

function tapeBrightness(product) {
  const raw = [
    getAttribute(product, ['Jasność', 'Strumień świetlny']),
    product && product.title
  ].join(' ');
  const match = raw.match(/(\d{2,5})\s*lm\s*\/?\s*m\b/i);
  return match ? Number(match[1]) : 0;
}

function tapeLightType(product) {
  const raw = normalize([
    getAttribute(product, ['Barwa światła', 'Barwa']),
    product && product.title
  ].join(' '));

  if (/rgb\s*\+?\s*cct|rgbcct|rgbww|\brgbw\b|rgb\s*\+\s*(bial|white|w)/.test(raw)) return 'rgbw';
  if (/\brgb\b/.test(raw)) return 'rgb';
  if (/\bcct\b|dual\s*white|regulowana\s*biel/.test(raw)) return 'cct';

  const kelvin = raw.match(/(?:^|\D)(\d{4})\s*k\b/);
  if (kelvin) {
    const value = Number(kelvin[1]);
    if (value <= 3500) return 'warm';
    if (value <= 5000) return 'neutral';
    return 'cold';
  }

  if (/ciepl|warm/.test(raw)) return 'warm';
  if (/neutral|natural/.test(raw)) return 'neutral';
  if (/zimn|cold/.test(raw)) return 'cold';
  return '';
}

function tapeTechnology(product) {
  const raw = normalize([
    product && product.title,
    product && product.original_category,
    getAttribute(product, ['Typ diody'])
  ].join(' '));
  return /\bcob\b|chip on board/.test(raw) ? 'cob' : 'smd';
}

function powerSupplyWattage(product) {
  const raw = [getAttribute(product, ['Moc']), product && product.title].join(' ');
  const values = Array.from(raw.matchAll(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*w\b/gi)).map(function (match) {
    return numeric(match[1]);
  });
  return values.length ? Math.max.apply(Math, values) : 0;
}

function controllerType(product) {
  const raw = normalize(productText(product));
  if (/rgb\s*\+?\s*cct|rgbcct|rgbww|\brgbw\b/.test(raw)) return 'rgbw';
  if (/\bcct\b|dual white/.test(raw)) return 'cct';
  if (/\brgb\b/.test(raw)) return 'rgb';
  if (/mono|jednokolor|sciemniacz|dimmer/.test(raw)) return 'mono';
  return '';
}

function controllerCapacity(product, voltage) {
  const raw = getAttribute(product, ['Moc']);
  const values = Array.from(raw.matchAll(/(\d+(?:[.,]\d+)?)\s*(?=\/|w|$)/gi)).map(function (match) {
    return numeric(match[1]);
  });
  if (values.length >= 2) return voltage === 24 ? values[1] : values[0];
  if (values.length === 1) return values[0];

  const currentRaw = getAttribute(product, ['Prąd maksymalny']);
  const currentMatch = currentRaw.match(/(\d+(?:[.,]\d+)?)\s*a/i);
  return currentMatch ? numeric(currentMatch[1]) * voltage : 0;
}

function requiredControllerType(lightType) {
  if (lightType === 'cct') return 'cct';
  if (lightType === 'rgb') return 'rgb';
  if (lightType === 'rgbw') return 'rgbw';
  return 'mono';
}

function minimumIp(environment) {
  if (environment === 'outdoor') return 65;
  if (environment === 'damp') return 63;
  return 20;
}

function applicationMinimumIp(application) {
  if (application === 'outdoor') return 65;
  if (application === 'bathroom') return 63;
  return 20;
}

function requiredIp(answers) {
  return Math.max(applicationMinimumIp(answers.application), answers.environment ? minimumIp(answers.environment) : 20);
}

function selectedValue(name) {
  const checked = form.querySelector('[name="' + name + '"]:checked');
  return checked ? checked.value : '';
}

function answersFromForm() {
  return {
    application: selectedValue('application'),
    intensity: selectedValue('intensity'),
    technology: selectedValue('technology') || 'auto',
    light: selectedValue('light'),
    length: numeric(document.querySelector('#lengthInput').value),
    segments: Math.round(numeric(document.querySelector('#segmentsInput').value)),
    environment: selectedValue('environment'),
    control: selectedValue('control'),
    voltage: selectedValue('voltage') || 'auto'
  };
}

function answersThroughStep(stepIndex) {
  const answers = answersFromForm();
  Object.entries(FIELD_STEP).forEach(function (entry) {
    const field = entry[0];
    const fieldStep = entry[1];
    if (fieldStep > stepIndex) answers[field] = field === 'length' || field === 'segments' ? 0 : '';
  });
  return answers;
}

function answersForOption(input) {
  const stepIndex = FIELD_STEP[input.name] == null ? state.currentStep : FIELD_STEP[input.name];
  const answers = answersThroughStep(stepIndex);
  answers[input.name] = input.value;
  return answers;
}

function hasRequiredTapeData(product) {
  return Boolean(
    stockAmount(product) > 0 &&
    tapeLightType(product) &&
    tapePower(product) &&
    productIp(product) &&
    productVoltage(product).length
  );
}

function tapeMatches(product, answers) {
  if (!hasRequiredTapeData(product)) return false;
  if (answers.application === 'outdoor' && answers.environment && answers.environment !== 'outdoor') return false;

  const power = tapePower(product);
  const desiredVoltage = answers.voltage && answers.voltage !== 'auto' ? Number(answers.voltage) : 0;

  if (answers.light && tapeLightType(product) !== answers.light) return false;
  if (productIp(product) < requiredIp(answers)) return false;
  if (desiredVoltage && !productVoltage(product).includes(desiredVoltage)) return false;
  if (answers.technology && answers.technology !== 'auto' && tapeTechnology(product) !== answers.technology) return false;
  if (answers.intensity === 'decorative' && power > 12) return false;
  if (answers.intensity === 'functional' && (power < 7 || power > 16.5)) return false;
  if (answers.intensity === 'strong' && power < 14) return false;
  return true;
}

function tapesForAnswers(answers) {
  return state.tapes.filter(function (product) {
    return tapeMatches(product, answers);
  });
}

function rollLength(product) {
  const raw = [getAttribute(product, ['Rolka']), product && product.title].join(' ');
  const matches = Array.from(raw.matchAll(/(?:rolka\s*)?(\d+(?:[.,]\d+)?)\s*m\b/gi));
  return matches.length ? numeric(matches[matches.length - 1][1]) : 0;
}

function tapeQuantity(product, length) {
  const soldByMeter = normalize(getAttribute(product, ['Taśma na metry'])) === 'tak';
  if (soldByMeter) return Math.ceil(length);
  const roll = rollLength(product);
  return roll ? Math.ceil(length / roll) : 1;
}

function scoreTape(product, answers) {
  if (!tapeMatches(product, answers)) return null;

  const power = tapePower(product);
  const voltages = productVoltage(product);
  const desiredVoltage = answers.voltage === 'auto' ? 0 : Number(answers.voltage);
  let score = 100 + Math.min(stockAmount(product), 100) / 10;

  if (answers.intensity === 'decorative') score += power <= 8 ? 32 : Math.max(0, 22 - (power - 8) * 4);
  if (answers.intensity === 'functional') score += power >= 8 && power <= 15.5 ? 34 : Math.max(0, 24 - Math.abs(power - 12) * 3);
  if (answers.intensity === 'strong') score += 34 + Math.min(Math.max(power - 14, 0), 8);

  const preferredVoltage = answers.length > 5 ? 24 : 12;
  if (answers.voltage === 'auto' && voltages.includes(preferredVoltage)) score += 13;
  if (desiredVoltage && voltages.includes(desiredVoltage)) score += 13;

  const cri = tapeCri(product);
  const brightness = tapeBrightness(product);
  if (['kitchen', 'commercial'].includes(answers.application)) score += cri >= 90 ? 15 : cri >= 80 ? 6 : 0;
  if (answers.application === 'living') score += cri >= 90 ? 12 : 4;
  if (answers.application === 'stairs' && power <= 10) score += 8;
  if (answers.intensity === 'strong' && brightness >= 1000) score += 8;
  if (answers.intensity === 'decorative' && brightness && brightness <= 800) score += 6;
  if (productIp(product) === requiredIp(answers)) score += 3;
  if (answers.technology === 'auto' && tapeTechnology(product) === 'cob') score += 4;

  const soldByMeter = normalize(getAttribute(product, ['Taśma na metry'])) === 'tak';
  const roll = rollLength(product);
  if (soldByMeter) {
    score += 12;
  } else if (roll && answers.length) {
    const waste = Math.ceil(answers.length / roll) * roll - answers.length;
    score += waste < 0.01 ? 12 : Math.max(-50, 6 - waste * 2);
  }
  return score;
}

function chooseVoltage(tape, answers) {
  const available = productVoltage(tape);
  const requested = answers.voltage === 'auto' ? 0 : Number(answers.voltage);
  if (requested && available.includes(requested)) return requested;
  if (answers.length > 5 && available.includes(24)) return 24;
  if (available.includes(12)) return 12;
  return available[0] || 0;
}

function chooseCapacityPlan(products, capacityFunction, requiredCapacity) {
  const plans = [];
  products.forEach(function (product) {
    const capacity = capacityFunction(product);
    if (!capacity || stockAmount(product) <= 0) return;
    const quantity = Math.max(1, Math.ceil(requiredCapacity / capacity));
    if (stockAmount(product) < quantity) return;
    plans.push({
      product: product,
      quantity: quantity,
      unitCapacity: capacity,
      totalCapacity: capacity * quantity,
      waste: capacity * quantity - requiredCapacity,
      totalPrice: numeric(product.price) * quantity
    });
  });

  plans.sort(function (a, b) {
    return a.quantity - b.quantity || a.waste - b.waste || a.totalPrice - b.totalPrice;
  });
  return plans[0] || null;
}

function choosePowerPlan(voltage, requiredPower) {
  const supplies = state.powerSupplies.filter(function (product) {
    return productVoltage(product).includes(voltage);
  });
  return chooseCapacityPlan(supplies, powerSupplyWattage, requiredPower);
}

function chooseControllerPlan(type, control, voltage, loadPower) {
  const smartPattern = /wifi|wi-fi|tuya|zigbee|bluetooth|smart|aplikac/;
  const controllers = state.controllers.filter(function (product) {
    if (controllerType(product) !== type) return false;
    if (!productVoltage(product).includes(voltage)) return false;
    if (control === 'smart' && !smartPattern.test(normalize(productText(product)))) return false;
    return true;
  });
  return chooseCapacityPlan(controllers, function (product) {
    return controllerCapacity(product, voltage);
  }, loadPower);
}

function buildResult(tape, answers) {
  const voltage = chooseVoltage(tape, answers);
  const wattsPerMeter = tapePower(tape);
  const loadPower = wattsPerMeter * answers.length;
  const requiredPower = loadPower * POWER_RESERVE_FACTOR;
  const powerPlan = choosePowerPlan(voltage, requiredPower);
  const controllerNeeded = !['warm', 'neutral', 'cold'].includes(answers.light) || answers.control !== 'switch';
  const controllerPlan = controllerNeeded
    ? chooseControllerPlan(requiredControllerType(answers.light), answers.control, voltage, loadPower)
    : null;
  const missing = [];
  if (!powerPlan) missing.push('zasilanie o wymaganej mocy');
  if (controllerNeeded && !controllerPlan) missing.push(answers.control === 'smart' ? 'sterownik smart' : 'sterownik');

  return {
    answers: answers,
    tape: tape,
    voltage: voltage,
    wattsPerMeter: wattsPerMeter,
    loadPower: loadPower,
    requiredPower: requiredPower,
    powerPlan: powerPlan,
    controllerPlan: controllerPlan,
    controllerNeeded: controllerNeeded,
    quantity: tapeQuantity(tape, answers.length),
    width: tapeWidth(tape),
    missing: missing,
    longRunWarning: answers.length / answers.segments > (voltage === 24 ? 10 : 5)
  };
}

function chooseCandidates(answers) {
  return tapesForAnswers(answers)
    .map(function (product) {
      const result = buildResult(product, answers);
      return {
        product: product,
        score: scoreTape(product, answers) + (result.missing.length ? 0 : 60)
      };
    })
    .sort(function (a, b) {
      return b.score - a.score || stockAmount(b.product) - stockAmount(a.product) || numeric(a.product.price) - numeric(b.product.price);
    })
    .slice(0, MAX_FINAL_CANDIDATES)
    .map(function (entry) {
      return entry.product;
    });
}

function pluralProducts(count) {
  if (count === 1) return 'produkt';
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return 'produkty';
  return 'produktów';
}

function optionAvailabilityElement(input) {
  const label = input.closest('label');
  if (!label) return null;
  let container = label;
  if (input.name === 'technology' || input.name === 'voltage') container = input.nextElementSibling || label;
  let badge = container.querySelector('.option-availability');
  if (!badge) {
    badge = document.createElement('small');
    badge.className = 'option-availability';
    container.appendChild(badge);
  }
  return badge;
}

function refreshFunnel() {
  if (!state.catalogReady) {
    funnelCount.textContent = '—';
    funnelMessage.textContent = 'Wczytujemy dostępne taśmy';
    nextButton.disabled = true;
    return 0;
  }

  const currentStepElement = steps[state.currentStep];
  const radios = Array.from(currentStepElement.querySelectorAll('input[type="radio"]'));
  let changed = false;

  radios.forEach(function (input) {
    const count = tapesForAnswers(answersForOption(input)).length;
    if (input.checked && count === 0) {
      input.checked = false;
      changed = true;
    }
  });

  if (changed) {
    const autoTechnology = currentStepElement.querySelector('input[name="technology"][value="auto"]');
    const autoVoltage = currentStepElement.querySelector('input[name="voltage"][value="auto"]');
    if (autoTechnology && tapesForAnswers(answersForOption(autoTechnology)).length) autoTechnology.checked = true;
    if (autoVoltage && tapesForAnswers(answersForOption(autoVoltage)).length) autoVoltage.checked = true;
  }

  radios.forEach(function (input) {
    const count = tapesForAnswers(answersForOption(input)).length;
    const unavailable = count === 0;
    input.disabled = unavailable;
    const label = input.closest('label');
    if (label) {
      label.classList.toggle('is-unavailable', unavailable);
      label.setAttribute('aria-disabled', String(unavailable));
    }
    const badge = optionAvailabilityElement(input);
    if (badge) badge.textContent = unavailable ? 'Brak zgodnych' : count + ' ' + pluralProducts(count);
  });

  const count = tapesForAnswers(answersThroughStep(state.currentStep)).length;
  funnelCount.textContent = String(count);
  funnelMessage.textContent = count
    ? 'dostępne ' + pluralProducts(count) + ' spełniają dotychczasowe wybory'
    : 'zmień ostatnią odpowiedź — ten wariant nie ma produktu';
  funnelCount.closest('.funnel-status').classList.toggle('is-empty', count === 0);
  return count;
}

function clearDownstreamAnswers(stepIndex) {
  steps.forEach(function (step, index) {
    if (index <= stepIndex) return;
    step.querySelectorAll('input[type="radio"]').forEach(function (input) {
      input.checked = input.value === 'auto' && (input.name === 'technology' || input.name === 'voltage');
    });
  });
}

function validateStep(index) {
  if (!state.catalogReady) return false;
  if (index === 0 && !selectedValue('application')) return false;
  if (index === 1 && (!selectedValue('intensity') || !selectedValue('technology'))) return false;
  if (index === 2 && !selectedValue('light')) return false;
  if (index === 3) {
    const length = numeric(document.querySelector('#lengthInput').value);
    const segments = numeric(document.querySelector('#segmentsInput').value);
    if (!(length >= 0.5 && length <= 100 && Number.isInteger(segments) && segments >= 1 && segments <= 30)) return false;
  }
  if (index === 4 && !selectedValue('environment')) return false;
  if (index === 5 && (!selectedValue('control') || !selectedValue('voltage'))) return false;
  return tapesForAnswers(answersThroughStep(index)).length > 0;
}

function validationText(index) {
  if (index === 3) return 'Podaj długość od 0,5 do 100 m oraz pełną liczbę odcinków od 1 do 30.';
  if (tapesForAnswers(answersThroughStep(index)).length === 0) return 'Ta odpowiedź zostawia zero produktów. Wybierz aktywny wariant z licznikiem.';
  return 'Wybierz jedną z dostępnych odpowiedzi.';
}

function updateNextButton(count) {
  nextButton.disabled = !validateStep(state.currentStep);
  if (state.currentStep === steps.length - 1) {
    const finalCount = Math.min(count, MAX_FINAL_CANDIDATES);
    nextButton.innerHTML = 'Pokaż ' + finalCount + ' ' + pluralProducts(finalCount) + ' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>';
  } else {
    nextButton.innerHTML = 'Dalej <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>';
  }
}

function updateStepUi() {
  steps.forEach(function (step, index) {
    step.hidden = index !== state.currentStep;
  });
  indicators.forEach(function (indicator, index) {
    indicator.classList.toggle('active', index === state.currentStep);
    indicator.classList.toggle('complete', index < state.currentStep);
  });
  const percent = Math.round(((state.currentStep + 1) / steps.length) * 100);
  progressBar.style.width = percent + '%';
  progressPercent.textContent = percent + '%';
  backButton.hidden = state.currentStep === 0;
  const count = refreshFunnel();
  updateNextButton(count);
  validationMessage.textContent = '';
  updateProjectPreview();
}

function showStep(index, scroll) {
  state.currentStep = Math.max(0, Math.min(index, steps.length - 1));
  updateStepUi();
  if (scroll) document.querySelector('#configurator').scrollIntoView({ behavior: 'smooth', block: 'start' });
  const heading = steps[state.currentStep].querySelector('h3');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

function applicationLabel(type) {
  return {
    kitchen: 'Kuchnia',
    living: 'Salon i meble',
    stairs: 'Schody',
    bathroom: 'Łazienka',
    outdoor: 'Na zewnątrz',
    commercial: 'Sklep i ekspozycja'
  }[type] || type;
}

function intensityLabel(type) {
  return {
    decorative: 'światło dekoracyjne',
    functional: 'światło funkcjonalne',
    strong: 'mocne światło'
  }[type] || '';
}

function lightLabel(type) {
  return {
    warm: 'ciepła biała',
    neutral: 'neutralna biała',
    cold: 'zimna biała',
    cct: 'CCT',
    rgb: 'RGB',
    rgbw: 'RGB + biel'
  }[type] || type;
}

function technologyLabel(type) {
  return {
    auto: 'technologia dobrana automatycznie',
    cob: 'COB — jednolita linia',
    smd: 'SMD — klasyczne diody'
  }[type] || type;
}

function updateProjectPreview() {
  const answers = answersFromForm();
  const title = document.querySelector('#projectPreviewTitle');
  const meta = document.querySelector('#projectPreviewMeta');
  if (!answers.application) {
    title.textContent = 'Nowy system LED';
    meta.textContent = 'Wybierz miejsce montażu';
    return;
  }
  title.textContent = applicationLabel(answers.application);
  const details = [
    intensityLabel(answers.intensity),
    answers.light ? lightLabel(answers.light) : '',
    answers.length ? answers.length.toLocaleString('pl-PL') + ' m' : ''
  ].filter(Boolean);
  meta.textContent = details.length ? details.join(' · ') : 'Zawężamy katalog';
}

function priceFor(product, quantity) {
  return numeric(product && product.price) * (quantity == null ? 1 : quantity);
}

function tapeSaleInfo(product, length) {
  const soldByMeter = normalize(getAttribute(product, ['Taśma na metry'])) === 'tak';
  const roll = rollLength(product);
  const quantity = tapeQuantity(product, length);
  if (soldByMeter) return { quantity: quantity, coverage: quantity, waste: Math.max(0, quantity - length), label: quantity + ' m', detail: 'sprzedaż na metry' };
  if (roll) {
    const coverage = quantity * roll;
    return {
      quantity: quantity,
      coverage: coverage,
      waste: Math.max(0, coverage - length),
      label: quantity + ' × rolka ' + roll.toLocaleString('pl-PL') + ' m',
      detail: 'pokrywa ' + coverage.toLocaleString('pl-PL') + ' m'
    };
  }
  return { quantity: quantity, coverage: length, waste: 0, label: quantity + ' szt.', detail: 'jednostka katalogowa' };
}

function selectionReasons(result) {
  const reasons = [
    lightLabel(result.answers.light) + ' — dokładnie wybrana barwa',
    result.wattsPerMeter.toLocaleString('pl-PL') + ' W/m — właściwy zakres mocy',
    'IP' + productIp(result.tape) + ' — spełnia wymagane IP' + requiredIp(result.answers),
    result.voltage + ' V DC — zgodne napięcie systemu',
    technologyLabel(tapeTechnology(result.tape))
  ];
  const cri = tapeCri(result.tape);
  if (cri) reasons.push('CRI ' + cri + ' — parametr potwierdzony w katalogu');
  return reasons;
}

function specPills(product, kind, result) {
  const specs = [];
  if (kind === 'power') specs.push(result.voltage + ' V', powerSupplyWattage(product) + ' W', 'IP' + (productIp(product) || '—'));
  if (kind === 'controller') specs.push(result.voltage + ' V', 'do ' + controllerCapacity(product, result.voltage) + ' W', requiredControllerType(result.answers.light).toUpperCase());
  return specs.map(function (spec) {
    return '<span>' + escapeHtml(spec) + '</span>';
  }).join('');
}

function productRow(product, role, kind, quantity, result) {
  const quantityLabel = quantity > 1 ? quantity + ' szt.' : '1 szt.';
  return [
    '<article class="system-item">',
      '<a class="system-image" href="product.html?id=' + encodeURIComponent(product.id) + '" aria-label="Zobacz produkt">',
        '<img src="' + escapeHtml(productImage(product)) + '" alt="" loading="lazy">',
      '</a>',
      '<div class="system-info">',
        '<span class="system-role">' + escapeHtml(role) + '</span>',
        '<h4><a href="product.html?id=' + encodeURIComponent(product.id) + '">' + escapeHtml(product.title) + '</a></h4>',
        '<div class="spec-pills">' + specPills(product, kind, result) + '</div>',
      '</div>',
      '<div class="system-price"><strong>' + currency.format(priceFor(product, quantity)) + '</strong><small>' + quantityLabel + ' · stan wg importu</small></div>',
    '</article>'
  ].join('');
}

function advisoryRow(title, description, badge, warning) {
  return [
    '<article class="system-item advisory">',
      '<div class="advisory-icon">i</div>',
      '<div class="system-info"><span class="system-role">Do potwierdzenia</span><h4>' + escapeHtml(title) + '</h4><div class="spec-pills"><span>' + escapeHtml(description) + '</span></div></div>',
      '<span class="status-pill ' + (warning ? 'warning' : 'ok') + '">' + escapeHtml(badge) + '</span>',
    '</article>'
  ].join('');
}

function renderAlternative(product) {
  return [
    '<article class="alternative-card">',
      '<img src="' + escapeHtml(productImage(product)) + '" alt="" loading="lazy">',
      '<div class="alternative-body"><h4>' + escapeHtml(product.title) + '</h4><strong>' + currency.format(numeric(product.price)) + '</strong></div>',
      '<button class="select-product-button" type="button" data-action="select-tape" data-product-id="' + escapeHtml(product.id) + '">Wybierz tę taśmę</button>',
    '</article>'
  ].join('');
}

function renderResult() {
  if (!state.candidates.length) {
    resultsSection.hidden = true;
    validationMessage.textContent = 'Ta kombinacja nie ma produktu. Wróć do aktywnej odpowiedzi z licznikiem.';
    showStep(steps.length - 1, true);
    return;
  }

  const tape = state.candidates.find(function (candidate) {
    return String(candidate.id) === String(state.selectedTapeId);
  }) || state.candidates[0];
  state.selectedTapeId = tape.id;

  const result = buildResult(tape, answersFromForm());
  state.result = result;
  const sale = tapeSaleInfo(tape, result.answers.length);
  const sku = getAttribute(tape, ['Kod_produktu', 'Kod producenta', 'Kod_producenta']);
  const ean = getAttribute(tape, ['EAN']);
  const cri = tapeCri(tape);
  const brightness = tapeBrightness(tape);
  const alternatives = state.candidates.filter(function (candidate) {
    return String(candidate.id) !== String(tape.id);
  });

  const components = [{ product: tape, quantity: sale.quantity, kind: 'tape' }];
  if (result.powerPlan) components.push({ product: result.powerPlan.product, quantity: result.powerPlan.quantity, kind: 'power' });
  if (result.controllerPlan) components.push({ product: result.controllerPlan.product, quantity: result.controllerPlan.quantity, kind: 'controller' });

  const supportRows = [];
  if (result.powerPlan) supportRows.push(productRow(result.powerPlan.product, result.powerPlan.quantity > 1 ? 'Zasilanie podzielone na obwody' : 'Zasilacz z 20% zapasu', 'power', result.powerPlan.quantity, result));
  else supportRows.push(advisoryRow('Zasilanie wymaga projektu', 'Brak dostępnej kombinacji z wymaganym zapasem mocy', 'Do konsultacji', true));

  if (result.controllerPlan) supportRows.push(productRow(result.controllerPlan.product, result.controllerPlan.quantity > 1 ? 'Sterowniki dla kilku obwodów' : 'Zgodny sterownik', 'controller', result.controllerPlan.quantity, result));
  else if (result.controllerNeeded) supportRows.push(advisoryRow('Sterownik wymaga doboru', 'Brak dostępnego sterownika o zgodnym typie i mocy', 'Do konsultacji', true));

  const profileText = result.width
    ? 'kanał o szerokości wewnętrznej minimum ' + result.width.toLocaleString('pl-PL') + ' mm'
    : 'szerokość kanału trzeba potwierdzić z kartą taśmy';
  supportRows.push(advisoryRow('Profil aluminiowy i osłona', profileText, 'Dobierz do montażu', false));

  const total = components.reduce(function (sum, component) {
    return sum + priceFor(component.product, component.quantity);
  }, 0);
  const bundleReady = result.missing.length === 0;
  const selectedSupply = result.powerPlan
    ? result.powerPlan.quantity + ' × ' + result.powerPlan.unitCapacity + ' W'
    : 'do projektu';
  const runWarning = result.longRunWarning
    ? '<p class="result-warning">Najdłuższy odcinek trzeba podzielić na krótsze sekcje zasilane osobno lub z kilku punktów.</p>'
    : '';

  resultsContent.innerHTML = [
    '<div class="funnel-result-summary">',
      '<span>Start: <b>' + state.initialTapeCount + '</b> dostępnych taśm</span>',
      '<i aria-hidden="true">→</i>',
      '<strong>Koniec: ' + state.candidates.length + ' ' + pluralProducts(state.candidates.length) + '</strong>',
      '<small>Wszystkie spełniają wybrane parametry i mają dodatni stan w imporcie.</small>',
    '</div>',
    '<div class="result-context" aria-label="Założenia projektu">',
      '<span>' + escapeHtml(applicationLabel(result.answers.application)) + '</span>',
      '<span>' + escapeHtml(intensityLabel(result.answers.intensity)) + '</span>',
      '<span>' + result.answers.length.toLocaleString('pl-PL') + ' m / ' + result.answers.segments + ' odc.</span>',
      '<span>' + escapeHtml(lightLabel(result.answers.light)) + '</span>',
      '<span>' + result.voltage + ' V DC</span>',
    '</div>',
    '<article class="selected-tape-card">',
      '<div class="selected-tape-media"><span class="best-match-badge">Najlepsze dopasowanie 1/' + state.candidates.length + '</span><img src="' + escapeHtml(productImage(tape)) + '" alt="' + escapeHtml(tape.title) + '"></div>',
      '<div class="selected-tape-content">',
        '<span class="product-origin">Realny produkt z katalogu Prescot</span>',
        '<h3>' + escapeHtml(tape.title) + '</h3>',
        '<div class="product-codes">',
          sku ? '<span>SKU: <b>' + escapeHtml(sku) + '</b></span>' : '',
          ean ? '<span>EAN: <b>' + escapeHtml(ean) + '</b></span>' : '',
          '<span>Stan wg importu: <b>' + stockAmount(tape).toLocaleString('pl-PL', { maximumFractionDigits: 2 }) + '</b></span>',
        '</div>',
        '<div class="product-spec-grid">',
          '<div><small>Napięcie</small><strong>' + result.voltage + ' V DC</strong></div>',
          '<div><small>Moc</small><strong>' + result.wattsPerMeter.toLocaleString('pl-PL') + ' W/m</strong></div>',
          '<div><small>Szczelność</small><strong>IP' + productIp(tape) + '</strong></div>',
          '<div><small>Technologia</small><strong>' + tapeTechnology(tape).toUpperCase() + '</strong></div>',
          '<div><small>' + (cri ? 'CRI' : 'Jasność') + '</small><strong>' + (cri ? 'Ra ' + cri : brightness ? brightness + ' lm/m' : 'wg karty') + '</strong></div>',
        '</div>',
        '<div class="selection-reasons"><strong>Dlaczego ta taśma?</strong><ul>' + selectionReasons(result).map(function (reason) { return '<li>' + escapeHtml(reason) + '</li>'; }).join('') + '</ul></div>',
        sale.waste >= 5 ? '<p class="packaging-warning">Najmniejsza jednostka pokrywa ' + sale.coverage.toLocaleString('pl-PL') + ' m przy zapotrzebowaniu ' + result.answers.length.toLocaleString('pl-PL') + ' m.</p>' : '',
        '<div class="selected-buy-row">',
          '<div class="selected-price"><strong>' + currency.format(priceFor(tape, sale.quantity)) + '</strong><small>' + escapeHtml(sale.label) + ' · ' + escapeHtml(sale.detail) + ' · cena wg importu</small></div>',
          '<a class="product-link-button" href="product.html?id=' + encodeURIComponent(tape.id) + '">Zobacz produkt</a>',
          '<button class="tape-cart-button" type="button" data-action="add-tape">Dodaj taśmę</button>',
        '</div>',
      '</div>',
    '</article>',
    alternatives.length ? '<section class="alternatives funnel-alternatives" aria-labelledby="alternativesTitle"><div class="alternatives-header"><h3 id="alternativesTitle">Pozostałe ' + alternatives.length + ' zgodne opcje</h3><span class="status-pill ok">Ta sama konfiguracja</span></div><div class="alternatives-grid">' + alternatives.map(renderAlternative).join('') + '</div></section>' : '',
    '<div class="system-section-title"><h3>Elementy do uruchomienia taśmy</h3><p>Zasilanie i sterowanie wynikają z napięcia oraz obciążenia wybranego SKU.</p></div>',
    '<div class="result-grid">',
      '<div class="system-list"><div class="system-list-header"><h3>Zgodne komponenty</h3><span>' + supportRows.length + ' pozycje</span></div>' + supportRows.join('') + '</div>',
      '<aside class="bundle-summary">',
        '<h3>Podsumowanie zestawu</h3>',
        '<p>Taśma, zasilanie i sterowanie. Profil pozostaje do wyboru pod miejsce montażu.</p>',
        '<div class="calculation">',
          '<div><span>Moc taśmy</span><strong>' + result.wattsPerMeter.toLocaleString('pl-PL') + ' W/m × ' + result.answers.length.toLocaleString('pl-PL') + ' m</strong></div>',
          '<div><span>Obciążenie</span><strong>' + result.loadPower.toFixed(1).replace('.', ',') + ' W</strong></div>',
          '<div><span>Minimum z zapasem 20%</span><strong>' + result.requiredPower.toFixed(1).replace('.', ',') + ' W</strong></div>',
          '<div><span>Wybrane zasilanie</span><strong>' + selectedSupply + '</strong></div>',
        '</div>',
        '<div class="bundle-total"><span>Razem teraz</span><strong>' + currency.format(total) + '</strong></div>',
        '<button class="bundle-button" type="button" data-action="add-bundle" ' + (bundleReady ? '' : 'disabled') + '>' + (bundleReady ? 'Dodaj cały zestaw (' + components.length + ')' : 'Zestaw wymaga konsultacji') + '</button>',
        runWarning,
        '<p class="bundle-note">Przed montażem potwierdź prowadzenie przewodów, strefę IP i odprowadzanie ciepła.</p>',
      '</aside>',
    '</div>'
  ].join('');
}

function submitConfiguration() {
  const answers = answersFromForm();
  state.candidates = chooseCandidates(answers);
  if (!state.candidates.length) {
    validationMessage.textContent = 'Ta kombinacja straciła dostępność. Wybierz aktywny wariant z licznikiem.';
    updateStepUi();
    return;
  }
  state.selectedTapeId = state.candidates[0].id;
  renderResult();
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(cart) ? cart : [];
  } catch (error) {
    return [];
  }
}

function updateCartBadge() {
  const count = readCart().reduce(function (sum, item) {
    return sum + Math.max(1, numeric(item.qty));
  }, 0);
  cartBadge.textContent = String(count);
}

function saveConfiguration(components) {
  const saved = JSON.parse(localStorage.getItem(CONFIGURATIONS_KEY) || '[]');
  saved.push({
    id: 'cfg-' + Date.now(),
    rulesVersion: RULES_VERSION,
    createdAt: new Date().toISOString(),
    answers: state.result.answers,
    selectedTapeId: state.result.tape.id,
    componentIds: components.map(function (component) {
      return component.product.id;
    })
  });
  localStorage.setItem(CONFIGURATIONS_KEY, JSON.stringify(saved.slice(-20)));
}

function addComponentsToCart(components, message) {
  const cart = readCart();
  components.forEach(function (component) {
    const existing = cart.find(function (item) {
      return String(item.id) === String(component.product.id);
    });
    if (existing) {
      existing.qty += component.quantity;
    } else {
      cart.push({
        id: component.product.id,
        title: component.product.title,
        price: numeric(component.product.price),
        image: productImage(component.product),
        qty: component.quantity,
        category: component.product.category
      });
    }
  });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  saveConfiguration(components);
  updateCartBadge();
  showToast(message);
}

function addTapeToCart() {
  if (!state.result) return;
  addComponentsToCart([{ product: state.result.tape, quantity: state.result.quantity }], 'Dodano dobraną taśmę.');
}

function addBundleToCart() {
  if (!state.result || state.result.missing.length) return;
  const components = [{ product: state.result.tape, quantity: state.result.quantity }];
  if (state.result.powerPlan) components.push({ product: state.result.powerPlan.product, quantity: state.result.powerPlan.quantity });
  if (state.result.controllerPlan) components.push({ product: state.result.controllerPlan.product, quantity: state.result.controllerPlan.quantity });
  addComponentsToCart(components, 'Dodano cały zgodny zestaw.');
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

nextButton.addEventListener('click', function () {
  if (!validateStep(state.currentStep)) {
    validationMessage.textContent = validationText(state.currentStep);
    return;
  }
  if (state.currentStep < steps.length - 1) showStep(state.currentStep + 1, false);
  else submitConfiguration();
});

backButton.addEventListener('click', function () {
  showStep(state.currentStep - 1, false);
});

form.addEventListener('change', function (event) {
  if (event.target.matches('input')) clearDownstreamAnswers(state.currentStep);
  validationMessage.textContent = '';
  const count = refreshFunnel();
  updateNextButton(count);
  updateProjectPreview();
});

form.addEventListener('input', function (event) {
  if (event.target.matches('input[type="number"]')) clearDownstreamAnswers(state.currentStep);
  validationMessage.textContent = '';
  const count = refreshFunnel();
  updateNextButton(count);
  updateProjectPreview();
});

form.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.target.matches('input[type="number"]')) {
    event.preventDefault();
    nextButton.click();
  }
});

resultsContent.addEventListener('click', function (event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  if (button.dataset.action === 'add-tape') addTapeToCart();
  if (button.dataset.action === 'add-bundle') addBundleToCart();
  if (button.dataset.action === 'select-tape') {
    state.selectedTapeId = button.dataset.productId;
    renderResult();
    document.querySelector('#resultsTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

editConfigurationButton.addEventListener('click', function () {
  resultsSection.hidden = true;
  showStep(0, true);
});

const siteHeader = document.querySelector('#siteHeader');
const menuButton = document.querySelector('#menuButton');
const mobileMenu = document.querySelector('#mobileMenu');

function updateHeader() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 18);
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Otwórz menu');
  mobileMenu.hidden = true;
  siteHeader.classList.remove('menu-active');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', function () {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  if (open) closeMenu();
  else {
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Zamknij menu');
    mobileMenu.hidden = false;
    siteHeader.classList.add('menu-active');
    document.body.classList.add('menu-open');
  }
});

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', function () {
  if (window.innerWidth > 980) closeMenu();
});

document.querySelector('#headerSearch').addEventListener('submit', function (event) {
  event.preventDefault();
  const query = document.querySelector('#headerSearchInput').value.trim();
  window.location.href = query ? 'shop.html?q=' + encodeURIComponent(query) : 'shop.html';
});

async function loadCatalog() {
  try {
    const response = await fetch(CATALOG_URL, { cache: 'no-cache' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const catalog = await response.json();
    if (!Array.isArray(catalog)) throw new Error('Nieprawidłowy format katalogu');

    state.catalog = catalog;
    state.tapes = catalog.filter(function (product) {
      return normalize(product.category).includes('tasmy led');
    });
    state.powerSupplies = catalog.filter(function (product) {
      return normalize(product.category).includes('zasilacze led');
    });
    state.controllers = catalog.filter(function (product) {
      return normalize(product.category).includes('sterowniki led');
    });
    state.initialTapeCount = state.tapes.filter(hasRequiredTapeData).length;
    state.catalogReady = state.initialTapeCount > 0 && state.powerSupplies.length > 0 && state.controllers.length > 0;
    if (!state.catalogReady) throw new Error('Brakuje kategorii potrzebnych do konfiguratora');

    document.querySelector('#heroCatalogCount').textContent = catalog.length.toLocaleString('pl-PL');
    loadingPanel.hidden = true;
    updateStepUi();
  } catch (error) {
    console.error('Błąd katalogu konfiguratora:', error);
    loadingPanel.hidden = true;
    catalogError.hidden = false;
    nextButton.disabled = true;
  }
}

updateHeader();
updateCartBadge();
updateProjectPreview();
updateStepUi();
loadCatalog();
