import re

file_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(file_path, 'r', encoding='utf-8') as f:
    js = f.read()

# I need to completely replace the ai-agent logic to support stateful carts.
# Since it's around 150 lines, I'll rewrite the whole file content to be clean and bug-free.

new_js = """document.addEventListener('DOMContentLoaded', async () => {
  const chatHistory = document.querySelector('.chat-history');
  const chatInput = document.getElementById('aiChatInput');
  const sendButton = document.querySelector('.ai-input-area button');
  const inputArea = document.querySelector('.ai-input-area');
  if (!chatHistory || !chatInput || !sendButton) return;

  chatInput.addEventListener('focus', () => inputArea.classList.add('focused'));
  chatInput.addEventListener('blur', () => inputArea.classList.remove('focused'));

  let catalog = [];
  let tapes = [];
  let lastProposedItems = []; // Stores the latest generated products for quick buy

  try {
    const response = await fetch('js/prescot-imported-products.json');
    if (response.ok) {
      catalog = await response.json();
      tapes = catalog.filter(ConfiguratorCore.isTape).map(ConfiguratorCore.normalizeTape).filter(ConfiguratorCore.hasRequiredTapeData);
    }
  } catch (e) {
    console.error('Failed to load catalog for AI agent', e);
  }

  function parseIntent(text) {
    const lower = text.toLowerCase();
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

    const lengthMatch = lower.match(/(\\d+(?:\\.\\d+)?)\\s*m/);
    if (lengthMatch) state.length = parseFloat(lengthMatch[1]);

    if (/kuchni|blat|szafk/i.test(lower)) state.application = 'kitchen';
    else if (/salon|sufit|wnęk|sypialn|pok/i.test(lower)) state.application = 'living';
    else if (/schod/i.test(lower)) state.application = 'stairs';
    else if (/łazienk|lazienk|wann/i.test(lower)) { state.application = 'bathroom'; state.environment = 'damp'; }
    else if (/zewnątrz|ogród|taras|elewacj|balkon/i.test(lower)) { state.application = 'outdoor'; state.environment = 'outdoor'; }
    else if (/sklep|biuro|komercyj/i.test(lower)) state.application = 'commercial';
    else if (/korytarz/i.test(lower)) state.application = 'stairs';

    if (/ciepł|ciepl|warm/i.test(lower)) state.light = 'warm';
    else if (/zimn|chłod/i.test(lower)) state.light = 'cold';
    else if (/neutral|dzien/i.test(lower)) state.light = 'neutral';
    else if (/cct|regulowan/i.test(lower)) state.light = 'cct';
    else if (/rgbw/i.test(lower)) state.light = 'rgbw';
    else if (/kolor|rgb/i.test(lower)) state.light = 'rgb';

    if (/cob|linia|gładk|kropek|bezpunkt/i.test(lower)) state.technology = 'cob';
    else if (/smd/i.test(lower)) state.technology = 'smd';

    if (/mocn|jasn|oświetleni|główn|czytani/i.test(lower)) state.intensity = 'strong';
    else if (/słab|dekorac|akcent|nastroj/i.test(lower)) state.intensity = 'decorative';
    else if (/funkcjonal|robocz/i.test(lower)) state.intensity = 'functional';

    if (/24v/i.test(lower)) state.voltage = '24';
    else if (/48v/i.test(lower)) state.voltage = '48';
    else if (/12v/i.test(lower)) state.voltage = '12';
    else if (state.length >= 15) state.voltage = '24'; 
    
    // Check if user wants to buy
    const wantsToBuy = /dodaj|kup|zamów|biorę|zapakuj|dorzuć/i.test(lower);

    return { state, wantsToBuy };
  }

  function formatPrice(value) {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(Number(value) || 0);
  }

  function productImage(product) {
    return product?.images?.[0] || 'images/okladka-produkty.webp';
  }
  
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    const count = cart.reduce((total, item) => total + Number(item.qty || item.quantity || 0), 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = String(count);
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
  }

  function addMessageBubble(isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user' : ''}`;
    
    let avatar = isUser 
      ? `<div class="avatar avatar-user"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`
      : `<div class="avatar avatar-ai"><svg class="gemini-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.645 9.355L24 12L14.645 14.645L12 24L9.355 14.645L0 12L9.355 9.355L12 0Z"/></svg></div>`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    msg.innerHTML = avatar;
    msg.appendChild(bubble);
    chatHistory.appendChild(msg);
    msg.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return bubble;
  }

  async function streamText(bubble, text, onComplete) {
    let index = 0;
    bubble.innerHTML = '';
    const interval = setInterval(() => {
      const chunk = text.substr(index, Math.floor(Math.random() * 3) + 2);
      bubble.innerHTML += chunk;
      index += chunk.length;
      chatHistory.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 15);
  }

  async function processUserInput(text) {
    if (!text.trim()) return;
    
    const userBubble = addMessageBubble(true);
    userBubble.textContent = text;
    chatInput.value = '';

    const aiBubble = addMessageBubble(false);
    aiBubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    await new Promise(r => setTimeout(r, 600));

    const chunks = text.split(/\\b(?:a do|i do|oraz do|a na|i na)\\b/i);
    let allResponsesText = [];
    let allProductsHtml = '';
    
    // Check if the overall intent contains buy command
    const { wantsToBuy: overallBuy } = parseIntent(text);
    
    // Check if it's a naked buy command ("dodaj", "kup to") without specifics
    let isNakedBuy = false;
    if (overallBuy && chunks.length === 1) {
        const { state } = parseIntent(text);
        if (!state.application && !state.light && !state.intensity && state.technology === 'auto') {
            isNakedBuy = true;
        }
    }

    if (isNakedBuy) {
        if (lastProposedItems.length > 0) {
            addItemsToCart(lastProposedItems);
            streamText(aiBubble, "Zrobione! Dodałem zaproponowane produkty do Twojego koszyka. Czy masz jeszcze jakieś pomieszczenie do oświetlenia?", () => {
                aiBubble.innerHTML = "Zrobione! Dodałem zaproponowane produkty do Twojego koszyka. Czy masz jeszcze jakieś pomieszczenie do oświetlenia?";
                
                const productsContainer = document.createElement('div');
                productsContainer.style.marginTop = '20px';
                
                const cta = document.createElement('a');
                cta.href = 'cart.html';
                cta.className = 'pro-product-card';
                cta.style.justifyContent = 'center';
                cta.style.background = '#ff5a00';
                cta.style.color = '#fff';
                cta.style.textDecoration = 'none';
                cta.style.fontWeight = 'bold';
                cta.style.border = 'none';
                cta.textContent = 'Przejdź do kasy';
                productsContainer.appendChild(cta);
                
                aiBubble.appendChild(productsContainer);
                chatHistory.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
            });
            lastProposedItems = []; // Clear after buying
        } else {
            streamText(aiBubble, "Nie jestem pewien, co mam dodać do koszyka. Opisz mi najpierw, czego szukasz, a chętnie dobiorę dla Ciebie produkty!");
        }
        return;
    }

    // Process regular requests (with or without auto-buy)
    let newProposedItems = [];
    
    chunks.forEach((chunk, index) => {
      const { state, wantsToBuy } = parseIntent(chunk);
      if (index > 0) {
          const first = parseIntent(chunks[0]);
          if (!state.application) state.application = first.state.application;
          if (!state.light) state.light = first.state.light;
      }
      
      const candidates = ConfiguratorCore.chooseCandidates(tapes, state);
      if (!candidates.length) {
        allResponsesText.push(`Dla strefy ${index+1} nie znalazłem taśmy idealnie spełniającej warunki.`);
        return;
      }

      const primary = candidates[0];
      const psu = ConfiguratorCore.powerSupplyPlan(primary, state, catalog);
      
      const tapeRollLength = ConfiguratorCore.parseRollLength(primary.product);
      const tapeQuantity = Math.max(1, Math.ceil(state.length / tapeRollLength));
      
      newProposedItems.push(cartRecord(primary.product, tapeQuantity));
      if (psu.product) newProposedItems.push(cartRecord(psu.product, psu.quantity));
      
      let contextName = state.application ? ConfiguratorCore.labels?.application?.[state.application] || 'tej strefy' : `Strefa ${index+1}`;
      let lengthText = state.length ? `${state.length}m` : 'standardowych 5m';
      
      let txt = `Dla ${contextName} (${lengthText}): dobieram taśmę ${primary.technology || 'SMD'} ${primary.voltage}V. `;
      if (primary.technology === 'COB') txt += `Zapewni idealnie gładką linię (CRI ${primary.cri}). `;
      else txt += `Moc wynosi ${primary.power}W/m. `;
      
      allResponsesText.push(txt);
      
      allProductsHtml += `
        <div class="pro-product-card">
          <img src="${productImage(primary.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          <div style="flex: 1;">
            <div style="font-size: 11px; color: #ff9a64; text-transform: uppercase; font-weight: bold;">${contextName} - Taśma (x${tapeQuantity})</div>
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${primary.product.title}</div>
            <div style="font-size: 12px; color: #94a3b8;">${primary.voltage}V | ${primary.power} W/m | IP${primary.ip}</div>
          </div>
          <div style="font-weight: bold; color: #fff;">${formatPrice(primary.product.price * tapeQuantity)}</div>
        </div>
      `;

      if (psu.product) {
        allProductsHtml += `
          <div class="pro-product-card">
            <img src="${productImage(psu.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; background: #fff;">
            <div style="flex: 1;">
              <div style="font-size: 11px; color: #ff9a64; text-transform: uppercase; font-weight: bold;">${contextName} - Zasilanie (x${psu.quantity})</div>
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${psu.product.title}</div>
              <div style="font-size: 12px; color: #94a3b8;">${psu.wattsEach}W | Zapas min. 20%</div>
            </div>
            <div style="font-weight: bold; color: #fff;">${formatPrice(psu.product.price * psu.quantity)}</div>
          </div>
        `;
      }
    });
    
    if (newProposedItems.length > 0) {
        lastProposedItems = newProposedItems;
    }

    if (overallBuy && newProposedItems.length > 0) {
        addItemsToCart(newProposedItems);
        allResponsesText.unshift("Zrozumiałem! Przeliczyłem zestawy i **od razu dodałem je do koszyka**:");
        lastProposedItems = []; // clear since they are bought
    } else if (chunks.length > 1) {
        allResponsesText.unshift("Zrozumiałem, że potrzebujesz rozwiązań dla kilku stref. Przeliczyłem je niezależnie:");
    }

    const finalResponseText = allResponsesText.join('<br><br>');
    
    streamText(aiBubble, finalResponseText.replace(/<br>/g, '\\n'), () => {
      // Restore formatting
      aiBubble.innerHTML = finalResponseText.replace(/\\n/g, '<br>');
      
      if (allProductsHtml) {
        const productsContainer = document.createElement('div');
        productsContainer.style.marginTop = '20px';
        productsContainer.style.display = 'flex';
        productsContainer.style.flexDirection = 'column';
        productsContainer.style.gap = '12px';
        productsContainer.innerHTML = allProductsHtml;
        
        const cta = document.createElement('a');
        cta.href = 'cart.html';
        cta.className = 'pro-product-card';
        cta.style.justifyContent = 'center';
        cta.style.background = '#ff5a00';
        cta.style.color = '#fff';
        cta.style.textDecoration = 'none';
        cta.style.fontWeight = 'bold';
        cta.style.border = 'none';
        cta.textContent = overallBuy ? 'Przejdź do kasy' : 'Dodaj wszystko do koszyka';
        
        if (!overallBuy) {
            cta.href = '#';
            cta.addEventListener('click', (e) => {
                e.preventDefault();
                addItemsToCart(lastProposedItems);
                cta.textContent = 'DODANO! Przejdź do kasy';
                cta.href = 'cart.html';
                cta.style.background = '#10b981'; // Green
                lastProposedItems = [];
                // recreate listener for href click now
                cta.replaceWith(cta.cloneNode(true));
            });
        }
        
        productsContainer.appendChild(cta);
        aiBubble.appendChild(productsContainer);
        chatHistory.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  }

  sendButton.addEventListener('click', () => processUserInput(chatInput.value));
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processUserInput(chatInput.value); });
});
"""

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_js)
print("Updated ai-agent.js with cart logic")
