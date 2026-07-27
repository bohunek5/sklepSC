window.ConfiguratorCore = (() => {
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
    if (['outdoor', 'garden'].includes(application)) return tape.ip >= 65;
    if (application === 'bathroom') return tape.ip >= 63;
    if (application === 'stairs') return tape.power <= 15;
    if (['bedroom', 'wardrobe', 'furniture'].includes(application)) return tape.power <= 16;
    if (['office', 'commercial', 'garage'].includes(application)) return tape.power >= 8;
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
    if (['outdoor', 'garden'].includes(application) && environment !== 'outdoor') return false;
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

  const filteredTapes = (tapes, configuration) => tapes.filter((tape) => tapeMatches(tape, configuration));

  function scoreTape(tape, state) {
    const targetPower = state.intensity === 'decorative' ? 8 : state.intensity === 'strong' ? 19 : 11;
    let score = 180 - Math.abs(tape.power - targetPower) * 8;
    if (state.technology !== 'auto' && tape.technology.toLowerCase() === state.technology) score += 80;
    if (state.technology === 'auto' && tape.technology === 'COB') score += 18;
    if (state.length >= 20 && tape.voltage === 48) score += 70;
    else if (state.length > 5 && tape.voltage === 24) score += 42;
    else if (state.length <= 5 && [12, 24].includes(tape.voltage)) score += 20;
    if (['kitchen', 'commercial', 'bathroom', 'office', 'garage'].includes(state.application) && tape.cri >= 90) score += 28;
    if (tape.lumens) score += Math.min(tape.lumens / 180, 15);
      if (state.warranty === 7 && (tape.product.title.includes("7Y") || tape.product.title.includes("Delux"))) score += 300;
    score += Math.min(tape.stock, 100) / 20;
    return score;
  }

  function chooseCandidates(tapes, state) {
    return filteredTapes(tapes, state)
      .slice()
      .sort((a, b) => scoreTape(b, state) - scoreTape(a, state))
      .filter((tape, index, array) => array.findIndex((candidate) => candidate.product.id === tape.product.id) === index)
      .slice(0, 3);
  }

  function categoryProducts(catalog, fragment) {
    const normalizedFragment = normalize(fragment);
    return catalog.filter((product) => normalize(product.category).includes(normalizedFragment) && stockNumber(product) > 0 && Number(product.price) > 0);
  }

  function powerSupplyPlan(tape, state, catalog) {
    if (tape.voltage === 48) return { product: null, quantity: 0, capacity: 0, load: tape.power * state.length, required: tape.power * state.length * 1.2, reason: 'W lokalnym katalogu nie ma obecnie zasilacza Scharfer 48 V.' };
    const totalLoad = tape.power * state.length;
    const required = totalLoad * 1.2;
    const segmentRequired = required / state.segments;
    const supplies = categoryProducts(catalog, 'zasilacze led scharfer')
      .map((product) => ({ product, voltage: productVoltage(product), watts: firstNumber(product.title, /(\d+(?:[.,]\d+)?)\s*w/i) }))
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

  function controllerPlan(tape, psuPlan, state, catalog) {
    const required = state.control !== 'switch' || ['cct', 'rgb', 'rgbw'].includes(state.light);
    if (!required) return { required: false, product: null, quantity: 0 };
    const channel = controllerChannels(state.light);
    const candidates = categoryProducts(catalog, 'sterowniki led').filter((product) => {
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

  function parseRollLength(product) {
    const text = normalize(product.title);
    if (/tasma\s*na\s*metry/.test(text)) return 1;
    return firstNumber(text, /rolka\s*(\d+(?:[.,]\d+)?)\s*m/i) || firstNumber(text, /(?:^|\s)(1|5|10|50)\s*m(?:\s|$)/i) || 5;
  }

  return {
    normalize, productText, stockNumber, firstNumber, productVoltage, productPower, productLumens, productIp,
    productCri, productWidth, productTechnology, productLight, normalizeTape, isTape, hasRequiredTapeData,
    applicationMatches, intensityMatches, environmentMatches, controlMatches, tapeMatches, filteredTapes,
    scoreTape, chooseCandidates, categoryProducts, powerSupplyPlan, controllerChannels, controllerPlan, parseRollLength
  };
})();
