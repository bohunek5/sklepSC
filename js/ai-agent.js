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

  // --- Context Manager & State Machine ---
  let aiSessionState = {
    application: null,
    intensity: null,
    technology: 'auto',
    light: null,
    length: null, // null means not provided yet
    segments: 1,
    environment: null,
    control: null,
    voltage: 'auto',
    warranty: null,
    lastProposedItems: [], // Memory of last recommended products
    awaitingClarification: null // E.g., 'light' or 'length'
  };

  function resetSession() {
    aiSessionState = {
      application: null,
      intensity: null,
      technology: 'auto',
      light: null,
      length: null,
      segments: 1,
      environment: null,
      control: null,
      voltage: 'auto',
      warranty: null,
      lastProposedItems: [],
      awaitingClarification: null
    };
  }

  try {
    const response = await fetch('js/prescot-imported-products.json');
    if (response.ok) {
      catalog = await response.json();
      tapes = catalog.filter(ConfiguratorCore.isTape).map(ConfiguratorCore.normalizeTape).filter(ConfiguratorCore.hasRequiredTapeData);
    }
  } catch (e) {
    console.error('Failed to load catalog for AI agent', e);
  }

  // --- Advanced NLP Parser ---
  function updateIntent(text) {
    const lower = text.toLowerCase();
    
    // Check for negations (simple window search)
    function isNegated(keyword) {
      const regex = new RegExp(`(?:nie\s+|bez\s+|oprócz\s+|zamiast\s+)(?:[\wąęłńóśźż]+\s+){0,2}${keyword}`, 'i');
      return regex.test(lower);
    }

    // Length parsing
    const lengthMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m|metr|metrow|metrów)/);
    if (lengthMatch && !isNegated('m')) {
        aiSessionState.length = parseFloat(lengthMatch[1].replace(',', '.'));
    }

    if ((/7\s*lat|delux|7y/i.test(lower)) && !isNegated('lat')) aiSessionState.warranty = 7;

    // Application
    if (/kuchni|blat|szafk/i.test(lower) && !isNegated('kuchni')) aiSessionState.application = 'kitchen';
    else if (/salon|sufit|wnęk|sypialn|pok/i.test(lower) && !isNegated('salon')) aiSessionState.application = 'living';
    else if (/schod/i.test(lower) && !isNegated('schod')) aiSessionState.application = 'stairs';
    else if (/łazienk|lazienk|wann/i.test(lower) && !isNegated('lazienk')) { aiSessionState.application = 'bathroom'; aiSessionState.environment = 'damp'; }
    else if (/zewnątrz|ogród|taras|elewacj|balkon/i.test(lower) && !isNegated('taras')) { aiSessionState.application = 'outdoor'; aiSessionState.environment = 'outdoor'; }
    else if (/sklep|biuro|komercyj/i.test(lower) && !isNegated('biur')) aiSessionState.application = 'commercial';
    else if (/korytarz/i.test(lower) && !isNegated('korytarz')) aiSessionState.application = 'stairs';

    // Light color
    if (/ciepł|ciepl|warm/i.test(lower) && !isNegated('ciepł')) aiSessionState.light = 'warm';
    else if (/zimn|chłod/i.test(lower) && !isNegated('zimn')) aiSessionState.light = 'cold';
    else if (/neutral|dzien/i.test(lower) && !isNegated('neutral')) aiSessionState.light = 'neutral';
    else if (/cct|regulowan/i.test(lower) && !isNegated('cct')) aiSessionState.light = 'cct';
    else if (/rgbw/i.test(lower) && !isNegated('rgbw')) aiSessionState.light = 'rgbw';
    else if (/kolor|rgb/i.test(lower) && !isNegated('rgb')) aiSessionState.light = 'rgb';

    // Technology
    if (/cob|linia|gładk|kropek|bezpunkt/i.test(lower)) {
        if (isNegated('cob') || isNegated('linia')) aiSessionState.technology = 'smd';
        else aiSessionState.technology = 'cob';
    } else if (/smd/i.test(lower) && !isNegated('smd')) {
        aiSessionState.technology = 'smd';
    }

    // Intensity
    if (/mocn|jasn|oświetleni|główn|czytani/i.test(lower) && !isNegated('mocn')) aiSessionState.intensity = 'strong';
    else if (/słab|dekorac|akcent|nastroj/i.test(lower) && !isNegated('słab')) aiSessionState.intensity = 'decorative';
    else if (/funkcjonal|robocz/i.test(lower) && !isNegated('funkcjonal')) aiSessionState.intensity = 'functional';

    // Voltage
    if (/24v/i.test(lower) && !isNegated('24v')) aiSessionState.voltage = '24';
    else if (/48v/i.test(lower) && !isNegated('48v')) aiSessionState.voltage = '48';
    else if (/12v/i.test(lower) && !isNegated('12v')) aiSessionState.voltage = '12';
    else if (aiSessionState.length && aiSessionState.length >= 15) aiSessionState.voltage = '24'; 
    
    const wantsToBuy = /dodaj|kup|zamów|biorę|zapakuj|dorzuć/i.test(lower);
    const wantsReset = /zacznijmy od nowa|reset|od nowa|usuń/i.test(lower);
    
    // Check if user is answering a clarification
    if (aiSessionState.awaitingClarification) {
        aiSessionState.awaitingClarification = null; // Cleared as they answered
    }

    return { wantsToBuy, wantsReset };
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
    
    window.dispatchEvent(new Event('storage'));
    if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
  }

  // --- UI Renderers ---
  function scrollToBottom() {
    chatHistory.scrollTo({
      top: chatHistory.scrollHeight,
      behavior: 'smooth'
    });
  }

  function addMessageBubble(isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user' : ''}`;
    
    let avatar = isUser 
      ? `<div class="avatar avatar-user"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`
      : `<div class="avatar avatar-ai"><img src="images/prescot-pattern.png" style="width: 100%; height: 100%; object-fit: contain; width: 24px !important; height: 24px !important; border-radius: 8px;"></div>`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    msg.innerHTML = avatar;
    msg.appendChild(bubble);
    chatHistory.appendChild(msg);
    scrollToBottom();
    return bubble;
  }

  function renderQuickReplies(aiBubble, options) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '8px';
    container.style.marginTop = '12px';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.label;
        btn.style.padding = '8px 16px';
        btn.style.borderRadius = '20px';
        btn.style.border = '1px solid rgba(225, 79, 39, 0.4)';
        btn.style.background = 'rgba(225, 79, 39, 0.1)';
        btn.style.color = '#fff';
        btn.style.fontSize = '13px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s';
        
        btn.onmouseover = () => { btn.style.background = '#e14f27'; };
        btn.onmouseout = () => { btn.style.background = 'rgba(225, 79, 39, 0.1)'; };
        
        btn.onclick = () => {
            container.remove();
            processUserInput(opt.value);
        };
        container.appendChild(btn);
    });
    aiBubble.appendChild(container);
    scrollToBottom();
  }

  function renderProducts(aiBubble, productsList, isBought, headerText) {
      let html = `<div style="margin-top: 15px; font-weight: 600; font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">${headerText}</div><div style="margin-top: 12px; display: flex; flex-direction: column; gap: 12px;">`;
      
      productsList.forEach(p => {
          html += `
            <div class="pro-product-card" style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); border-radius: 12px; transition: transform 0.2s;">
              <a href="product.html?id=${p.id}" target="_blank" style="flex-shrink: 0;"><img src="${productImage(p)}" style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px; background: #fff;"></a>
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; line-height: 1.3;"><a href="product.html?id=${p.id}" target="_blank" style="color: #f8fafc; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${p.title}</a></div>
                <div style="font-size: 12px; color: #64748b;">${p.category || 'Produkt'}</div>
              </div>
              <div style="font-weight: 700; color: #e14f27; font-size: 15px;">${formatPrice(p.price)}</div>
            </div>
          `;
      });
      html += '</div>';

      const productsContainer = document.createElement('div');
      productsContainer.innerHTML = html;
      
      const cta = document.createElement('a');
      cta.className = 'pro-product-card ai-add-all-btn' + (isBought ? ' bought' : '');
      cta.style.justifyContent = 'center';
      cta.style.marginTop = '12px';
      cta.style.background = isBought ? '#10b981' : '#e14f27';
      cta.style.color = '#fff';
      cta.style.fontWeight = '600';
      cta.style.textDecoration = 'none';
      cta.textContent = isBought ? 'DODANO! Przejdź do kasy' : 'Dodaj wszystko do koszyka';
      cta.href = '#';
      
      cta.onclick = (e) => {
          e.preventDefault();
          if (!isBought) {
              addItemsToCart(aiSessionState.lastProposedItems);
              cta.textContent = 'DODANO! Przejdź do kasy';
              cta.style.background = '#10b981';
              aiSessionState.lastProposedItems = [];
              const clone = cta.cloneNode(true);
              clone.onclick = (e) => { e.preventDefault(); if(window.openCartDrawer) window.openCartDrawer(); };
              cta.replaceWith(clone);
          }
          if(window.openCartDrawer) window.openCartDrawer();
      };
      
      productsContainer.appendChild(cta);
      aiBubble.appendChild(productsContainer);
      scrollToBottom();
  }

  // Parses markdown bold **text** to HTML
  function parseMarkdown(text) {
      return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  async function streamText(bubble, text, onComplete) {
    let index = 0;
    bubble.innerHTML = '';
    // Calculate speed based on length so it doesn't take forever for long text
    const speed = Math.max(5, 20 - Math.floor(text.length / 50)); 
    
    const interval = setInterval(() => {
      const chunk = text.substr(index, Math.floor(Math.random() * 3) + 2);
      // Escape HTML but allow our markdown to process at the end
      bubble.textContent += chunk; 
      index += chunk.length;
      scrollToBottom();
      
      if (index >= text.length) {
        clearInterval(interval);
        bubble.innerHTML = parseMarkdown(text);
        if (onComplete) onComplete();
      }
    }, speed);
  }

  async function processUserInput(text) {
    if (!text.trim()) return;
    
    const userBubble = addMessageBubble(true);
    userBubble.textContent = text;
    chatInput.value = '';

    const aiBubble = addMessageBubble(false);
    aiBubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
    
    // Simulate AI thinking time
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const { wantsToBuy, wantsReset } = updateIntent(text);
    
    if (wantsReset) {
        resetSession();
        streamText(aiBubble, "Zrozumiałem! Kontekst zresetowany. O czym nowym porozmawiamy? Do jakiego pomieszczenia potrzebujesz oświetlenia?");
        return;
    }
    
    const lowerText = text.toLowerCase();
    
    // Conversational Fallbacks
    if (/cześć|czesc|witaj|hej|siema|dzień dobry|witam/i.test(lowerText) && lowerText.length < 15) {
        streamText(aiBubble, "Cześć! W czym mogę Ci pomóc? Opowiedz mi o swoim projekcie, np. **'Potrzebuję 5m taśmy COB do kuchni'**.");
        return;
    } else if (/dzięki|dzieki|dziekuje|dziękuję/i.test(lowerText) && lowerText.length < 15) {
        streamText(aiBubble, "Nie ma za co! Zawsze do usług. Daj znać, jak będę mógł pomóc w czymś jeszcze.");
        return;
    }

    // Naked Buy Handling (buying last suggested items)
    if (wantsToBuy && aiSessionState.lastProposedItems.length > 0) {
        addItemsToCart(aiSessionState.lastProposedItems);
        streamText(aiBubble, "Zrobione! **Dodałem zaproponowane produkty do Twojego koszyka.** Masz coś jeszcze do oświetlenia, czy idziemy do kasy?", () => {
            renderProducts(aiBubble, aiSessionState.lastProposedItems.map(p => ({...p, price: p.price, title: p.title, images: [p.image], id: p.id})), true, "Twój koszyk został zaktualizowany:");
            aiSessionState.lastProposedItems = []; // Clear after buying
        });
        return;
    }

    // --- State Machine Logic (Clarifications) ---
    // If we have an application, but missing critical info (like length or light color)
    if (aiSessionState.application) {
        if (!aiSessionState.length) {
            aiSessionState.awaitingClarification = 'length';
            streamText(aiBubble, `Zanotowałem, że robimy oświetlenie do **${ConfiguratorCore.labels?.application?.[aiSessionState.application] || 'tego pomieszczenia'}**. Ile dokładnie **metrów** taśmy potrzebujesz?`, () => {
                renderQuickReplies(aiBubble, [
                    { label: 'Około 3 metry', value: '3m' },
                    { label: '5 metrów (standard)', value: '5m' },
                    { label: '10 metrów', value: '10m' }
                ]);
            });
            return;
        }
        
        if (!aiSessionState.light) {
            aiSessionState.awaitingClarification = 'light';
            streamText(aiBubble, `Super, mamy ustalone **${aiSessionState.length}m** do **${ConfiguratorCore.labels?.application?.[aiSessionState.application] || 'tego pomieszczenia'}**. Jaką barwę światła wolisz?`, () => {
                renderQuickReplies(aiBubble, [
                    { label: 'Ciepła (przytulna)', value: 'Ciepła' },
                    { label: 'Neutralna (dzienna)', value: 'Neutralna' },
                    { label: 'Zimna (nowoczesna)', value: 'Zimna' },
                    { label: 'Kolorowa (RGB)', value: 'RGB' }
                ]);
            });
            return;
        }
        
        // We have all critical info! Let's recommend.
        // For fallback length if null (shouldn't happen because of above check, but safe)
        const activeState = { ...aiSessionState, length: aiSessionState.length || 5 };
        const candidates = ConfiguratorCore.chooseCandidates(tapes, activeState);
        
        if (!candidates.length) {
            streamText(aiBubble, "Przykro mi, ale przy tych specyficznych wymaganiach nie potrafię dobrać idealnej taśmy. Spróbujmy od nowa. Zmieńmy może barwę lub technologię?", () => {
                 renderQuickReplies(aiBubble, [{ label: 'Resetuj kontekst', value: 'Zacznijmy od nowa' }]);
            });
            return;
        }

        const primary = candidates[0];
        const psu = ConfiguratorCore.powerSupplyPlan(primary, activeState, catalog);
        const tapeRollLength = ConfiguratorCore.parseRollLength(primary.product);
        const tapeQuantity = Math.max(1, Math.ceil(activeState.length / tapeRollLength));
        
        let newProposedItems = [];
        newProposedItems.push(cartRecord(primary.product, tapeQuantity));
        if (psu.product) newProposedItems.push(cartRecord(psu.product, psu.quantity));
        
        aiSessionState.lastProposedItems = newProposedItems;
        
        let txt = `Dobrałem idealny zestaw! Do **${ConfiguratorCore.labels?.application?.[activeState.application]}** (${activeState.length}m) proponuję taśmę **${primary.technology || 'SMD'} ${primary.voltage}V**. `;
        if (primary.technology === 'COB') txt += `Zapewni ona jednolitą, piękną linię światła. `;
        else txt += `Jest jasna i wydajna (${primary.power}W/m). `;
        
        if (psu.product) txt += `Dobraliśmy też bezpieczny zasilacz z odpowiednim zapasem mocy. `;
        
        if (wantsToBuy) {
            addItemsToCart(newProposedItems);
            txt += `\n\n**Zrozumiałem polecenie! Od razu dodałem produkty do koszyka.**`;
        } else {
            txt += `\n\nMożesz zedytować parametry (np. napisz "zmień na 24V" lub "chcę barwę ciepłą") albo dodać zestaw do koszyka.`;
        }
        
        streamText(aiBubble, txt, () => {
            renderProducts(aiBubble, newProposedItems.map(p => ({...p, price: p.price, title: p.title, images: [p.image], id: p.id})), wantsToBuy, "Gotowy zestaw:");
        });
        return;
    }

    // Keyword Search Fallback if no specific application intent was captured
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
        aiSessionState.lastProposedItems = matchedProducts.map(p => cartRecord(p, 1));
        
        if (wantsToBuy) {
            addItemsToCart(aiSessionState.lastProposedItems);
            const msg = "Znalazłem produkty pasujące do Twojego zapytania i **od razu wrzuciłem je do koszyka!**";
            streamText(aiBubble, msg, () => {
                renderProducts(aiBubble, matchedProducts, true, "Znalazłem te produkty:");
                aiSessionState.lastProposedItems = []; // clear since bought
            });
        } else {
            const msg = "Znalazłem kilka produktów, które mogą Cię zainteresować:";
            streamText(aiBubble, msg, () => {
                renderProducts(aiBubble, matchedProducts, false, "Znalezione produkty:");
            });
        }
        return;
    }
    
    // Generic Fallback
    streamText(aiBubble, "Nie do końca Cię zrozumiałem. Będę mógł pomóc najskuteczniej, jeśli napiszesz, **do jakiego pomieszczenia** potrzebujesz oświetlenia (np. salon, kuchnia).", () => {
        renderQuickReplies(aiBubble, [
            { label: 'Oświetlenie do kuchni', value: 'LED do kuchni' },
            { label: 'LED na schody', value: 'Taśma na schody' }
        ]);
    });

  }

  sendButton.addEventListener('click', () => processUserInput(chatInput.value));
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processUserInput(chatInput.value); });
});
