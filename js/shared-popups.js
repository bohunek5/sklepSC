import { products } from './products-data.js';

// --- CART STATE ---
let wishlist = JSON.parse(localStorage.getItem('cooken_wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cooken_cart')) || [];


// --- INJECT WISHLIST DRAWER HTML ---
function injectWishlistDrawer() {
  const drawerHTML = `
    <!-- Wishlist Drawer Markup -->
    <div id="wishlistDrawer" style="position: fixed; top: 0; right: -450px; width: 450px; height: 100vh; background: #fff; box-shadow: -10px 0 30px rgba(0,0,0,0.1); z-index: 2000; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; max-width: 100%;">
      <div style="padding: 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Twoja Lista Życzeń</h3>
        <button id="closeWishlistDrawer" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div id="wishlistDrawerItems" style="flex-grow: 1; padding: 25px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;">
        <!-- Items loaded dynamically -->
      </div>
    </div>
    <!-- Wishlist Drawer Overlay -->
    <div id="wishlistDrawerOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 1999; opacity: 0; pointer-events: none; transition: opacity 0.4s;"></div>
  `;
  if (!document.getElementById('wishlistDrawer')) {
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  }
}


// --- INJECT PRODUCT MODALS (Size Guide, Compare Color, Ask Question) ---
function injectProductModals() {
  const modalsHTML = `
    <!-- General Modal Overlay -->
    <div id="productModalsOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 2500; opacity: 0; pointer-events: none; transition: opacity 0.3s;"></div>
    
    <!-- Size Guide / Dimensions Modal -->
    <div id="modalSizeGuide" class="product-feature-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); width: 600px; max-width: 90%; background: #fff; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); z-index: 2501; opacity: 0; pointer-events: none; transition: all 0.3s;">
      <div style="padding: 20px 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; margin: 0;">Wymiary i parametry</h3>
        <button class="close-product-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div style="padding: 30px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <th style="text-align: left; padding: 10px 0; color: #666;">Typ taśmy</th>
            <td style="text-align: right; padding: 10px 0; font-weight: 500;">COB / SMD</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <th style="text-align: left; padding: 10px 0; color: #666;">Napięcie zasilania</th>
            <td style="text-align: right; padding: 10px 0; font-weight: 500;">24V DC</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <th style="text-align: left; padding: 10px 0; color: #666;">Szerokość PCB</th>
            <td style="text-align: right; padding: 10px 0; font-weight: 500;">8mm / 10mm</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <th style="text-align: left; padding: 10px 0; color: #666;">Możliwość cięcia</th>
            <td style="text-align: right; padding: 10px 0; font-weight: 500;">Co 5cm / 2.5cm</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Compare Color Modal -->
    <div id="modalCompareColor" class="product-feature-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); width: 800px; max-width: 90%; background: #fff; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); z-index: 2501; opacity: 0; pointer-events: none; transition: all 0.3s;">
      <div style="padding: 20px 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; margin: 0;">Porównaj barwę światła</h3>
        <button class="close-product-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div style="padding: 30px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;">
        <div>
          <div style="height: 150px; background: linear-gradient(to bottom, rgba(255,166,77,0.4), transparent); border-radius: 8px; border: 1px solid #eee; margin-bottom: 10px;"></div>
          <strong style="font-size: 16px;">3000K</strong>
          <p style="font-size: 12px; color: #666; margin-top: 5px;">Biała ciepła (Relaks)</p>
        </div>
        <div>
          <div style="height: 150px; background: linear-gradient(to bottom, rgba(255,235,180,0.4), transparent); border-radius: 8px; border: 1px solid #eee; margin-bottom: 10px;"></div>
          <strong style="font-size: 16px;">4000K</strong>
          <p style="font-size: 12px; color: #666; margin-top: 5px;">Biała neutralna (Praca)</p>
        </div>
        <div>
          <div style="height: 150px; background: linear-gradient(to bottom, rgba(230,245,255,0.4), transparent); border-radius: 8px; border: 1px solid #eee; margin-bottom: 10px;"></div>
          <strong style="font-size: 16px;">6000K</strong>
          <p style="font-size: 12px; color: #666; margin-top: 5px;">Biała zimna (Skupienie)</p>
        </div>
      </div>
    </div>

    <!-- Ask a Question Modal -->
    <div id="modalAskQuestion" class="product-feature-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); width: 500px; max-width: 90%; background: #fff; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); z-index: 2501; opacity: 0; pointer-events: none; transition: all 0.3s;">
      <div style="padding: 20px 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; margin: 0;">Zadaj pytanie</h3>
        <button class="close-product-modal" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div style="padding: 30px; display: flex; flex-direction: column; gap: 15px;">
        <input type="text" placeholder="Twoje imię" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <input type="email" placeholder="Twój adres e-mail" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: 'Inter', sans-serif;">
        <textarea placeholder="O co chcesz zapytać?" rows="4" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: 'Inter', sans-serif; resize: none;"></textarea>
        <button style="width: 100%; padding: 15px; background: var(--primary-color); color: #fff; border: none; border-radius: 4px; font-weight: 600; text-transform: uppercase; cursor: pointer; letter-spacing: 1px; font-size: 12px;" onclick="alert('Pytanie wysłane. Skontaktujemy się z Tobą wkrótce!'); document.querySelector('#productModalsOverlay').click();">Wyślij Pytanie</button>
      </div>
    </div>
  `;
  if (!document.getElementById('productModalsOverlay')) {
    document.body.insertAdjacentHTML('beforeend', modalsHTML);
  }
}

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
                <style>
          .cart-checkout-btn {
            width: 100%; padding: 16px; background: #1a1a1a; color: #fff; border: none; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; cursor: pointer; border-radius: 4px; transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .cart-checkout-btn:hover {
            background: #ffaa00;
            color: #000;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(255, 170, 0, 0.3);
          }
          .cart-checkout-btn:active {
            transform: scale(0.98);
            box-shadow: none;
          }
        </style>
        <button id="cartDrawerCheckout" class="cart-checkout-btn">Przejdź do kasy</button>
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
  injectWishlistDrawer();
  injectProductModals();
  injectCartDrawer();
  injectQuickViewModal();
  injectNewsletterPopup();
  injectSearchOverlay();
  injectMobileMenuOverlay();

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

  
  // --- WISHLIST DRAWER LOGIC ---
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const wishlistDrawerOverlay = document.getElementById('wishlistDrawerOverlay');
  const closeWishlistDrawer = document.getElementById('closeWishlistDrawer');
  const wishlistDrawerItems = document.getElementById('wishlistDrawerItems');

  function openWishlist() {
    renderWishlist();
    wishlistDrawer.style.right = '0px';
    wishlistDrawerOverlay.style.opacity = '1';
    wishlistDrawerOverlay.style.pointerEvents = 'all';
  }

  window.openWishlistDrawer = openWishlist;

  function closeWishlist() {
    wishlistDrawer.style.right = '-450px';
    wishlistDrawerOverlay.style.opacity = '0';
    wishlistDrawerOverlay.style.pointerEvents = 'none';
  }

  if (closeWishlistDrawer) closeWishlistDrawer.addEventListener('click', closeWishlist);
  if (wishlistDrawerOverlay) wishlistDrawerOverlay.addEventListener('click', closeWishlist);

  // Link Header Wishlist Icon to open Wishlist Drawer (Find icons with heart emoji or specific class)
  document.querySelectorAll('.mockup-action-icon, a, .wishlist-trigger').forEach(btn => {
    if (btn.classList.contains('wishlist-trigger') || btn.textContent.includes('🤍') || btn.textContent.includes('❤️') || (btn.href && btn.href.includes('wishlist'))) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openWishlist();
      });
    }
  });

  function renderWishlist() {
    wishlistDrawerItems.innerHTML = '';
    wishlist = JSON.parse(localStorage.getItem('cooken_wishlist')) || [];

    if (wishlist.length === 0) {
      wishlistDrawerItems.innerHTML = `<div style="text-align: center; color: #999; margin-top: 50px;">Twoja lista życzeń jest pusta</div>`;
      return;
    }

    wishlist.forEach((item, index) => {
      const itemHTML = `
        <div style="display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; position: relative;">
          <img src="${item.image}" style="width: 70px; height: 90px; object-fit: cover; background: #f7f7f7;">
          <div style="flex-grow: 1;">
            <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #1a1a1a;">${item.title}</h4>
            <div style="font-size: 14px; font-weight: 600; color: #ff4d4d; margin-top: 10px;">${parseFloat(item.price).toFixed(2)} zł</div>
            <button class="wishlist-move-cart" data-index="${index}" style="margin-top: 10px; background: transparent; color: var(--primary-color); border: 1px solid var(--primary-color); padding: 5px 10px; font-size: 11px; text-transform: uppercase; border-radius: 4px; cursor: pointer;">Do koszyka</button>
          </div>
          <button class="wishlist-drawer-remove" data-index="${index}" style="position: absolute; top: 0; right: 0; background: none; border: none; font-size: 18px; color: #999; cursor: pointer;">&times;</button>
        </div>
      `;
      wishlistDrawerItems.insertAdjacentHTML('beforeend', itemHTML);
    });

    document.querySelectorAll('.wishlist-drawer-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        wishlist.splice(index, 1);
        updateWishlistStorage();
        renderWishlist();
      });
    });

    document.querySelectorAll('.wishlist-move-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        const item = wishlist[index];
        
        // Add to cart
        const existingIndex = cart.findIndex(c => c.id === item.id);
        if (existingIndex > -1) {
          cart[existingIndex].qty += 1;
        } else {
          cart.push({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            qty: 1,
            color: null,
            size: null
          });
        }
        localStorage.setItem('cooken_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        
        // Remove from wishlist
        wishlist.splice(index, 1);
        updateWishlistStorage();
        
        closeWishlist();
        window.openCartDrawer();
      });
    });
  }

  function updateWishlistStorage() {
    localStorage.setItem('cooken_wishlist', JSON.stringify(wishlist));
  }

  // --- CONNECT ADD TO WISHLIST BUTTONS ON PRODUCTS ---
  document.querySelectorAll('.add-to-wishlist-btn, .mockup-product-card .action-btn-circle:first-child').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const card = e.target.closest('.mockup-product-card');
      const pId = parseInt(card ? card.dataset.id : (new URLSearchParams(window.location.search).get('id') || 1));
      const p = products.find(prod => prod.id === pId);
      
      if (!p) return;

      wishlist = JSON.parse(localStorage.getItem('cooken_wishlist')) || [];
      const existing = wishlist.find(item => item.id === p.id);
      
      if (!existing) {
        wishlist.push({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.images[0]
        });
        updateWishlistStorage();
        alert('Dodano do listy życzeń!');
      } else {
        alert('Produkt jest już na liście życzeń.');
      }
    });
  });

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

  
  // --- PRODUCT FEATURE MODALS LOGIC ---
  const modOverlay = document.getElementById('productModalsOverlay');
  const allFeatureModals = document.querySelectorAll('.product-feature-modal');
  
  function closeAllProductModals() {
    if(modOverlay) {
      modOverlay.style.opacity = '0';
      modOverlay.style.pointerEvents = 'none';
    }
    allFeatureModals.forEach(modal => {
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
    });
  }

  function openProductModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal && modOverlay) {
      modOverlay.style.opacity = '1';
      modOverlay.style.pointerEvents = 'all';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'all';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }

  if(modOverlay) modOverlay.addEventListener('click', closeAllProductModals);
  document.querySelectorAll('.close-product-modal').forEach(btn => {
    btn.addEventListener('click', closeAllProductModals);
  });

  // Bind clicks on product-icon-item
  document.querySelectorAll('.product-icon-item').forEach(item => {
    item.addEventListener('click', () => {
      const text = item.textContent.trim();
      if(text.includes('Size Guide') || text.includes('Wymiary')) {
        openProductModal('modalSizeGuide');
      } else if(text.includes('Compare Color') || text.includes('Porównaj')) {
        openProductModal('modalCompareColor');
      } else if(text.includes('Ask a Question') || text.includes('pytanie')) {
        openProductModal('modalAskQuestion');
      } else if(text.includes('Share') || text.includes('Udostępnij')) {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href
          }).catch(console.error);
        } else {
          navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link skopiowany do schowka!');
          });
        }
      }
    });
  });

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
