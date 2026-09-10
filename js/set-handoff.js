import {buildSet, makeHandoff} from './set-assistant/engine.mjs';

const status = document.getElementById('set-status');
const add = document.getElementById('set-add');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
const money = value => new Intl.NumberFormat('pl-PL', {style: 'currency', currency: 'PLN'}).format(value);

function validIntent(intent) {
  if (!intent || typeof intent !== 'object' || Array.isArray(intent)) return false;
  if (!Number.isFinite(intent.length) || intent.length <= 0 || intent.length > 100) return false;
  if (!['mono', 'cct', 'rgb', 'rgbw', 'rgbcct'].includes(intent.color)) return false;
  if (intent.voltage !== undefined && ![12, 24, 48].includes(intent.voltage)) return false;
  if (intent.power !== undefined && (!Number.isFinite(intent.power) || intent.power <= 0 || intent.power > 1000)) return false;
  if (intent.kelvin !== undefined && (!Number.isFinite(intent.kelvin) || intent.kelvin < 1000 || intent.kelvin > 10000)) return false;
  if (intent.technology !== undefined && !['cob', 'smd'].includes(intent.technology)) return false;
  if (['digital', 'wet'].some(key => intent[key] !== undefined && typeof intent[key] !== 'boolean')) return false;
  return Object.keys(intent).every(key => ['length', 'color', 'voltage', 'power', 'kelvin', 'technology', 'digital', 'wet'].includes(key));
}

async function initialize() {
  const raw = new URLSearchParams(location.hash.slice(1)).get('set');
  if (!raw || raw.length > 4000) throw new Error('Otwórz asystenta Prescot i przygotuj zestaw, aby zobaczyć tutaj jego elementy.');
  let payload;
  try {payload = JSON.parse(raw);} catch {throw new Error('Link zestawu jest nieprawidłowy. Wróć do doboru i przygotuj go ponownie.');}
  if (payload.version !== 1 || !validIntent(payload.intent) || !Array.isArray(payload.items)) throw new Error('Nieprawidłowe dane zestawu. Przygotuj go ponownie w asystencie.');
  const response = await fetch(new URL('./set-assistant/catalog.json', import.meta.url), {signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('Katalog jest chwilowo niedostępny. Odśwież stronę, aby spróbować ponownie.');
  const catalog = (await response.json()).products;
  const verified = buildSet(catalog, payload.intent);
  if (!verified.ready) throw new Error(verified.issues.join(' '));
  const expected = makeHandoff(verified);
  if (JSON.stringify(payload.items) !== JSON.stringify(expected.items)) throw new Error('Elementy zestawu nie zgadzają się z jego parametrami. Wróć do asystenta i przygotuj zestaw ponownie.');
  // Deferred catalog script is complete by DOMContentLoaded.
  if (document.readyState === 'loading') await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, {once: true}));
  const shop = typeof window.getProducts === 'function' ? window.getProducts() : window.products;
  if (!Array.isArray(shop)) throw new Error('Nie można odczytać katalogu sklepu. Odśwież stronę.');
  const records = verified.items.map(({product, quantity, role}) => {
    const current = shop.find(p => p.id === product.id && p.kod_katalogowy === product.sku);
    if (!current || !Number.isFinite(Number(current.price)) || Number(current.price) <= 0) throw new Error('Jeden z produktów wymaga aktualizacji w sklepie. Przygotuj zestaw ponownie.');
    return {id: current.id, title: current.title, price: Number(current.price), image: current.images?.[0] || '', qty: quantity, color: null, size: null, role, sku: current.kod_katalogowy};
  });
  status.textContent = `Zestaw sprawdzony: ${verified.intent.length} m taśmy, ${verified.voltage} V, ${verified.load} W obciążenia. Zasilacz uwzględnia przyjęty zapas 20%.`;
  document.getElementById('set-products').innerHTML = records.map(p => `<article><span class="role">${escape(p.role)}</span><a href="product.html?id=${p.id}" class="photo"><img src="${escape(p.image)}" alt="${escape(p.title)}"></a><span class="sku">${escape(p.sku)}</span><h2>${escape(p.title)}</h2><div class="quantity">Ilość jednostek zakupu: ${p.qty}</div><div class="price">${money(p.price * p.qty)} <small>netto</small></div><a class="product-link" href="product.html?id=${p.id}">Zobacz produkt ↗</a></article>`).join('');
  document.getElementById('set-total').textContent = money(records.reduce((total, p) => total + p.price * p.qty, 0));
  document.querySelector('.summary').hidden = false;
  const fingerprint = JSON.stringify(expected);
  const alreadyAdded = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
      return sessionStorage.getItem('prescot-last-imported-set') === fingerprint && Array.isArray(cart)
        && records.every(record => cart.some(item => String(item.id) === String(record.id) && !item.color && !item.size && Number(item.qty) >= record.qty));
    } catch {return false;}
  };
  function done() {
    add.disabled = true;
    add.textContent = 'Zestaw dodany';
    document.getElementById('set-cart').hidden = false;
    status.textContent = 'Zestaw jest w koszyku. Możesz sprawdzić ilości i kontynuować zakupy.';
  }
  if (alreadyAdded()) done();
  add.addEventListener('click', () => {
    if (add.disabled) return;
    add.disabled = true;
    try {
      const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
      if (!Array.isArray(cart)) throw new Error('Invalid cart');
      for (const {role, sku, ...record} of records) {
        const existing = cart.find(item => String(item.id) === String(record.id) && !item.color && !item.size);
        if (existing) {
          if (!Number.isFinite(Number(existing.qty)) || Number(existing.qty) < 0) throw new Error('Invalid quantity');
          existing.qty = Number(existing.qty) + record.qty;
          existing.price = record.price;
        } else cart.push(record);
      }
      localStorage.setItem('prescot_cart', JSON.stringify(cart));
      try {sessionStorage.setItem('prescot-last-imported-set', fingerprint);} catch { /* Cart write has already succeeded. */ }
      done();
    } catch {
      status.dataset.error = 'true';
      status.textContent = 'Nie udało się zapisać zestawu. Sprawdź, czy przeglądarka pozwala zapisywać koszyk. Dotychczasowy koszyk pozostaje bez zmian.';
      add.disabled = false;
    }
  });
}

initialize().catch(error => {
  status.dataset.error = 'true';
  status.textContent = error.message || 'Nie udało się odczytać zestawu. Wróć do asystenta i spróbuj ponownie.';
  document.querySelector('.summary').hidden = true;
});
