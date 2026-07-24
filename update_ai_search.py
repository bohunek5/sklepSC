import re

js_path = 'd:/MY-AI-AGENTS/sklepSC/js/ai-agent.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# I need to replace the conversational fallback block in ai-agent.js
# First find the conversational block we added previously.

old_block = """    // Check conversational intent if no product intent is found
    if (!anyIntentOverall && !overallBuy) {
        if (/cześć|czesc|witaj|hej|siema|dzień dobry|witam/i.test(lowerText)) {
            streamText(aiBubble, "Cześć! W czym mogę Ci dzisiaj pomóc? Opisz mi, jakie pomieszczenie chcesz oświetlić, jakiej długości taśmy potrzebujesz i jakiego efektu oczekujesz.", () => {
                aiBubble.innerHTML = "Cześć! W czym mogę Ci dzisiaj pomóc? Opisz mi, jakie pomieszczenie chcesz oświetlić, jakiej długości taśmy potrzebujesz i jakiego efektu oczekujesz.";
            });
            return;
        } else if (/dzięki|dzieki|dziekuje|dziękuję/i.test(lowerText)) {
            streamText(aiBubble, "Nie ma za co! Polecam się na przyszłość. Czy mogę jeszcze w czymś pomóc?", () => {
                aiBubble.innerHTML = "Nie ma za co! Polecam się na przyszłość. Czy mogę jeszcze w czymś pomóc?";
            });
            return;
        } else {
            streamText(aiBubble, "Nie do końca zrozumiałem. Podaj mi proszę konkrety: do jakiego pomieszczenia szukasz oświetlenia, jak długiej taśmy potrzebujesz i jakiej barwy światła oczekujesz?", () => {
                aiBubble.innerHTML = "Nie do końca zrozumiałem. Podaj mi proszę konkrety: do jakiego pomieszczenia szukasz oświetlenia, jak długiej taśmy potrzebujesz i jakiej barwy światła oczekujesz?";
            });
            return;
        }
    }"""

new_block = """    // Check conversational intent and product search if no specific tape intent is found
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
            const stopWords = ['do', 'na', 'w', 'o', 'z', 'i', 'a', 'oraz', 'potrzebuje', 'szukam', 'poszukuję', 'chcę', 'kupić', 'proszę'];
            const keywords = lowerText.replace(/[.,!?]/g, '').split(/\\s+/).filter(w => w.length > 2 && !stopWords.includes(w.toLowerCase()));
            
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
    }"""

# We need to add renderProductsInBubble helper
render_helper = """  function renderProductsInBubble(aiBubble, productsList, isBought, headerText) {
      let html = `<div style="margin-top: 15px; font-weight: 600; font-size: 13px; color: #ff9a64; text-transform: uppercase;">${headerText}</div><div style="margin-top: 10px; display: flex; flex-direction: column; gap: 12px;">`;
      
      productsList.forEach(p => {
          html += `
            <div class="pro-product-card" style="padding: 10px;">
              <img src="${productImage(p)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; background: #fff;">
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 2px;">${p.title}</div>
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
      cta.className = 'pro-product-card';
      cta.style.justifyContent = 'center';
      cta.style.background = isBought ? '#10b981' : '#ff5a00';
      cta.style.color = '#fff';
      cta.style.textDecoration = 'none';
      cta.style.fontWeight = 'bold';
      cta.style.border = 'none';
      cta.style.marginTop = '12px';
      cta.textContent = isBought ? 'DODANO! Przejdź do kasy' : 'Dodaj wszystko do koszyka';
      cta.href = '#';
      
      cta.onclick = (e) => {
          e.preventDefault();
          if (!isBought) {
              addItemsToCart(lastProposedItems);
              cta.textContent = 'DODANO! Przejdź do kasy';
              cta.style.background = '#10b981';
              lastProposedItems = [];
              const clone = cta.cloneNode(true);
              clone.onclick = (e) => { e.preventDefault(); if(window.openCartDrawer) window.openCartDrawer(); };
              cta.replaceWith(clone);
          }
          if(window.openCartDrawer) window.openCartDrawer();
      };
      
      productsContainer.appendChild(cta);
      aiBubble.appendChild(productsContainer);
      chatHistory.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
"""

if old_block in js:
    js = js.replace(old_block, new_block)
    # Inject renderProductsInBubble right before addItemsToCart
    if 'function renderProductsInBubble' not in js:
        js = js.replace('function addItemsToCart(items) {', render_helper + '\n  function addItemsToCart(items) {')
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated ai-agent.js with smart search fallback.")
else:
    print("Could not find the old block.")
