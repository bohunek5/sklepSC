document.addEventListener('DOMContentLoaded', async () => {
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
      voltage: 'auto',
      warranty: null
    };

    const lengthMatch = lower.match(/(\d+(?:\.\d+)?)\s*m/);
    if (lengthMatch) state.length = parseFloat(lengthMatch[1]);

    if (/7\s*lat|delux|7y/i.test(lower)) state.warranty = 7;

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

    const hasAnyIntent = Boolean(state.application || state.light || state.intensity || state.technology !== 'auto' || lengthMatch || /taśm|tasm|led|rgb|cct/i.test(lower) && !/zasilacz|zasialcz|profil|sterownik/i.test(lower));
    return { state, wantsToBuy, hasAnyIntent };
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

    function renderProductsInBubble(aiBubble, productsList, isBought, headerText) {
      let html = `<div style="margin-top: 15px; font-weight: 600; font-size: 13px; color: #667286; text-transform: uppercase;">${headerText}</div><div style="margin-top: 10px; display: flex; flex-direction: column; gap: 12px;">`;
      
      productsList.forEach(p => {
          html += `
            <div class="pro-product-card" style="padding: 10px;">
              <a href="product.html?id=${p.id}" target="_blank" style="flex-shrink: 0;"><img src="${productImage(p)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; background: #fff;"></a>
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 2px;"><a href="product.html?id=${p.id}" target="_blank" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${p.title}</a></div>
                <div style="font-size: 11px; color: #94a3b8;">${p.category || 'Produkt'}</div>
              </div>
              <div style="font-weight: bold; color: #fff; font-size: 14px;">${formatPrice(p.price)}</div>
            </div>
          `;
      });
      html += '</div>';

      const productsContainer = document.createElement('div');
      productsContainer.innerHTML = html;
      
      const cta = document.createElement('a');
      cta.className = 'pro-product-card ai-add-all-btn' + (isBought ? ' bought' : '');
      cta.textContent = isBought ? 'DODANO! Przejdź do kasy' : 'Dodaj wszystko do koszyka';
      cta.href = '#';
      
      cta.onclick = (e) => {
          e.preventDefault();
          if (!isBought) {
              addItemsToCart(lastProposedItems);
              cta.textContent = 'DODANO! Przejdź do kasy';
              cta.classList.add('bought');
              lastProposedItems = [];
              const clone = cta.cloneNode(true);
              clone.onclick = (e) => { e.preventDefault(); window.location.href = 'cart.html'; };
              cta.replaceWith(clone);
          }
          window.location.href = 'cart.html';
      };
      
      productsContainer.appendChild(cta);
      aiBubble.appendChild(productsContainer);
      chatHistory.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    
    // Trigger global events so shared-popups.js opens the sidebar cart
    window.dispatchEvent(new Event('storage'));
    if (typeof window.openCartDrawer === 'function') {
      window.openCartDrawer();
    }
  }

  function addMessageBubble(isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user' : ''}`;
    
    let avatar = isUser 
      ? `<div class="avatar avatar-user"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`
      : `<div class="avatar avatar-ai"><img src="images/prescot-pattern.png" style="width: 100%; height: 100%; object-fit: contain; width: 24px !important; height: 24px !important; object-fit: contain; border-radius: 8px;"></div>`;

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

    const chunks = text.split(/\b(?:a do|i do|oraz do|a na|i na)\b/i);
    let allResponsesText = [];
    let allProductsHtml = '';
    
    // Check if the overall intent contains buy command
    const { wantsToBuy: overallBuy } = parseIntent(text);
    
    const { hasAnyIntent: anyIntentOverall } = parseIntent(text);
    const lowerText = text.toLowerCase();
    
    // Check conversational intent and product search if no specific tape intent is found
    if (!anyIntentOverall) {
        if (/cześć|czesc|witaj|hej|siema|dzień dobry|witam/i.test(lowerText) && lowerText.length < 15) {
            streamText(aiBubble, "Cześć! W czym mogę Ci dzisiaj pomóc? Opisz mi swój projekt oświetlenia lub po prostu wpisz, jakich produktów szukasz (np. 'zasilacz hermetyczny ip67').", () => {
                aiBubble.innerHTML = "Cześć! W czym mogę Ci dzisiaj pomóc? Opisz mi swój projekt oświetlenia lub po prostu wpisz, jakich produktów szukasz (np. 'zasilacz hermetyczny ip67').";
            });
            return;
        } else if (/dzięki|dzieki|dziekuje|dziękuję/i.test(lowerText) && lowerText.length < 15) {
            streamText(aiBubble, "Nie ma za co! Polecam się na przyszłość. Czy mogę jeszcze w czymś pomóc?", () => {
                aiBubble.innerHTML = "Nie ma za co! Polecam się na przyszłość. Czy mogę jeszcze w czymś pomóc?";
            });
            return;
        } else {
            // General Product Search Fallback
            const cleanText = lowerText.replace(/[.,!?]/g, ' ').replace(/ledip/g, 'led ip');
            const stopWords = ['do', 'na', 'w', 'o', 'z', 'i', 'a', 'oraz', 'potrzebuje', 'szukam', 'poszukuję', 'chcę', 'kupić', 'proszę', 'potrzebuję'];
            const rawKeywords = cleanText.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
            
            const keywords = rawKeywords.map(w => {
                if (w.startsWith('zasilacz') || w.startsWith('zasial')) return 'zasilacz';
                if (w.startsWith('profil')) return 'profil';
                if (w.startsWith('taśm') || w.startsWith('tasm')) return 'taśm';
                if (w.startsWith('sterownik')) return 'sterownik';
                if (w === 'ip67' || w === 'hermetyczny' || w === 'wodoodporny') return 'hermetyczny';
                return w;
            });
            
            let matchedProducts = [];
            if (keywords.length > 0) {
                matchedProducts = catalog.map(p => {
                    let score = 0;
                    keywords.forEach(k => {
                        if (p.title.toLowerCase().includes(k)) score += 3;
                        if (p.category && p.category.toLowerCase().includes(k)) score += 1;
                    });
                    return { product: p, score };
                }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.product).slice(0, 3);
            }

            if (matchedProducts.length > 0) {
                lastProposedItems = matchedProducts.map(p => cartRecord(p, 1));
                window.agentContext = window.agentContext || {};
                const firstPsu = matchedProducts.find(p => p.category && p.category.toLowerCase().includes('zasilacz') || p.title.toLowerCase().includes('zasilacz'));
                if (firstPsu) {
                    const vMatch = firstPsu.title.match(/(\d+)V/i);
                    const wMatch = firstPsu.title.match(/(\d+)W/i);
                    if (vMatch && wMatch) {
                        window.agentContext.lastPSU = { product: firstPsu, voltage: parseInt(vMatch[1]), power: parseInt(wMatch[1]) };
                    }
                }
                
                if (overallBuy) {
                    addItemsToCart(lastProposedItems);
                    const msg = "Znalazłem produkty pasujące do Twojego zapytania i od razu wrzuciłem je do koszyka!";
                    streamText(aiBubble, msg, () => {
                        aiBubble.innerHTML = msg;
                        renderProductsInBubble(aiBubble, matchedProducts, true, "Znalazłem te produkty:");
                        lastProposedItems = []; // clear since bought
                    });
                } else {
                    const msg = "Znalazłem kilka produktów, które mogą Cię zainteresować na podstawie Twoich słów:";
                    streamText(aiBubble, msg, () => {
                        aiBubble.innerHTML = msg;
                        renderProductsInBubble(aiBubble, matchedProducts, false, "Znalezione produkty:");
                    });
                }
                return;
            } else if (overallBuy) {
                const msg = "Nie znalazłem dokładnie takich produktów w bazie. Czy możesz podać inną nazwę?";
                streamText(aiBubble, msg, () => { aiBubble.innerHTML = msg; });
                return;
            } else {
                const msg = "Nie do końca zrozumiałem lub nie znalazłem takich produktów w bazie. Podaj mi proszę konkrety: np. 'potrzebuję 5m taśmy COB do salonu' albo wpisz nazwę szukanego towaru.";
                streamText(aiBubble, msg, () => {
                    aiBubble.innerHTML = msg;
                });
                return;
            }
        }
    }

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
                cta.href = '#';
                cta.onclick = (e) => { e.preventDefault(); window.location.href = 'cart.html'; };
                cta.className = 'pro-product-card ai-add-all-btn' + (overallBuy ? ' bought' : '');
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
          <a href="product.html?id=${primary.product.id}" target="_blank" style="flex-shrink: 0;"><img src="${productImage(primary.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"></a>
          <div style="flex: 1;">
            <div style="font-size: 11px; color: #667286; text-transform: uppercase; font-weight: bold;">${contextName} - Taśma (x${tapeQuantity})</div>
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;"><a href="product.html?id=${primary.product.id}" target="_blank" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${primary.product.title}</a></div>
            <div style="font-size: 12px; color: #94a3b8;">${primary.voltage}V | ${primary.power} W/m | IP${primary.ip}</div>
          </div>
          <div style="font-weight: bold; color: #fff;">${formatPrice(primary.product.price * tapeQuantity)}</div>
        </div>
      `;

      if (psu.product) {
        allProductsHtml += `
          <div class="pro-product-card">
            <a href="product.html?id=${psu.product.id}" target="_blank" style="flex-shrink: 0;"><img src="${productImage(psu.product)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; background: #fff;"></a>
            <div style="flex: 1;">
              <div style="font-size: 11px; color: #667286; text-transform: uppercase; font-weight: bold;">${contextName} - Zasilanie (x${psu.quantity})</div>
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;"><a href="product.html?id=${psu.product.id}" target="_blank" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${psu.product.title}</a></div>
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
    
    streamText(aiBubble, finalResponseText.replace(/<br>/g, '\n'), () => {
      // Restore formatting
      aiBubble.innerHTML = finalResponseText.replace(/\n/g, '<br>');
      
      if (allProductsHtml) {
        const productsContainer = document.createElement('div');
        productsContainer.style.marginTop = '20px';
        productsContainer.style.display = 'flex';
        productsContainer.style.flexDirection = 'column';
        productsContainer.style.gap = '12px';
        productsContainer.innerHTML = allProductsHtml;
        
        const cta = document.createElement('a');
        cta.href = '#';
                cta.onclick = (e) => { e.preventDefault(); window.location.href = 'cart.html'; };
        cta.className = 'pro-product-card ai-add-all-btn' + (overallBuy ? ' bought' : '');
        cta.textContent = overallBuy ? 'Przejdź do kasy' : 'Dodaj wszystko do koszyka';
        
        if (!overallBuy) {
            cta.href = '#';
            cta.addEventListener('click', (e) => {
                e.preventDefault();
                addItemsToCart(lastProposedItems);
                cta.textContent = 'DODANO! Przejdź do kasy';
                cta.href = '#';
                cta.onclick = (e) => { e.preventDefault(); window.location.href = 'cart.html'; };
                cta.classList.add('bought'); // Green
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
