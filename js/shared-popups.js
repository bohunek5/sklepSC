import { products } from './products-data.js';

// --- CART STATE ---
let cart = JSON.parse(localStorage.getItem('cooken_cart')) || [];

// --- INJECT CART DRAWER HTML ---
function injectCartDrawer() {
  const drawerHTML = `
    <!-- Cart Drawer Markup -->
    <div id="cartDrawer" style="position: fixed; top: 0; right: -450px; width: 450px; height: 100vh; background: #fff; box-shadow: -10px 0 30px rgba(0,0,0,0.1); z-index: 2000; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; max-width: 100%;">
      <div style="padding: 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Twój Koszyk</h3>
        <button id="closeCartDrawer" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div id="cartDrawerItems" style="flex-grow: 1; padding: 25px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;">
        <!-- Items loaded dynamically -->
      </div>
      <div style="padding: 25px; border-top: 1px solid #eee; background: #f9f9f9;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; margin-bottom: 20px;">
          <span>Razem:</span>
          <span id="cartDrawerTotal">0,00 zł</span>
        </div>
        <button id="cartDrawerCheckout" style="width: 100%; padding: 16px; background: #1a1a1a; color: #fff; border: none; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; cursor: pointer; border-radius: 4px; transition: background 0.3s;">Przejdź do kasy</button>
      </div>
    </div>
    <!-- Cart Drawer Overlay -->
    <div id="cartDrawerOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 1999; opacity: 0; pointer-events: none; transition: opacity 0.4s;"></div>
  `;
  if (!document.getElementById('cartDrawer')) {
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  }
}

// --- INJECT QUICK VIEW POPUP HTML ---
function injectQuickViewModal() {
  const modalHTML = `
    <!-- Quick View Modal Markup -->
    <div id="quickViewModal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2010; opacity: 0; pointer-events: none; transition: opacity 0.4s; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <!-- Modal Overlay -->
      <div id="quickViewOverlay" style="position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.5); top: 0; left: 0;"></div>
      <!-- Modal Box -->
      <div id="quickViewBox" style="position: relative; width: 900px; max-width: 100%; background: #fff; border-radius: 4px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); z-index: 2; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; height: 550px; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); transform: scale(0.9);">
        <button id="closeQuickView" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; z-index: 10; color: #1a1a1a;">&times;</button>
        <div style="background: #f7f7f7; display: flex; align-items: center; justify-content: center; height: 100%;">
          <img id="qvImage" src="" alt="" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="padding: 40px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div id="qvCategory" style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #ff5a00; font-weight: 600; margin-bottom: 10px;"></div>
            <h2 id="qvTitle" style="font-family: 'Outfit', sans-serif; font-size: 26px; margin-bottom: 15px; font-weight: 700;"></h2>
            <div id="qvPrice" style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;"></div>
            <p id="qvDesc" style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 25px;"></p>
            
            <!-- Variants -->
            <div id="qvColorContainer" style="margin-bottom: 20px;">
              <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px;">Kolor</h4>
              <div id="qvColors" style="display: flex; gap: 8px;"></div>
            </div>
            
            <div id="qvSizeContainer" style="margin-bottom: 20px;">
              <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px;">Rozmiar</h4>
              <div id="qvSizes" style="display: flex; gap: 8px;"></div>
            </div>
          </div>
          
          <div style="display: flex; gap: 15px; margin-top: 20px;">
            <div style="display: flex; border: 1px solid #ddd; align-items: center; background: #fff;">
              <button id="qvQtyMinus" style="width: 40px; height: 40px; border: none; background: none; font-size: 16px; cursor: pointer;">-</button>
              <input type="text" id="qvQtyInput" value="1" readonly style="width: 40px; text-align: center; border: none; font-size: 14px; font-weight: 600; background: transparent; outline: none;">
              <button id="qvQtyPlus" style="width: 40px; height: 40px; border: none; background: none; font-size: 16px; cursor: pointer;">+</button>
            </div>
            <button id="qvAddToCart" style="flex-grow: 1; height: 42px; background: #1a1a1a; color: #fff; border: none; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; cursor: pointer; transition: background 0.3s;">Dodaj do koszyka</button>
          </div>
        </div>
      </div>
    </div>
  `;
  if (!document.getElementById('quickViewModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

// --- INJECT NEWSLETTER POPUP HTML ---
function injectNewsletterPopup() {
  const popupHTML = `
    <!-- Newsletter Exit-Intent Popup Markup -->
    <div id="newsPopup" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2020; opacity: 0; pointer-events: none; transition: opacity 0.5s; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <!-- Overlay -->
      <div id="newsOverlay" style="position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.6); top: 0; left: 0;"></div>
      <!-- Popup Box -->
      <div id="newsBox" style="position: relative; width: 800px; max-width: 100%; background: #fff; border-radius: 4px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); z-index: 2; overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; height: 480px; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); transform: scale(0.85);">
        <button id="closeNewsPopup" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; z-index: 10; color: #1a1a1a;">&times;</button>
        <div style="background: url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80') center/cover; height: 100%;"></div>
        <div style="padding: 50px 40px; display: flex; flex-direction: column; justify-content: center; text-align: center; align-items: center;">
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; line-height: 1.2; margin-bottom: 15px; color: #1a1a1a;">DOŁĄCZ DO NAS</h2>
          <p style="font-size: 14px; color: #666; margin-bottom: 30px; line-height: 1.6;">Zapisz się do newslettera i odbierz **-10%** zniżki na pierwsze zakupy mebli oraz akcesoriów kuchennych!</p>
          <div style="width: 100%; display: flex; flex-direction: column; gap: 15px;">
            <input type="email" id="newsEmailInput" placeholder="Twój adres e-mail" style="padding: 14px 15px; border: 1px solid #ddd; background: #fff; width: 100%; border-radius: 4px; font-size: 14px; text-align: center;">
            <button id="newsSubmitBtn" style="padding: 14px; background: #1a1a1a; border: none; color: #fff; font-weight: 600; cursor: pointer; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; border-radius: 4px; transition: background 0.3s;">Odbierz kod</button>
          </div>
          <span id="newsMsg" style="font-size: 12px; color: #27ae60; margin-top: 15px; display: none;">Kod rabatowy: **WELCOME10**</span>
        </div>
      </div>
    </div>
  `;
  if (!document.getElementById('newsPopup')) {
    document.body.insertAdjacentHTML('beforeend', popupHTML);
  }
}

// --- INJECT PC SEARCH OVERLAY HTML ---
function injectSearchOverlay() {
  const searchHTML = `
    <!-- Top Search Drawer Overlay -->
    <div id="searchDrawer" style="position: fixed; top: -250px; left: 0; width: 100vw; background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.1); z-index: 2050; transition: top 0.4s cubic-bezier(0.16, 1, 0.3, 1); padding: 35px 8%; display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div style="position: relative; flex-grow: 1; margin-right: 30px;">
          <input type="text" id="pcSearchInput" placeholder="Czego dzisiaj szukasz? (np. misa, fartuch, kubek...)" style="width: 100%; border: none; border-bottom: 2px solid #1a1a1a; padding: 15px 0; font-size: 20px; font-family: 'Outfit', sans-serif; outline: none; font-weight: 500; background: transparent;">
          <span style="position: absolute; right: 10px; top: 12px; font-size: 22px; color: #999;">🔍</span>
        </div>
        <button id="closeSearchDrawer" style="background: none; border: none; font-size: 32px; cursor: pointer; color: #1a1a1a; outline: none;">&times;</button>
      </div>
      <!-- Search Dynamic Suggestions -->
      <div id="pcSearchSuggestions" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; min-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
        <!-- Dynamically rendered search card items -->
      </div>
    </div>
    <!-- Search Overlay Background -->
    <div id="searchDrawerOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 2049; opacity: 0; pointer-events: none; transition: opacity 0.4s;"></div>
  `;
  if (!document.getElementById('searchDrawer')) {
    document.body.insertAdjacentHTML('beforeend', searchHTML);
  }
}

// --- INJECT MOBILE MENU OVERLAY ---
function injectMobileMenuOverlay() {
  const overlayHTML = `<div id="mobileMenuOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 2099; opacity: 0; pointer-events: none; transition: opacity 0.4s;"></div>`;
  if (!document.getElementById('mobileMenuOverlay')) {
    document.body.insertAdjacentHTML('beforeend', overlayHTML);
  }
}

// --- INIT POPUPS AND DRAWER ACTIONS ---
export function initSharedPopups() {
  injectCartDrawer();
  injectQuickViewModal();
  injectNewsletterPopup();
  injectSearchOverlay();
  injectMobileMenuOverlay();
  updateGlobalCartBadge();
  initPremiumButtons();
  setInterval(initPremiumButtons, 500);

  // Programmatically replace search icon emoji with Lucide search icon
  const headerSearchBtn = document.getElementById('headerSearchBtn');
  if (headerSearchBtn && headerSearchBtn.textContent.trim() === '🔍') {
    headerSearchBtn.innerHTML = '<i data-lucide="search" style="width: 16px; height: 16px; display: block; margin: auto;"></i>';
  }

  // Load Lucide script dynamically if not present to render icons
  if (!window.lucide) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest';
    script.onload = () => {
      if (window.lucide) {
        window.lucide.createIcons();
      }
    };
    document.head.appendChild(script);
  } else {
    window.lucide.createIcons();
  }

  window.addEventListener('storage', () => {
    updateGlobalCartBadge();
  });

  // Inject Global Style overrides (Shadows, Mobile sliding drawer, etc.)
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Premium soft shadows under product cards and category blocks */
    .mockup-product-card {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border-radius: 4px;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      border: 1px solid rgba(0,0,0,0.015);
      background: #fff;
    }
    .mockup-product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08) !important;
    }
    .category-card {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border-radius: 4px;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .category-card:hover {
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08) !important;
    }
    .mockup-header.scrolled {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
    }
    
    /* Sliding Mobile Menu Drawer */
    .mobile-menu {
      position: fixed !important;
      top: 0 !important;
      left: -340px !important;
      width: 340px !important;
      height: 100vh !important;
      background: #fff !important;
      z-index: 2100 !important;
      box-shadow: 10px 0 30px rgba(0,0,0,0.08) !important;
      transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      display: flex !important;
      flex-direction: column !important;
      padding: 30px 25px !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .mobile-menu.active {
      left: 0 !important;
    }
    .mobile-menu ul {
      list-style: none !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 20px !important;
      margin-top: 20px !important;
    }
    .mobile-menu a {
      font-family: 'Outfit', sans-serif !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      color: #1a1a1a !important;
      text-decoration: none !important;
      transition: color 0.3s !important;
    }
    .mobile-menu a:hover, .mobile-menu a.active {
      color: #ff5a00 !important;
    }

    /* Auto-suggest search card styling */
    .suggest-card {
      display: flex;
      gap: 12px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      text-decoration: none;
      color: inherit;
      background: #fff;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }
    .suggest-card:hover {
      border-color: #ff5a00;
      box-shadow: 0 8px 25px rgba(0,0,0,0.05);
      transform: translateY(-2px);
    }

    /* Premium Hover Buttons */
    .mockup-btn, .add-to-cart-btn, .buy-it-now-btn, .checkout-btn {
      position: relative !important;
      overflow: hidden !important;
      background-color: var(--primary-color) !important; /* Navy Blue #0b1a30 */
      color: #fff !important;
      border: 2px solid var(--primary-color) !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      cursor: pointer !important;
      transition: background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      text-decoration: none !important;
    }
    
    .mockup-btn:hover, .add-to-cart-btn:hover, .buy-it-now-btn:hover, .checkout-btn:hover {
      background-color: #ffffff !important; /* white background */
      border-color: var(--primary-color) !important; /* navy blue border */
      color: var(--primary-color) !important; /* navy blue text */
    }
    
    .btn-text-wrapper {
      display: inline-block !important;
      position: relative !important;
      height: 1.4em !important;
      line-height: 1.4em !important;
      overflow: hidden !important;
      vertical-align: middle !important;
    }
    
    .btn-text-original, .btn-text-hover {
      display: block !important;
      transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1), color 0.4s cubic-bezier(0.76, 0, 0.24, 1) !important;
      line-height: 1.4em !important;
    }
    
    .btn-text-hover {
      position: absolute !important;
      top: -100% !important;
      left: 0 !important;
      width: 100% !important;
    }
    
    .mockup-btn:hover .btn-text-original,
    .add-to-cart-btn:hover .btn-text-original,
    .buy-it-now-btn:hover .btn-text-original,
    .checkout-btn:hover .btn-text-original {
      transform: translateY(100%) !important;
      color: var(--primary-color) !important;
    }
    
    .mockup-btn:hover .btn-text-hover,
    .add-to-cart-btn:hover .btn-text-hover,
    .buy-it-now-btn:hover .btn-text-hover,
    .checkout-btn:hover .btn-text-hover {
      transform: translateY(100%) !important;
      color: var(--primary-color) !important;
    }

    /* Cart Badge - White circle, black text/border */
    .cart-badge {
      background: #ffffff !important;
      color: #000000 !important;
      border: 1.5px solid #000000 !important;
      font-weight: 800 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
    }
  `;
  document.head.appendChild(styleEl);

  // Cart Drawer Dom Elements
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const closeCartDrawer = document.getElementById('closeCartDrawer');
  const cartDrawerItems = document.getElementById('cartDrawerItems');
  const cartDrawerTotal = document.getElementById('cartDrawerTotal');
  const cartDrawerCheckout = document.getElementById('cartDrawerCheckout');

  // Quick View Dom Elements
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewBox = document.getElementById('quickViewBox');
  const closeQuickView = document.getElementById('closeQuickView');
  const quickViewOverlay = document.getElementById('quickViewOverlay');

  // Newsletter Dom Elements
  const newsPopup = document.getElementById('newsPopup');
  const newsBox = document.getElementById('newsBox');
  const closeNewsPopup = document.getElementById('closeNewsPopup');
  const newsOverlay = document.getElementById('newsOverlay');
  const newsSubmitBtn = document.getElementById('newsSubmitBtn');

  // Search Drawer Dom Elements
  const searchDrawer = document.getElementById('searchDrawer');
  const searchDrawerOverlay = document.getElementById('searchDrawerOverlay');
  const closeSearchDrawer = document.getElementById('closeSearchDrawer');
  const pcSearchInput = document.getElementById('pcSearchInput');
  const pcSearchSuggestions = document.getElementById('pcSearchSuggestions');

  // Mobile Menu Drawer Elements
  const mobMenu = document.getElementById('mobileMenu');
  const mobOverlay = document.getElementById('mobileMenuOverlay');

  // --- CART DRAWER LOGIC ---
  function openCart() {
    renderCart();
    cartDrawer.style.right = '0px';
    cartDrawerOverlay.style.opacity = '1';
    cartDrawerOverlay.style.pointerEvents = 'all';
  }

  window.openCartDrawer = openCart;

  function closeCart() {
    cartDrawer.style.right = '-450px';
    cartDrawerOverlay.style.opacity = '0';
    cartDrawerOverlay.style.pointerEvents = 'none';
  }

  if (closeCartDrawer) closeCartDrawer.addEventListener('click', closeCart);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCart);

  // Link Header Cart Icon to open Cart Drawer
  document.querySelectorAll('a[href="/cart.html"], .mockup-actions a, button.mockup-action-icon:last-child').forEach(btn => {
    // Check if the icon contains cart icon or links to cart.html
    if (btn.href && btn.href.includes('cart.html') || btn.textContent.includes('🛒')) {
      btn.addEventListener('click', (e) => {
        if (!window.location.pathname.includes('cart.html') && !window.location.pathname.includes('checkout.html')) {
          e.preventDefault();
          openCart();
        }
      });
    }
  });

  function renderCart() {
    cartDrawerItems.innerHTML = '';
    let total = 0;
    cart = JSON.parse(localStorage.getItem('cooken_cart')) || [];

    if (cart.length === 0) {
      cartDrawerItems.innerHTML = `<div style="text-align: center; color: #999; margin-top: 50px;">Twój koszyk jest pusty</div>`;
      cartDrawerTotal.textContent = '0,00 zł';
      return;
    }

    cart.forEach((item, index) => {
      const pTotal = item.price * item.qty;
      total += pTotal;

      const itemHTML = `
        <div style="display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; position: relative;">
          <img src="${item.image}" style="width: 70px; height: 90px; object-fit: cover; background: #f7f7f7;">
          <div style="flex-grow: 1;">
            <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #1a1a1a;">${item.title}</h4>
            <p style="font-size: 12px; color: #777; margin-bottom: 8px;">Kolor: ${item.color ? `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${item.color}; vertical-align:middle; margin-left:3px;"></span>` : 'Domyślny'} / Rozmiar: ${item.size || 'Domyślny'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; border: 1px solid #ddd; align-items: center;">
                <button class="cart-drawer-qty-btn" data-index="${index}" data-action="minus" style="width: 25px; height: 25px; border: none; background: none; font-size: 14px; cursor: pointer;">-</button>
                <span style="padding: 0 10px; font-size: 13px; font-weight: 600;">${item.qty}</span>
                <button class="cart-drawer-qty-btn" data-index="${index}" data-action="plus" style="width: 25px; height: 25px; border: none; background: none; font-size: 14px; cursor: pointer;">+</button>
              </div>
              <span style="font-size: 14px; font-weight: 600; color: #1a1a1a;">${pTotal.toFixed(2)} zł</span>
            </div>
          </div>
          <button class="cart-drawer-remove" data-index="${index}" style="position: absolute; top: 0; right: 0; background: none; border: none; font-size: 18px; color: #999; cursor: pointer;">&times;</button>
        </div>
      `;
      cartDrawerItems.insertAdjacentHTML('beforeend', itemHTML);
    });

    cartDrawerTotal.textContent = `${total.toFixed(2)} zł`;

    // Add listeners to new items buttons
    document.querySelectorAll('.cart-drawer-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        const action = e.currentTarget.dataset.action;
        if (action === 'plus') {
          cart[index].qty++;
        } else {
          cart[index].qty--;
          if (cart[index].qty <= 0) {
            cart.splice(index, 1);
          }
        }
        updateLocalStorage();
        renderCart();
        window.dispatchEvent(new Event('storage'));
      });
    });

    document.querySelectorAll('.cart-drawer-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        cart.splice(index, 1);
        updateLocalStorage();
        renderCart();
        window.dispatchEvent(new Event('storage'));
      });
    });
  }

  function updateLocalStorage() {
    localStorage.setItem('cooken_cart', JSON.stringify(cart));
    updateGlobalCartBadge();
  }

  if (cartDrawerCheckout) {
    cartDrawerCheckout.addEventListener('click', () => {
      closeCart();
      window.location.href = '/checkout.html';
    });
  }

  // --- QUICK VIEW MODAL LOGIC ---
  let selectedProduct = null;
  let selectedColor = null;
  let selectedSize = null;
  let qvQty = 1;

  function openQuickView(id) {
    selectedProduct = products.find(p => p.id === id);
    if (!selectedProduct) return;

    document.getElementById('qvImage').src = selectedProduct.images[0];
    document.getElementById('qvCategory').textContent = selectedProduct.category;
    document.getElementById('qvTitle').textContent = selectedProduct.title;
    document.getElementById('qvPrice').textContent = `${selectedProduct.price.toFixed(2)} zł`;
    document.getElementById('qvDesc').textContent = selectedProduct.description;

    const colorsDiv = document.getElementById('qvColors');
    colorsDiv.innerHTML = '';
    if (selectedProduct.colors && selectedProduct.colors.length > 0) {
      document.getElementById('qvColorContainer').style.display = 'block';
      selectedProduct.colors.forEach((color, i) => {
        const activeClass = i === 0 ? 'active' : '';
        if (i === 0) selectedColor = color;
        const colorHTML = `<div class="color-swatch-dot ${activeClass}" style="background: ${color}; width: 25px; height: 25px; cursor: pointer; border-radius: 50%; border: 1px solid #ddd;" data-color="${color}"></div>`;
        colorsDiv.insertAdjacentHTML('beforeend', colorHTML);
      });
      colorsDiv.querySelectorAll('.color-swatch-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          colorsDiv.querySelectorAll('.color-swatch-dot').forEach(d => d.classList.remove('active'));
          e.target.classList.add('active');
          selectedColor = e.target.dataset.color;
        });
      });
    } else {
      document.getElementById('qvColorContainer').style.display = 'none';
      selectedColor = null;
    }

    const sizesDiv = document.getElementById('qvSizes');
    sizesDiv.innerHTML = '';
    if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
      document.getElementById('qvSizeContainer').style.display = 'block';
      selectedProduct.sizes.forEach((size, i) => {
        const activeClass = i === 0 ? 'active' : '';
        if (i === 0) selectedSize = size;
        const sizeHTML = `<div class="size-swatch ${activeClass}" data-size="${size}" style="padding: 6px 12px; border: 1px solid #ddd; font-size: 12px; cursor: pointer;">${size}</div>`;
        sizesDiv.insertAdjacentHTML('beforeend', sizeHTML);
      });
      sizesDiv.querySelectorAll('.size-swatch').forEach(sw => {
        sw.addEventListener('click', (e) => {
          sizesDiv.querySelectorAll('.size-swatch').forEach(s => s.classList.remove('active'));
          e.target.classList.add('active');
          selectedSize = e.target.dataset.size;
        });
      });
    } else {
      document.getElementById('qvSizeContainer').style.display = 'none';
      selectedSize = null;
    }

    qvQty = 1;
    document.getElementById('qvQtyInput').value = qvQty;

    quickViewModal.style.opacity = '1';
    quickViewModal.style.pointerEvents = 'all';
    quickViewBox.style.transform = 'scale(1)';
  }

  function closeQuickViewModal() {
    quickViewModal.style.opacity = '0';
    quickViewModal.style.pointerEvents = 'none';
    quickViewBox.style.transform = 'scale(0.9)';
  }

  if (closeQuickView) closeQuickView.addEventListener('click', closeQuickViewModal);
  if (quickViewOverlay) quickViewOverlay.addEventListener('click', closeQuickViewModal);

  const qvMinus = document.getElementById('qvQtyMinus');
  const qvPlus = document.getElementById('qvQtyPlus');
  const qvAddToCart = document.getElementById('qvAddToCart');

  if (qvMinus) {
    qvMinus.addEventListener('click', () => {
      if (qvQty > 1) {
        qvQty--;
        document.getElementById('qvQtyInput').value = qvQty;
      }
    });
  }

  if (qvPlus) {
    qvPlus.addEventListener('click', () => {
      qvQty++;
      document.getElementById('qvQtyInput').value = qvQty;
    });
  }

  if (qvAddToCart) {
    qvAddToCart.addEventListener('click', () => {
      const cartItem = {
        id: selectedProduct.id,
        title: selectedProduct.title,
        price: selectedProduct.price,
        image: selectedProduct.images[0],
        qty: qvQty,
        color: selectedColor,
        size: selectedSize
      };

      const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size);
      if (existingIndex > -1) {
        cart[existingIndex].qty += qvQty;
      } else {
        cart.push(cartItem);
      }

      updateLocalStorage();
      closeQuickViewModal();
      openCart();
      window.dispatchEvent(new Event('storage'));
    });
  }

  // --- CONNECT INTERACTIVE BUTTONS WITH REAL IDs ---
  document.querySelectorAll('.qv-eye-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pId = parseInt(btn.dataset.id);
      openQuickView(pId);
    });
  });

  document.querySelectorAll('.qv-add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pId = parseInt(btn.dataset.id);
      const p = products.find(prod => prod.id === pId);
      if (!p) return;

      const cartItem = {
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.images[0],
        qty: 1,
        color: p.colors[0] || null,
        size: p.sizes[0] || null
      };

      const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size);
      if (existingIndex > -1) {
        cart[existingIndex].qty++;
      } else {
        cart.push(cartItem);
      }

      updateLocalStorage();
      openCart();
      window.dispatchEvent(new Event('storage'));
    });
  });

  document.querySelectorAll('.mockup-product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.action-btn-circle') || e.target.closest('a')) return;
      const pId = card.dataset.id;
      if (pId) {
        window.location.href = `/product.html?id=${pId}`;
      }
    });
  });

  // --- PC SEARCH OVERLAY LOGIC ---
  function openSearch() {
    searchDrawer.style.top = '0px';
    searchDrawerOverlay.style.opacity = '1';
    searchDrawerOverlay.style.pointerEvents = 'all';
    setTimeout(() => pcSearchInput.focus(), 150);
  }

  function closeSearch() {
    searchDrawer.style.top = '-250px';
    searchDrawerOverlay.style.opacity = '0';
    searchDrawerOverlay.style.pointerEvents = 'none';
    pcSearchInput.value = '';
    pcSearchSuggestions.innerHTML = '';
  }

  // Bind Search togglers (🔍)
  document.querySelectorAll('.mockup-action-icon').forEach(btn => {
    if (btn.textContent.includes('🔍')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    }
  });

  if (closeSearchDrawer) closeSearchDrawer.addEventListener('click', closeSearch);
  if (searchDrawerOverlay) searchDrawerOverlay.addEventListener('click', closeSearch);

  // Search autocomplete matching
  if (pcSearchInput) {
    pcSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        pcSearchSuggestions.innerHTML = '';
        return;
      }

      // Filter up to 4 matches
      const filtered = products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 4);
      
      if (filtered.length === 0) {
        pcSearchSuggestions.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px 0; font-size: 14px;">Brak pasujących produktów.</div>`;
        return;
      }

      pcSearchSuggestions.innerHTML = filtered.map(p => `
        <a href="/product.html?id=${p.id}" class="suggest-card">
          <img src="${p.images[0]}" style="width: 50px; height: 65px; object-fit: cover; border-radius: 2px; background: #f7f7f7;">
          <div style="flex-grow: 1; min-width: 0; text-align: left;">
            <div style="font-size: 9px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 2px;">${p.category}</div>
            <h4 style="font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1a1a1a; margin-bottom: 4px; font-family: 'Inter', sans-serif;">${p.title}</h4>
            <div style="font-size: 12px; font-weight: 700; color: #ff4d4d;">${p.price.toFixed(2)} zł</div>
          </div>
        </a>
      `).join('');
    });
  }

  // --- MOBILE MENU DRAWER LOGIC ---
  if (mobMenu) {
    // Inject close button dynamically
    if (!mobMenu.querySelector('.close-mobile-menu')) {
      mobMenu.insertAdjacentHTML('afterbegin', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid #eee; padding-bottom:15px; width:100%;">
          <img src="/images/logo.png" style="height:22px;">
          <button class="close-mobile-menu" style="background:none; border:none; font-size:24px; cursor:pointer; color:#1a1a1a; outline:none;">&times;</button>
        </div>
      `);
      
      mobMenu.querySelector('.close-mobile-menu').addEventListener('click', () => {
        mobMenu.classList.remove('active');
        if (mobOverlay) {
          mobOverlay.style.opacity = '0';
          mobOverlay.style.pointerEvents = 'none';
        }
      });
    }
  }

  // Bind Hamburger menu toggles
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mobMenu) mobMenu.classList.add('active');
      if (mobOverlay) {
        mobOverlay.style.opacity = '1';
        mobOverlay.style.pointerEvents = 'all';
      }
    });
  }

  if (mobOverlay) {
    mobOverlay.addEventListener('click', () => {
      if (mobMenu) mobMenu.classList.remove('active');
      mobOverlay.style.opacity = '0';
      mobOverlay.style.pointerEvents = 'none';
    });
  }

  // --- NEWSLETTER POPUP LOGIC ---
  function openNews() {
    if (localStorage.getItem('cooken_news_subscribed') === 'true') return;
    newsPopup.style.opacity = '1';
    newsPopup.style.pointerEvents = 'all';
    newsBox.style.transform = 'scale(1)';
  }

  function closeNews() {
    newsPopup.style.opacity = '0';
    newsPopup.style.pointerEvents = 'none';
    newsBox.style.transform = 'scale(0.85)';
  }

  if (closeNewsPopup) closeNewsPopup.addEventListener('click', closeNews);
  if (newsOverlay) newsOverlay.addEventListener('click', closeNews);

  // Auto newsletter popup disabled per user request
  /*
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '/cooken-offline/' || window.location.pathname === '/cooken-offline/index.html') {
    setTimeout(openNews, 5000);
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 20) {
        openNews();
      }
    });
  }
  */

  if (newsSubmitBtn) {
    newsSubmitBtn.addEventListener('click', () => {
      const email = document.getElementById('newsEmailInput').value;
      if (email && email.includes('@')) {
        localStorage.setItem('cooken_news_subscribed', 'true');
        document.getElementById('newsMsg').style.display = 'block';
        setTimeout(closeNews, 3000);
      } else {
        alert('Wpisz poprawny e-mail!');
      }
    });
  }

  // --- GLOBAL CART ADD SYNC (for product detail page) ---
  const mainAddToCart = document.getElementById('addToCart');
  if (mainAddToCart) {
    mainAddToCart.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const urlParams = new URLSearchParams(window.location.search);
      const pId = parseInt(urlParams.get('id')) || 1;
      const product = products.find(p => p.id === pId);
      if (!product) return;

      const qty = parseInt(document.getElementById('qtyInput').value) || 1;
      const activeColorDot = document.querySelector('.color-swatch-dot.active');
      const color = activeColorDot ? activeColorDot.style.backgroundColor : null;

      const activeSizeSwatch = document.querySelector('.size-swatch.active');
      const size = activeSizeSwatch ? activeSizeSwatch.textContent : null;

      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        qty: qty,
        color: color,
        size: size
      };

      const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size);
      if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
      } else {
        cart.push(cartItem);
      }

      updateLocalStorage();
      openCart();
      window.dispatchEvent(new Event('storage'));
    });
  }

  // --- BUY IT NOW EXPRESS CHECKOUT SYNC ---
  const mainBuyItNow = document.getElementById('buyItNow');
  if (mainBuyItNow) {
    mainBuyItNow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const urlParams = new URLSearchParams(window.location.search);
      const pId = parseInt(urlParams.get('id')) || 1;
      const product = products.find(p => p.id === pId);
      if (!product) return;

      const qty = parseInt(document.getElementById('qtyInput').value) || 1;
      const activeColorDot = document.querySelector('.color-swatch-dot.active');
      const color = activeColorDot ? activeColorDot.style.backgroundColor : null;

      const activeSizeSwatch = document.querySelector('.size-swatch.active');
      const size = activeSizeSwatch ? activeSizeSwatch.textContent : null;

      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        qty: qty,
        color: color,
        size: size
      };

      const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size);
      if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
      } else {
        cart.push(cartItem);
      }

      updateLocalStorage();
      window.dispatchEvent(new Event('storage'));
      window.location.href = '/checkout.html';
    });
  }
}

export function updateGlobalCartBadge() {
  const cartLinks = document.querySelectorAll('a[href="/cart.html"]');
  if (cartLinks.length === 0) return;
  
  const storedCart = JSON.parse(localStorage.getItem('cooken_cart')) || [];
  const totalQty = storedCart.reduce((sum, item) => sum + (item.qty || 1), 0);
  
  cartLinks.forEach(link => {
    let badge = link.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.cssText = `
        position: absolute;
        top: -6px;
        right: -6px;
        background: var(--accent-color, #ff5a00);
        color: #000;
        font-size: 10px;
        font-weight: 800;
        min-width: 18px;
        height: 18px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #fff;
        padding: 0 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        font-family: 'Outfit', sans-serif;
      `;
      link.style.position = 'relative';
      link.appendChild(badge);
    }
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? 'flex' : 'none';
  });
}

export function initPremiumButtons() {
  const buttons = document.querySelectorAll('.mockup-btn, .add-to-cart-btn, .buy-it-now-btn, .checkout-btn');
  buttons.forEach(btn => {
    // Avoid double wrapping and only wrap if there's actual text
    if (btn.querySelector('.btn-text-wrapper') || btn.classList.contains('premium-hover-init')) return;
    
    // Extract inline elements like SVGs
    const svgIcon = btn.querySelector('svg');
    let text = '';
    
    // Gather and remove text nodes
    btn.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
        node.textContent = ''; // clear text node
      }
    });
    
    text = text.trim();
    if (!text) {
      // Fallback
      text = btn.textContent.trim();
      if (!text) return;
      btn.innerHTML = '';
    }
    
    const wrapper = document.createElement('span');
    wrapper.className = 'btn-text-wrapper';
    
    const original = document.createElement('span');
    original.className = 'btn-text-original';
    original.textContent = text;
    
    const hoverSpan = document.createElement('span');
    hoverSpan.className = 'btn-text-hover';
    hoverSpan.textContent = text;
    
    wrapper.appendChild(original);
    wrapper.appendChild(hoverSpan);
    
    if (svgIcon) {
      btn.appendChild(svgIcon);
    }
    btn.appendChild(wrapper);
    btn.classList.add('premium-hover-init');
  });
}

