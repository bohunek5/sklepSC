

// --- CART STATE ---
let wishlist = JSON.parse(localStorage.getItem('prescot_wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('prescot_cart')) || [];

// --- TOAST NOTIFICATION ENGINE ---
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: rgba(255, 255, 255, 0.45) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    color: var(--primary-color) !important;
    padding: 12px 20px;
    border-radius: 99px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.06) !important;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    pointer-events: auto;
    cursor: pointer;
    transform: translateX(120%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
    position: relative;
    overflow: hidden;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  `;

  let icon = '<i class="ph ph-check-circle" style="color: #2e7d32; font-size: 20px;"></i>';
  let isCart = type === 'cart';
  if (isCart) {
    icon = '';
  } else if (type === 'wishlist') {
    icon = '<i class="ph ph-heart" style="color: #c62828; font-size: 20px;"></i>';
  } else if (type === 'info') {
    icon = '<i class="ph ph-info" style="color: #00838f; font-size: 20px;"></i>';
  }

  let messageContent = message;
  if (isCart) {
    messageContent = `${message} <i class="ph ph-shopping-cart" style="font-size: 16px; margin-left: 8px; vertical-align: middle;"></i>`;
  }

  toast.innerHTML = `
    ${icon}
    <div style="flex-grow: 1; display: flex; align-items: center;">
      <div style="font-size: 13px; font-weight: 600; line-height: 1; color: var(--primary-color);">${messageContent}</div>
    </div>
    <button style="background: none; border: none; color: var(--primary-color); font-size: 18px; cursor: pointer; padding: 0; outline: none; margin-left: 10px; opacity: 0.6;">&times;</button>
    <div style="position: absolute; bottom: 0; left: 0; height: 3px; background: var(--primary-color); width: 100%; transition: width 3s linear;"></div>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  // Shrink progress bar
  setTimeout(() => {
    const progressBar = toast.querySelector('div:last-child');
    if (progressBar) progressBar.style.width = '0%';
  }, 50);

  // Close actions
  const closeBtn = toast.querySelector('button');
  const closeToast = () => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 400);
  };

  closeBtn.onclick = (e) => {
    e.stopPropagation();
    closeToast();
  };

  toast.onclick = () => {
    closeToast();
    if (type === 'cart') {
      window.openCartDrawer();
    }
  };

  // Auto remove
  setTimeout(closeToast, 3000);
}
window.showToast = showToast;

function updateCartBadge() {
  const currentCart = JSON.parse(localStorage.getItem('prescot_cart')) || [];
  const totalItems = currentCart.reduce((sum, item) => sum + (item.qty || 1), 0);
  
  // Find all cart buttons/links EXCEPT the ones in checkout breadcrumbs
  const cartBtns = document.querySelectorAll('a[href*="cart.html"]:not(.checkout-breadcrumbs a), .mockup-actions a[aria-label="Koszyk"], .cart-toggle');
  
  cartBtns.forEach(btn => {
    btn.style.position = 'relative'; // ensure badge anchors correctly
    let badge = btn.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      btn.appendChild(badge);
    }
    
    if (totalItems > 0) {
      badge.textContent = totalItems > 99 ? '99+' : totalItems;
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  });
}

function triggerCartIconAnimation() {
  const cartBtns = document.querySelectorAll('a[href*="cart.html"], .mockup-actions a, button.mockup-action-icon');
  cartBtns.forEach(btn => {
    const target = btn.querySelector('svg, i') || btn;
    target.classList.add('cart-bounce');
    setTimeout(() => target.classList.remove('cart-bounce'), 600);
  });
  updateCartBadge();
}

// Initial badge update
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateCartBadge, 100);
});

// Update badge on storage changes from other tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'prescot_cart') {
    updateCartBadge();
  }
});


// Append custom styles
const customStyles = document.createElement('style');
customStyles.innerHTML = `
  .qv-fullscreen-active {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2060 !important;
    background: #0b1a30 !important;
  }
  .qv-fullscreen-active #qvImage,
  .qv-fullscreen-active #qv360Img {
    padding: 40px !important;
  }
  #qvFullscreenBtn:hover {
    background: rgba(0,0,0,0.85) !important;
    transform: scale(1.1);
  }
  @keyframes cartBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3) rotate(-10deg); }
  }
  .cart-bounce {
    animation: cartBounce 0.6s ease !important;
    display: inline-block !important;
  }
  .cart-badge {
    position: absolute;
    top: -5px;
    right: -8px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: var(--accent-color, #ff5a00);
    font-size: 11px;
    font-weight: 800;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.4);
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;
  }
  .cart-badge.visible {
    opacity: 1;
    transform: scale(1);
  }
`;
document.head.appendChild(customStyles);



// --- INJECT WISHLIST DRAWER HTML ---
function injectWishlistDrawer() {
  const drawerHTML = `
    <!-- Wishlist Drawer Markup -->
    <div id="wishlistDrawer" style="position: fixed; top: 0; right: -450px; width: 450px; height: 100vh; background: #fff; box-shadow: -10px 0 30px rgba(0,0,0,0.1); z-index: 100001; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; max-width: 100%;">
      <div style="padding: 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Twoja Lista Życzeń</h3>
        <button id="closeWishlistDrawer" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      <div id="wishlistDrawerItems" style="flex-grow: 1; padding: 25px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;">
        <!-- Items loaded dynamically -->
      </div>
    </div>
    <!-- Wishlist Drawer Overlay -->
    <div id="wishlistDrawerOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 100000; opacity: 0; pointer-events: none; transition: opacity 0.4s;"></div>
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
    <div id="cartDrawer" style="position: fixed; top: 0; right: -450px; width: 450px; height: 100vh; background: #fff; box-shadow: -10px 0 30px rgba(0,0,0,0.1); z-index: 100001; transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; max-width: 100%; font-family: 'Outfit', sans-serif;">
      
      <!-- Drawer Header -->
      <div style="padding: 25px 25px 15px 25px; display: flex; flex-direction: column; border-bottom: 1px solid #eee;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0; font-family: 'Outfit', sans-serif;">Twój Koszyk</h3>
          <button id="closeCartDrawer" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #333; line-height: 1; padding: 0;">&times;</button>
        </div>
        
        <!-- Free Shipping Banner & Progress Bar -->
        <div id="freeShippingBanner" style="font-size: 13px; color: #555;">
          Kup za jeszcze <strong>300,00 zł</strong>, aby otrzymać <strong>DARMOWĄ DOSTAWĘ</strong>
        </div>
        <div style="position: relative; width: 100%; height: 6px; background: #eee; border-radius: 99px; margin-top: 12px; margin-bottom: 10px;">
          <div id="freeShippingProgress" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: #1a1a1a; border-radius: 99px; transition: width 0.4s ease;"></div>
          <div id="freeShippingStar" style="position: absolute; top: -7px; left: 0%; width: 20px; height: 20px; border-radius: 50%; background: #1a1a1a; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; transform: translateX(-10px); transition: left 0.4s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
        </div>
      </div>
      
      <!-- Cart Drawer Items -->
      <div id="cartDrawerItems" style="flex-grow: 1; padding: 20px 25px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;">
        <!-- Items loaded dynamically -->
      </div>
      
      <!-- Recommendations Section -->
      <div id="cartRecommendations" style="padding: 20px 25px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; background: #fafafa;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-size: 13px; font-weight: 700; color: #1a1a1a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Może Ci się spodobać</h4>
          <div style="display: flex; gap: 8px;">
            <button id="prevRecBtn" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #ddd; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;"><i class="ph ph-caret-left" style="font-size: 12px; font-weight: bold;"></i></button>
            <button id="nextRecBtn" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #ddd; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;"><i class="ph ph-caret-right" style="font-size: 12px; font-weight: bold;"></i></button>
          </div>
        </div>
        <div id="recItemsList" style="min-height: 50px;">
          <!-- Loaded dynamically -->
        </div>
      </div>
      
      <!-- Order Note -->
      <div style="padding: 15px 25px; border-bottom: 1px solid #eee;">
        <div id="toggleNoteBtn" style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; cursor: pointer; user-select: none;">
          <i class="ph ph-note-pencil" style="font-size: 16px;"></i>
          <span>Dodaj uwagi do zamówienia</span>
        </div>
        <textarea id="orderNoteInput" placeholder="Wpisz swoje uwagi..." style="width: 100%; height: 60px; margin-top: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 12px; resize: none; display: none; font-family: inherit; box-sizing: border-box;"></textarea>
      </div>
      
      <!-- Drawer Footer -->
      <div style="padding: 25px; border-top: 1px solid #eee; background: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <span style="font-size: 16px; font-weight: 700; color: #1a1a1a;">Razem:</span>
          <span id="cartDrawerTotal" style="font-size: 20px; font-weight: 700; color: #1a1a1a;">0,00 zł</span>
        </div>
        <p style="font-size: 11px; color: #777; margin: 0 0 20px 0;">Podatki i koszt dostawy obliczane przy kasie</p>
        
        <div style="display: flex; gap: 12px; flex-direction: row;">
          <style>
            .cart-checkout-btn-new {
              flex: 1; padding: 14px; background: #000; color: #fff; border: 1px solid #000; font-weight: 700; text-transform: uppercase; font-size: 13px; cursor: pointer; border-radius: 4px; transition: all 0.3s ease; letter-spacing: 1px;
              overflow: hidden; position: relative; display: block; box-sizing: border-box; text-align: center;
            }
            .cart-checkout-btn-new:hover {
              background: transparent !important;
              border-color: var(--primary-color, #ffd700) !important;
              color: var(--primary-color, #ffd700) !important;
            }
            .cart-viewcart-btn-new {
              flex: 1; padding: 14px; background: #fff; color: #000; border: 1px solid #000; font-weight: 700; text-transform: uppercase; font-size: 13px; cursor: pointer; border-radius: 4px; transition: all 0.3s ease; letter-spacing: 1px;
              overflow: hidden; position: relative; display: block; box-sizing: border-box; text-align: center;
            }
            .cart-viewcart-btn-new:hover {
              background: #000 !important;
              color: #fff !important;
              border-color: #000 !important;
            }
            
            /* Sliding text animation styles */
            .cart-checkout-btn-new .btn-slide-wrap,
            .cart-viewcart-btn-new .btn-slide-wrap {
              display: block;
              height: 18px;
              line-height: 18px;
              overflow: hidden;
              position: relative;
              width: 100%;
            }
            .cart-checkout-btn-new .btn-slide-wrap .btn-txt-default,
            .cart-checkout-btn-new .btn-slide-wrap .btn-txt-hover,
            .cart-viewcart-btn-new .btn-slide-wrap .btn-txt-default,
            .cart-viewcart-btn-new .btn-slide-wrap .btn-txt-hover {
              display: block;
              height: 100%;
              width: 100%;
              transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .cart-checkout-btn-new .btn-slide-wrap .btn-txt-default,
            .cart-viewcart-btn-new .btn-slide-wrap .btn-txt-default {
              transform: translateY(0);
            }
            .cart-checkout-btn-new .btn-slide-wrap .btn-txt-hover,
            .cart-viewcart-btn-new .btn-slide-wrap .btn-txt-hover {
              position: absolute;
              left: 0;
              top: 0;
              transform: translateY(100%);
            }
            .cart-checkout-btn-new:hover .btn-slide-wrap .btn-txt-default,
            .cart-viewcart-btn-new:hover .btn-slide-wrap .btn-txt-default {
              transform: translateY(-100%);
            }
            .cart-checkout-btn-new:hover .btn-slide-wrap .btn-txt-hover,
            .cart-viewcart-btn-new:hover .btn-slide-wrap .btn-txt-hover {
              transform: translateY(0);
            }

            @media (max-width: 480px) {
              .cart-checkout-btn-new, .cart-viewcart-btn-new {
                padding: 12px 6px !important;
                font-size: 11px !important;
                letter-spacing: 0px !important;
              }
              .cart-checkout-btn-new .btn-slide-wrap,
              .cart-viewcart-btn-new .btn-slide-wrap {
                height: 16px;
                line-height: 16px;
              }
            }
          </style>
          <button id="cartDrawerCheckout" class="cart-checkout-btn-new">
            <div class="btn-slide-wrap">
              <span class="btn-txt-default">Przejdź do kasy</span>
              <span class="btn-txt-hover">Płatność i dostawa</span>
            </div>
          </button>
          <button id="cartDrawerGoToCart" class="cart-viewcart-btn-new">
            <div class="btn-slide-wrap">
              <span class="btn-txt-default">Powrót</span>
              <span class="btn-txt-hover">Zamknij</span>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Cart Drawer Overlay -->
    <div id="cartDrawerOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); z-index: 100000; opacity: 0; pointer-events: none; transition: opacity 0.4s;"></div>
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
      <style>
        .qv-variants-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }
        .qv-variant-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .qv-variant-card-img {
          width: 70px;
          height: 70px;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          border: 2px solid #eee;
          transition: all 0.3s ease;
        }
        .qv-variant-card.active .qv-variant-card-img {
          border-color: var(--primary-color, #0f172a);
        }
        .qv-variant-card:hover .qv-variant-card-img {
          border-color: var(--accent-color, #ff5a00);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .qv-variant-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .qv-variant-card-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .qv-variant-card:hover .qv-variant-card-video {
          opacity: 1;
        }
        .qv-variant-card-label {
          margin-top: 4px;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #888;
          transition: color 0.3s;
        }
        .qv-variant-card.active .qv-variant-card-label {
          color: var(--primary-color, #0f172a);
        }
        .qv-variant-card:hover .qv-variant-card-label {
          color: var(--accent-color, #ff5a00);
        }
        @media (max-width: 768px) {
          #quickViewBox {
            grid-template-columns: 1fr !important;
            height: auto !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
          }
          #qvMediaContainer {
            height: 280px !important;
          }
          #quickViewBox > div:last-child {
            padding: 20px !important;
          }
          #closeQuickView {
            top: 10px !important;
            right: 15px !important;
            background: rgba(255,255,255,0.8) !important;
            border-radius: 50% !important;
            width: 36px !important;
            height: 36px !important;
            line-height: 36px !important;
            text-align: center !important;
            padding: 0 !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          }
        }
      </style>
      <!-- Modal Overlay -->
      <div id="quickViewOverlay" style="position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.5); top: 0; left: 0;"></div>
      <!-- Modal Box -->
      <div id="quickViewBox" style="position: relative; width: 1050px; max-width: 95%; background: #fff; border-radius: 12px; box-shadow: 0 30px 70px rgba(0,0,0,0.18); z-index: 2; overflow: hidden; display: grid; grid-template-columns: 1.15fr 0.85fr; height: 600px; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); transform: scale(0.9);">
        <button id="closeQuickView" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 28px; cursor: pointer; z-index: 10; color: #1a1a1a;">&times;</button>
        <div id="qvMediaContainer" style="background: #f7f7f7; display: flex; align-items: center; justify-content: center; height: 100%; position: relative; width: 100%; overflow: hidden;">
          <img id="qvImage" src="" alt="" style="width: 100%; height: 100%; object-fit: contain; padding: 20px; box-sizing: border-box;">
          <video id="qvVideo" loop muted playsinline style="display: none; width: 100%; height: 100%; object-fit: cover; background: #f7f7f7; position: absolute; top: 0; left: 0; transition: opacity 0.3s ease; opacity: 0;"></video>
          <div id="qvModelContainer" style="display: none; width: 100%; height: 100%;"></div>
          <div id="qv360Container" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; position: relative; cursor: grab; user-select: none;">
            <img id="qv360Img" src="" style="width: 100%; height: 100%; object-fit: contain; padding: 20px; box-sizing: border-box; pointer-events: none;">
            <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.65); color: #fff; padding: 6px 16px; border-radius: 99px; font-size: 11px; pointer-events: none; white-space: nowrap; font-family: 'Inter', sans-serif;">Przeciągnij, aby obrócić 360°</div>
          </div>
          <!-- Fullscreen button -->
          <button id="qvFullscreenBtn" style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); color: #fff; border: none; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; z-index: 10;" aria-label="Pełny ekran">
            <svg class="fullscreen-icon-expand" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            <svg class="fullscreen-icon-collapse" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"/></svg>
          </button>
        </div>
        <div style="padding: 40px; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;">
          <div>
            <div id="qvCategory" style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #ff5a00; font-weight: 600; margin-bottom: 10px;"></div>
            <h2 id="qvTitle" style="font-family: 'Outfit', sans-serif; font-size: 26px; margin-bottom: 15px; font-weight: 700;"></h2>
            <div id="qvPrice" style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 20px;"></div>
            <p id="qvDesc" style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 25px;"></p>
            
            <!-- Model Variants -->
            <div id="qvVariantsContainer" style="margin-bottom: 20px; display: none;">
              <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px; color: rgba(0,0,0,0.5);">Dostępne modele</h4>
              <div id="qvVariantsGrid" class="qv-variants-grid"></div>
            </div>

            <!-- Parameters -->
            <div id="qvSpecsContainer" style="margin-bottom: 20px; display: none; border-top: 1px dashed #eee; padding-top: 15px;">
              <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px; color: rgba(0,0,0,0.5);">⚡ Specyfikacja</h4>
              <div id="qvSpecsList" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 15px; font-size: 12px; color: #555;"></div>
            </div>
            
            <!-- Color Temp (Barwy światła) -->
            <div id="qvBarwyContainer" style="margin-bottom: 20px; display: none; border-top: 1px dashed #eee; padding-top: 15px;">
              <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 10px; color: rgba(0,0,0,0.5);">🎨 Barwa światła</h4>
              <div id="qvBarwyList" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
            </div>

            <!-- Colors -->
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
              <input type="text" id="qvQtyInput" value="1" readonly style="width: 50px; text-align: center; border: none; font-size: 16px; font-weight: 600; background: transparent; outline: none; padding: 0;">
              <button id="qvQtyPlus" style="width: 40px; height: 40px; border: none; background: none; font-size: 16px; cursor: pointer;">+</button>
            </div>
            <button id="qvAddToCart" class="mockup-btn" style="flex-grow: 1; height: 42px; padding: 10px 24px !important; font-size: 11px !important; border-radius: 99px !important; margin: 0;">Dodaj do koszyka</button>
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
    <div id="searchDrawer" style="position: fixed; top: -650px; left: 0; width: 100vw; background: #fff; box-shadow: 0 15px 40px rgba(0,0,0,0.1); z-index: 2050; transition: top 0.4s cubic-bezier(0.16, 1, 0.3, 1); padding: 35px 8%; display: flex; flex-direction: column; gap: 20px;">
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
function initSharedPopups() {
  injectWishlistDrawer();
  injectProductModals();
  injectCartDrawer();
  injectQuickViewModal();
  injectNewsletterPopup();
  injectSearchOverlay();
  injectMobileMenuOverlay();
  injectMobileCategoriesDrawer();

  // Inject Global Style overrides (Shadows, Mobile sliding drawer, etc.)
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Global Search Bar Styling overrides */
    .mockup-search-container input {
      width: 240px !important;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .mockup-search-container input:focus {
      width: 350px !important;
    }

    @media (max-width: 1024px) {
      .wishlist-trigger, .mockup-action-icon[aria-label="Konto użytkownika"] {
        display: none !important;
      }
      .mockup-search-container {
        display: flex !important;
        padding: 6px 12px !important;
        margin-right: 8px !important;
        margin-left: auto !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
      }
      .mockup-search-container input {
        width: 80px !important;
      }
      .mockup-search-container input:focus {
        width: 120px !important;
      }
      .mockup-header-logo {
        margin-left: 15px !important;
      }
      .mockup-header {
        padding: 15px 4% !important;
      }
    }

    /* Hover menu delay & spacing on PC with invisible gap bridges */
    .magic-dropdown, .dropdown-menu {
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      transition-delay: 0.35s !important;
    }
    .has-mega-menu:hover .magic-dropdown,
    .has-dropdown:hover .dropdown-menu {
      transition-delay: 0s !important;
    }
    .magic-dropdown::before, .dropdown-menu::before {
      content: "";
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      height: 20px;
      display: block;
      z-index: -1;
    }
    
    /* Press/indent animation for slider and scroll-down arrows */
    .slider-arrow:active,
    .scroll-down-arrow:active .scroll-down-circle,
    .scroll-down-arrow:active {
      transform: scale(0.92) translateY(2px) !important;
      transition: transform 0.1s ease !important;
    }

    /* Mobile categories drawer styles (Premium Redesign) */
    .mobile-cat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 22px 24px;
      background: #ffffff;
      border: 2px solid #001f3f;
      border-radius: 20px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 8px 24px rgba(0, 31, 63, 0.08);
      margin-bottom: 4px;
    }
    .mobile-cat-row:active {
      transform: scale(0.96) translateY(2px);
      box-shadow: 0 4px 12px rgba(0, 31, 63, 0.05);
      background: #f8fafc;
    }
    .mobile-cat-content {
      flex-grow: 1;
      padding-right: 20px;
      display: flex;
      flex-direction: column;
      min-height: 54px;
      justify-content: center;
    }
    .mobile-cat-guarantee {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--accent-color);
      font-weight: 800;
      margin-bottom: 8px;
    }
    .mobile-cat-title {
      font-size: 20px;
      font-weight: 700;
      color: #001f3f;
      margin: 0;
      letter-spacing: -0.3px;
    }
    .mobile-cat-desc {
      font-size: 14px;
      color: #475569;
      margin: 0;
      line-height: 1.5;
      display: none;
      opacity: 0;
    }
    .mobile-cat-row.show-description .mobile-cat-title {
      display: none;
    }
    .mobile-cat-row.show-description .mobile-cat-desc {
      display: block;
      opacity: 1;
      animation: fadeDescIn 0.3s ease forwards;
    }
    @keyframes fadeDescIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .mobile-cat-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(0, 31, 63, 0.04);
      border: 1px solid rgba(0, 31, 63, 0.1);
      color: #001f3f;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .mobile-cat-row:hover .mobile-cat-btn, .mobile-cat-row:active .mobile-cat-btn {
      background: rgba(0, 31, 63, 0.08);
    }
    .mobile-cat-btn svg {
      width: 22px;
      height: 22px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .mobile-cat-btn:active {
      transform: scale(0.9);
      background: rgba(255, 255, 255, 0.2);
    }
    
    /* Product card title 2-line clamp */
    .mockup-product-title {
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      white-space: normal !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      min-height: 2.6em !important;
      line-height: 1.3em !important;
    }

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
    @media (max-width: 768px) {
      #cartDrawer > div:last-child {
        padding-bottom: 85px !important;
      }
      #wishlistDrawer > div:last-child {
        padding-bottom: 85px !important;
      }
      .mockup-search-container {
        display: flex !important;
        flex: 1 !important;
        max-width: 140px !important;
        min-width: 90px !important;
        padding: 5px 10px !important;
        margin-right: 8px !important;
        border-radius: 99px !important;
        background: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
      }
      .mockup-search-container input {
        width: 100% !important;
        font-size: 11px !important;
        padding: 0 !important;
        font-family: inherit !important;
      }
      .mockup-search-container input::placeholder {
        font-family: inherit !important;
        font-size: 10px !important;
        color: rgba(255, 255, 255, 0.6) !important;
      }
      .mockup-search-container input:focus {
        width: 100% !important;
      }
      .mockup-search-container button {
        padding: 0 !important;
      }
      .mockup-search-container button svg {
        width: 13px !important;
        height: 13px !important;
      }
      .mockup-header.scrolled .mockup-search-container {
        background: rgba(26, 26, 26, 0.04) !important;
        border-color: rgba(26, 26, 26, 0.15) !important;
      }
      .mockup-header.scrolled .mockup-search-container input {
        color: #1a1a1a !important;
      }
      .mockup-header.scrolled .mockup-search-container input::placeholder {
        color: rgba(26, 26, 26, 0.5) !important;
      }
      .mockup-header.scrolled .mockup-search-container button svg {
        stroke: #1a1a1a !important;
      }
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
    wishlist = JSON.parse(localStorage.getItem('prescot_wishlist')) || [];

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
        localStorage.setItem('prescot_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        
        // Remove from wishlist
        wishlist.splice(index, 1);
        updateWishlistStorage();
        
        closeWishlist();
        showToast('Dodano do koszyka: 1 szt.', 'cart');
        triggerCartIconAnimation();
      });
    });
  }

  function updateWishlistStorage() {
    localStorage.setItem('prescot_wishlist', JSON.stringify(wishlist));
  }

  // --- CONNECT ADD TO WISHLIST BUTTONS ON PRODUCTS ---
  document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const card = e.target.closest('.mockup-product-card');
      const pId = parseInt(card ? card.dataset.id : (new URLSearchParams(window.location.search).get('id') || 1));
      const p = products.find(prod => prod.id === pId);
      
      if (!p) return;

      wishlist = JSON.parse(localStorage.getItem('prescot_wishlist')) || [];
      const existing = wishlist.find(item => item.id === p.id);
      
      if (!existing) {
        wishlist.push({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.images[0]
        });
        updateWishlistStorage();
        showToast('Dodano produkt do listy życzeń!', 'wishlist');
      } else {
        showToast('Produkt jest już na Twojej liście życzeń.', 'info');
      }
    });
  });

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

  // Notes toggle
  const toggleNoteBtn = document.getElementById('toggleNoteBtn');
  const orderNoteInput = document.getElementById('orderNoteInput');
  if (toggleNoteBtn && orderNoteInput) {
    toggleNoteBtn.addEventListener('click', () => {
      if (orderNoteInput.style.display === 'none' || orderNoteInput.style.display === '') {
        orderNoteInput.style.display = 'block';
      } else {
        orderNoteInput.style.display = 'none';
      }
    });
  }

  // Recommendations navigation
  let currentRecIndex = 0;
  const prevRecBtn = document.getElementById('prevRecBtn');
  const nextRecBtn = document.getElementById('nextRecBtn');
  if (prevRecBtn && nextRecBtn) {
    prevRecBtn.addEventListener('click', () => {
      currentRecIndex--;
      renderRecommendations();
    });
    nextRecBtn.addEventListener('click', () => {
      currentRecIndex++;
      renderRecommendations();
    });
  }

  // Go to cart
  const goToCartBtn = document.getElementById('cartDrawerGoToCart');
  if (goToCartBtn) {
    goToCartBtn.addEventListener('click', () => {
      closeCart();
    });
  }

  // Checkout
  if (cartDrawerCheckout) {
    cartDrawerCheckout.addEventListener('click', () => {
      closeCart();
      window.location.href = 'checkout.html';
    });
  }

  // Link Header Cart Icon to open Cart Drawer
  document.querySelectorAll('a[href="cart.html"], .mockup-actions a, button.mockup-action-icon:last-child').forEach(btn => {
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
    cart = JSON.parse(localStorage.getItem('prescot_cart')) || [];

    // Calculate Total
    cart.forEach(item => {
      total += item.price * item.qty;
    });

    // Render Free Shipping Progress
    const freeShippingLimit = 300;
    const banner = document.getElementById('freeShippingBanner');
    const progressBar = document.getElementById('freeShippingProgress');
    const progressStar = document.getElementById('freeShippingStar');
    
    if (banner && progressBar && progressStar) {
      if (total === 0) {
        banner.innerHTML = 'Kup za jeszcze <strong>300,00 zł</strong>, aby otrzymać <strong>DARMOWĄ DOSTAWĘ</strong>';
        progressBar.style.width = '0%';
        progressStar.style.left = '0%';
      } else if (total >= freeShippingLimit) {
        banner.innerHTML = 'Gratulacje! Otrzymujesz <strong>DARMOWĄ DOSTAWĘ</strong>';
        progressBar.style.width = '100%';
        progressStar.style.left = '100%';
      } else {
        const needed = freeShippingLimit - total;
        banner.innerHTML = `Kup za jeszcze <strong>${needed.toFixed(2)} zł</strong>, aby otrzymać <strong>DARMOWĄ DOSTAWĘ</strong>`;
        const percentage = Math.min((total / freeShippingLimit) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        progressStar.style.left = `${percentage}%`;
      }
    }

    // Render Cart Items
    if (cart.length === 0) {
      cartDrawerItems.innerHTML = `<div style="text-align: center; color: #999; margin-top: 50px;">Twój koszyk jest pusty</div>`;
      cartDrawerTotal.textContent = '0,00 zł';
    } else {
      cart.forEach((item, index) => {
        const pTotal = item.price * item.qty;
        const itemHTML = `
          <div style="display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; align-items: center; position: relative;">
            <a href="product.html?id=${item.id}" target="_blank" style="width: 80px; height: 80px; flex-shrink: 0; background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; text-decoration: none;">
              <img src="${item.image}" style="width: 100%; height: 100%; object-fit: contain;">
            </a>
            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h4 style="font-size: 14px; font-weight: 600; margin: 0; line-height: 1.3; max-width: 220px;">
                  <a href="product.html?id=${item.id}" target="_blank" style="color: #1a1a1a; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${item.title}</a>
                </h4>
                <span style="font-size: 14px; font-weight: 600; color: #1a1a1a;">${pTotal.toFixed(2)} zł</span>
              </div>
              <p style="font-size: 11px; color: #888; margin: 0 0 8px 0;">Kolor: ${item.color ? `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${item.color}; vertical-align:middle; margin-left:3px;"></span>` : 'Domyślny'} / Rozmiar: ${item.size || 'Domyślny'}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; border: 1px solid #e0e0e0; border-radius: 99px; height: 32px; overflow: hidden; background: #fff; width: 90px; justify-content: space-between; padding: 0 5px;">
                  <button class="cart-drawer-qty-btn" data-index="${index}" data-action="minus" style="border: none; background: none; font-size: 16px; cursor: pointer; color: #333; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-family: inherit; line-height: 1;">&minus;</button>
                  <span style="font-size: 13px; font-weight: 600; color: #1a1a1a;">${item.qty}</span>
                  <button class="cart-drawer-qty-btn" data-index="${index}" data-action="plus" style="border: none; background: none; font-size: 16px; cursor: pointer; color: #333; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-family: inherit; line-height: 1;">&plus;</button>
                </div>
                <button class="cart-drawer-remove" data-index="${index}" style="background: none; border: none; font-size: 12px; color: #888; text-decoration: underline; cursor: pointer; font-family: inherit; font-weight: 500;">Usuń</button>
              </div>
            </div>
          </div>
        `;
        cartDrawerItems.insertAdjacentHTML('beforeend', itemHTML);
      });
      cartDrawerTotal.textContent = `${total.toFixed(2)} zł`;
    }

    renderRecommendations();
    bindCartEvents();
  }

  function renderRecommendations() {
    const recContainer = document.getElementById('cartRecommendations');
    const recList = document.getElementById('recItemsList');
    if (!recContainer || !recList) return;

    const inCartIds = cart.map(item => item.id);
    const recs = products.filter(p => !inCartIds.includes(p.id));

    if (recs.length === 0) {
      recContainer.style.display = 'none';
      return;
    }
    recContainer.style.display = 'block';

    const index = Math.abs(currentRecIndex) % recs.length;
    const rec = recs[index];

    recList.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #eee;">
        <div style="width: 50px; height: 50px; flex-shrink: 0; background: #fff; border: 1px solid #eee; border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <img src="${rec.images[0]}" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px;">
          <h5 style="font-size: 13px; font-weight: 600; color: #1a1a1a; margin: 0; line-height: 1.2;">${rec.title}</h5>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 13px; font-weight: 700; color: #000;">${rec.price.toFixed(2)} zł</span>
            ${rec.compareAtPrice ? `<span style="font-size: 11px; text-decoration: line-through; color: #999;">${rec.compareAtPrice.toFixed(2)} zł</span>` : ''}
          </div>
        </div>
        <button class="add-rec-to-cart-btn" data-id="${rec.id}" style="background: none; border: none; font-size: 12px; color: #333; font-weight: 700; cursor: pointer; text-decoration: underline; padding: 10px; font-family: inherit;">+ Dodaj</button>
      </div>
    `;

    const addBtn = recList.querySelector('.add-rec-to-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        const prodId = parseInt(e.currentTarget.dataset.id);
        const p = products.find(prod => prod.id === prodId);
        if (p) {
          cart.push({
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.images[0],
            qty: 1,
            color: p.colors && p.colors[0],
            size: p.sizes && p.sizes[0]
          });
          updateLocalStorage();
          renderCart();
          window.dispatchEvent(new Event('storage'));
          showToast('Dodano produkt do koszyka!');
        }
      });
    }
  }

  function bindCartEvents() {
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
    localStorage.setItem('prescot_cart', JSON.stringify(cart));
    updateCartBadge();
  }

  if (cartDrawerCheckout) {
    cartDrawerCheckout.addEventListener('click', () => {
      closeCart();
      window.location.href = 'checkout.html';
    });
  }

  // --- QUICK VIEW MODAL LOGIC ---
  let selectedProduct = null;
  let selectedColor = null;
  let selectedSize = null;
  let qvQty = 1;

  let activeQv360Index = 1;
  let isDraggingQv360 = false;
  let startQv360X = 0;

  function getProductSpecs(p) {
    let specs = [];
    let barwy = [];
    
    if (p.category === "Taśmy LED") {
      specs = [
        { name: "Napięcie", value: "24V DC" },
        { name: "Moc", value: "10.6W/m" },
        { name: "Diody", value: "180 LED/m" },
        { name: "CRI (Ra)", value: "≥ 80" },
        { name: "Gwarancja", value: "7 lat" }
      ];
      if (p.title.includes("4000K")) {
        barwy = [{ label: "4000K", desc: "Neutralna", color: "#fff5e0" }];
      } else if (p.title.includes("3000K")) {
        barwy = [{ label: "3000K", desc: "Ciepła biel", color: "#ffe0a0" }];
      } else {
        barwy = [
          { label: "3000K", desc: "Ciepła biel", color: "#ffe0a0" },
          { label: "4000K", desc: "Neutralna", color: "#fff5e0" }
        ];
      }
    } else if (p.category === "Sterowniki LED") {
      specs = [
        { name: "Napięcie", value: "12V / 24V DC" },
        { name: "Zasięg", value: "do 30m" },
        { name: "Częstotliwość", value: "2.4GHz RF" },
        { name: "Prąd wyjściowy", value: "12A max" },
        { name: "Gwarancja", value: "5 lat" }
      ];
      if (p.title.includes("RGBCCT")) {
        barwy = [{ label: "RGB+CCT", desc: "16M kolorów + CCT", color: "linear-gradient(to right, red, orange, yellow, green, blue, violet, white)" }];
      } else if (p.title.includes("RGBW")) {
        barwy = [{ label: "RGB+W", desc: "16M kolorów + biel", color: "linear-gradient(to right, red, green, blue, white)" }];
      } else if (p.title.includes("RGB")) {
        barwy = [{ label: "RGB", desc: "16M kolorów", color: "linear-gradient(to right, red, green, blue)" }];
      } else if (p.title.includes("CCT")) {
        barwy = [{ label: "CCT", desc: "Ciepła-Zimna biel", color: "linear-gradient(to right, #ffe0a0, #dce8ff)" }];
      } else {
        barwy = [{ label: "Mono", desc: "Jednokolorowy", color: "#fff" }];
      }
    } else if (p.category === "Zasilacze LED") {
      const power = p.title.match(/\d+W/) ? p.title.match(/\d+W/)[0] : "18W";
      const voltage = p.title.includes("24V") ? "24V DC" : "12V DC";
      specs = [
        { name: "Napięcie wejściowe", value: "200-240V AC" },
        { name: "Napięcie wyjściowe", value: voltage },
        { name: "Moc maksymalna", value: power },
        { name: "Klasa szczelności", value: "IP67 (wodoodporny)" },
        { name: "Gwarancja", value: "7 lat" }
      ];
    } else {
      specs = [
        { name: "Gwarancja", value: "5 lat" }
      ];
    }
    
    return { specs, barwy };
  }

  function openQuickView(id, mode = 'normal') {
    selectedProduct = products.find(p => p.id === id);
    if (!selectedProduct) return;

    // Reset media displays
    const qvImage = document.getElementById('qvImage');
    const qvModelContainer = document.getElementById('qvModelContainer');
    const qv360Container = document.getElementById('qv360Container');

    if (qvImage) qvImage.style.display = 'none';
    if (qvModelContainer) {
      qvModelContainer.style.display = 'none';
      qvModelContainer.innerHTML = '';
    }
    if (qv360Container) qv360Container.style.display = 'none';

    if (mode === '3d' && selectedProduct.has3D) {
      if (qvModelContainer) {
        qvModelContainer.style.display = 'block';
        qvModelContainer.innerHTML = `
          <model-viewer 
            src="${selectedProduct.modelSrc}" 
            poster="${selectedProduct.posterSrc}" 
            camera-controls 
            ar 
            ar-modes="webxr scene-viewer quick-look" 
            style="width: 100%; height: 100%;" 
            alt="${selectedProduct.title}">
          </model-viewer>
        `;
      }
      // Lazy load model-viewer if not loaded yet
      if (!window.customElements || !window.customElements.get('model-viewer')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
        document.head.appendChild(script);
      }
    } else if (mode === '360' && selectedProduct.has360) {
      const qv360Img = document.getElementById('qv360Img');
      if (qv360Container && qv360Img) {
        qv360Container.style.display = 'flex';
        activeQv360Index = 1;
        qv360Img.src = selectedProduct.images360Pattern.replace('{index}', 1);

        // Bind drag rotation on the container
        qv360Container.onmousedown = (e) => {
          isDraggingQv360 = true;
          startQv360X = e.clientX;
        };
        qv360Container.ontouchstart = (e) => {
          isDraggingQv360 = true;
          startQv360X = e.touches[0].clientX;
        };
      }
    } else {
      if (qvImage) {
        qvImage.style.display = 'block';
        qvImage.src = selectedProduct.images[0];
      }
    }

    // Reset and set up video autoplay
    const qvVideo = document.getElementById('qvVideo');
    if (qvVideo) {
      qvVideo.style.display = 'none';
      qvVideo.style.opacity = '0';
      qvVideo.pause();
    }
    if (openQuickView.videoTimeout) {
      clearTimeout(openQuickView.videoTimeout);
    }
    if (qvVideo && selectedProduct.video) {
      qvVideo.src = selectedProduct.video;
      openQuickView.videoTimeout = setTimeout(() => {
        if (qvImage.style.display !== 'none') {
          qvVideo.style.display = 'block';
          setTimeout(() => {
            qvVideo.style.opacity = '1';
            qvVideo.play().catch(err => console.log("Quick view video autoplay failed:", err));
          }, 50);
        }
      }, 1000);
    }

    document.getElementById('qvCategory').textContent = selectedProduct.category;
    document.getElementById('qvTitle').textContent = selectedProduct.title;
    document.getElementById('qvPrice').innerHTML = `${selectedProduct.price.toFixed(2)} zł <span style="font-size: 14px; font-weight: normal; color: #888; margin-left: 5px;">/ ${selectedProduct.category === "Taśmy LED" ? "metr" : "szt."}</span>`;
    document.getElementById('qvDesc').textContent = selectedProduct.description;

    // Render Model Variants in Quick View
    const qvVariantsContainer = document.getElementById('qvVariantsContainer');
    const qvVariantsGrid = document.getElementById('qvVariantsGrid');
    if (qvVariantsContainer && qvVariantsGrid) {
      if (selectedProduct.variants && selectedProduct.variants.length > 0 && selectedProduct.variants[0].name) {
        qvVariantsContainer.style.display = 'block';
        qvVariantsGrid.innerHTML = selectedProduct.variants.map(v => {
          const isActive = v.id === selectedProduct.id;
          const activeClass = isActive ? 'active' : '';
          return `
            <div class="qv-variant-card ${activeClass}" data-id="${v.id}">
              <div class="qv-variant-card-img">
                <img src="${v.image}" alt="${v.name}">
                ${v.video ? `<video src="${v.video}" loop muted playsinline autoplay class="qv-variant-card-video"></video>` : ''}
              </div>
              <span class="qv-variant-card-label">${v.name}</span>
            </div>
          `;
        }).join('');

        // Bind click events on variant cards inside Quick View to reload the popup
        qvVariantsGrid.querySelectorAll('.qv-variant-card').forEach(card => {
          card.addEventListener('click', () => {
            const vid = parseInt(card.dataset.id);
            openQuickView(vid, mode);
          });
        });
      } else {
        qvVariantsContainer.style.display = 'none';
      }
    }

    // Render Specifications and Color Temp
    const qvSpecsContainer = document.getElementById('qvSpecsContainer');
    const qvSpecsList = document.getElementById('qvSpecsList');
    const qvBarwyContainer = document.getElementById('qvBarwyContainer');
    const qvBarwyList = document.getElementById('qvBarwyList');
    
    const { specs, barwy } = getProductSpecs(selectedProduct);
    
    if (qvSpecsContainer && qvSpecsList) {
      if (specs.length > 0) {
        qvSpecsContainer.style.display = 'block';
        qvSpecsList.innerHTML = specs.map(s => `
          <div><span style="color: #888;">${s.name}:</span> <strong style="color: #1a1a1a;">${s.value}</strong></div>
        `).join('');
      } else {
        qvSpecsContainer.style.display = 'none';
      }
    }
    
    if (qvBarwyContainer && qvBarwyList) {
      if (barwy.length > 0) {
        qvBarwyContainer.style.display = 'block';
        qvBarwyList.innerHTML = barwy.map(b => `
          <div style="display: flex; align-items: center; gap: 6px; background: #f7f7f7; padding: 4px 10px; border-radius: 99px; font-size: 11px; border: 1px solid #eee;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${b.color}; border: 1px solid #ccc;"></div>
            <strong style="color: #1a1a1a;">${b.label}</strong>
            <span style="color: #888; font-size: 10px;">(${b.desc})</span>
          </div>
        `).join('');
      } else {
        qvBarwyContainer.style.display = 'none';
      }
    }

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

  // Global mousemove/touchmove bindings for 360 viewer drag
  window.addEventListener('mousemove', (e) => {
    if (!isDraggingQv360 || !selectedProduct) return;
    const diffX = e.clientX - startQv360X;
    if (Math.abs(diffX) > 10) {
      const count = selectedProduct.images360Count || 39;
      if (diffX > 0) {
        activeQv360Index--;
        if (activeQv360Index < 1) activeQv360Index = count;
      } else {
        activeQv360Index++;
        if (activeQv360Index > count) activeQv360Index = 1;
      }
      const qv360Img = document.getElementById('qv360Img');
      if (qv360Img) {
        qv360Img.src = selectedProduct.images360Pattern.replace('{index}', activeQv360Index);
      }
      startQv360X = e.clientX;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDraggingQv360 || !selectedProduct) return;
    const clientX = e.touches[0].clientX;
    const diffX = clientX - startQv360X;
    if (Math.abs(diffX) > 10) {
      const count = selectedProduct.images360Count || 39;
      if (diffX > 0) {
        activeQv360Index--;
        if (activeQv360Index < 1) activeQv360Index = count;
      } else {
        activeQv360Index++;
        if (activeQv360Index > count) activeQv360Index = 1;
      }
      const qv360Img = document.getElementById('qv360Img');
      if (qv360Img) {
        qv360Img.src = selectedProduct.images360Pattern.replace('{index}', activeQv360Index);
      }
      startQv360X = clientX;
    }
  });

  const stopDraggingQv360 = () => { isDraggingQv360 = false; };
  window.addEventListener('mouseup', stopDraggingQv360);
  window.addEventListener('touchend', stopDraggingQv360);

  const qvFullscreenBtn = document.getElementById('qvFullscreenBtn');
  const qvMediaContainer = document.getElementById('qvMediaContainer');
  if (qvFullscreenBtn && qvMediaContainer) {
    qvFullscreenBtn.addEventListener('click', () => {
      const isFullscreen = qvMediaContainer.classList.toggle('qv-fullscreen-active');
      const expandIcon = qvFullscreenBtn.querySelector('.fullscreen-icon-expand');
      const collapseIcon = qvFullscreenBtn.querySelector('.fullscreen-icon-collapse');
      if (expandIcon && collapseIcon) {
        if (isFullscreen) {
          expandIcon.style.display = 'none';
          collapseIcon.style.display = 'block';
        } else {
          expandIcon.style.display = 'block';
          collapseIcon.style.display = 'none';
        }
      }
    });
  }

  function closeQuickViewModal() {
    quickViewModal.style.opacity = '0';
    quickViewModal.style.pointerEvents = 'none';
    quickViewBox.style.transform = 'scale(0.9)';
    
    // Stop video autoplay and pause
    const qvVideo = document.getElementById('qvVideo');
    if (qvVideo) {
      qvVideo.pause();
      qvVideo.style.display = 'none';
      qvVideo.style.opacity = '0';
    }
    if (openQuickView.videoTimeout) {
      clearTimeout(openQuickView.videoTimeout);
    }

    const qvModelContainer = document.getElementById('qvModelContainer');
    if (qvModelContainer) qvModelContainer.innerHTML = ''; // Stop 3D audio or rendering when closed
    
    // Exit fullscreen if active
    if (qvMediaContainer && qvMediaContainer.classList.contains('qv-fullscreen-active')) {
      qvMediaContainer.classList.remove('qv-fullscreen-active');
      if (qvFullscreenBtn) {
        const expandIcon = qvFullscreenBtn.querySelector('.fullscreen-icon-expand');
        const collapseIcon = qvFullscreenBtn.querySelector('.fullscreen-icon-collapse');
        if (expandIcon && collapseIcon) {
          expandIcon.style.display = 'block';
          collapseIcon.style.display = 'none';
        }
      }
    }
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
      showToast(`Dodano do koszyka: ${qvQty} szt.`, 'cart');
      triggerCartIconAnimation();
      window.dispatchEvent(new Event('storage'));
    });
  }

  // --- CONNECT INTERACTIVE BUTTONS WITH REAL IDs (EVENT DELEGATION) ---
  document.addEventListener('click', (e) => {
    // 0. Add to wishlist
    const wishlistBtn = e.target.closest('.qv-wishlist-btn') || e.target.closest('.add-to-wishlist-btn');
    if (wishlistBtn) {
      e.preventDefault();
      e.stopPropagation();
      const pId = parseInt(wishlistBtn.dataset.id || wishlistBtn.closest('.mockup-product-card')?.dataset.id || (new URLSearchParams(window.location.search).get('id') || 1));
      const p = products.find(prod => prod.id === pId);
      if (!p) return;

      wishlist = JSON.parse(localStorage.getItem('prescot_wishlist')) || [];
      const existing = wishlist.find(item => item.id === p.id);
      
      if (!existing) {
        wishlist.push({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.images[0]
        });
        updateWishlistStorage();
        showToast('Dodano produkt do listy życzeń!', 'wishlist');
      } else {
        showToast('Produkt jest już na Twojej liście życzeń.', 'info');
      }
      return;
    }

    // 1. Quick add to cart
    const addCartBtn = e.target.closest('.qv-add-cart-btn');
    if (addCartBtn) {
      e.preventDefault();
      e.stopPropagation();
      const pId = parseInt(addCartBtn.dataset.id);
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
      showToast('Dodano do koszyka: 1 szt.', 'cart');
      triggerCartIconAnimation();
      window.dispatchEvent(new Event('storage'));
      return;
    }

    // 2. Quick view (eye icon)
    const eyeBtn = e.target.closest('.qv-eye-btn');
    if (eyeBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(parseInt(eyeBtn.dataset.id), 'normal');
      return;
    }

    // 3. 3D view
    const tdBtn = e.target.closest('.qv-3d-btn');
    if (tdBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(parseInt(tdBtn.dataset.id), '3d');
      return;
    }

    // 4. 360 view
    const sxtyBtn = e.target.closest('.qv-360-btn');
    if (sxtyBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(parseInt(sxtyBtn.dataset.id), '360');
      return;
    }

    // 5. Product card click (navigate to details)
    const card = e.target.closest('.mockup-product-card');
    if (card && !e.target.closest('.action-btn-circle') && !e.target.closest('a')) {
      const pId = card.dataset.id;
      if (pId) {
        window.location.href = `product.html?id=${pId}`;
      }
    }
  });

  // --- PC SEARCH OVERLAY LOGIC ---
  function openSearch() {
    searchDrawer.style.top = '0px';
    searchDrawerOverlay.style.opacity = '1';
    searchDrawerOverlay.style.pointerEvents = 'all';
    setTimeout(() => pcSearchInput.focus(), 150);
  }

  function closeSearch() {
    searchDrawer.style.top = '-650px';
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

      pcSearchSuggestions.innerHTML = filtered.map(p => {
        let thirdBtn = '';
        if (p.has3D) {
          thirdBtn = `
            <button class="action-btn-circle qv-3d-btn" data-id="${p.id}" aria-label="Podgląd 3D">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </button>
          `;
        } else if (p.has360) {
          thirdBtn = `
            <button class="action-btn-circle qv-360-btn" data-id="${p.id}" aria-label="Podgląd 360">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </button>
          `;
        }

        return `
          <div class="mockup-product-card" data-id="${p.id}">
            <p class="mockup-product-category">${p.category}</p>
            <div class="mockup-product-media" style="position: relative; overflow: hidden; width: 100%; aspect-ratio: 1/1;">
              <img src="${p.images[0]}" alt="${p.title}" class="mockup-product-img">
              ${p.video ? `
                <video class="mockup-product-video" src="${p.video}" loop muted playsinline autoplay style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;"></video>
              ` : ''}
              <div class="product-actions-hover">
                <button class="action-btn-circle qv-wishlist-btn" data-id="${p.id}" aria-label="Dodaj do listy życzeń">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <button class="action-btn-circle qv-eye-btn" data-id="${p.id}" aria-label="Szybki podgląd">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                ${thirdBtn}
              </div>
            </div>
            <div class="mockup-product-info">
              <h3 class="mockup-product-title"><a href="product.html?id=${p.id}">${p.title}</a></h3>
              <p class="mockup-product-price">
                ${p.price.toFixed(2)} zł <span class="price-unit">/ ${p.category === 'Taśmy LED' ? 'metr' : 'szt.'}</span>
              </p>
              <button class="mockup-btn qv-add-cart-btn" data-id="${p.id}" style="width: 100%; margin-top: 12px; padding: 10px 20px !important; font-size: 11px !important;">
                Dodaj do koszyka
              </button>
            </div>
          </div>
        `;
      }).join('');
    });
  }

  // --- MOBILE MENU DRAWER LOGIC ---
  if (mobMenu) {
    // Inject close button dynamically
    if (!mobMenu.querySelector('.close-mobile-menu')) {
      mobMenu.insertAdjacentHTML('afterbegin', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px; border-bottom:1px solid #eee; padding-bottom:15px; width:100%;">
          <img src="images/logo.png" style="height:22px;">
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
            showToast('Link do produktu został skopiowany do schowka!', 'success');
          });
        }
      }
    });
  });

  // --- NEWSLETTER POPUP LOGIC ---
  function openNews() {
    if (localStorage.getItem('prescot_news_subscribed') === 'true') return;
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
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname.includes('/prescot') || window.location.pathname.includes('index.html')) {
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
        localStorage.setItem('prescot_news_subscribed', 'true');
        document.getElementById('newsMsg').style.display = 'block';
        setTimeout(closeNews, 3000);
      } else {
        showToast('Wpisz poprawny adres e-mail!', 'info');
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
      showToast(`Dodano do koszyka: ${qty} szt.`, 'cart');
      triggerCartIconAnimation();
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
      window.location.href = 'checkout.html';
    });
  }

  // --- GLOBAL CARD HOVER & MOBILE VIEWPORT AUTOPLAY FOR VIDEOS ---
  function initGlobalCardVideos() {
    const cards = document.querySelectorAll('.mockup-product-card');
    
    cards.forEach(card => {
      const video = card.querySelector('.mockup-product-video');
      if (!video) return;

      // Listen to the 'playing' event to smoothly fade in the wideo
      // This ensures we never show a gray blank block during loading or if playback fails!
      video.addEventListener('playing', () => {
        video.style.opacity = '1';
      });

      // Desktop Hover
      card.addEventListener('mouseenter', () => {
        if (card.videoTimeout) clearTimeout(card.videoTimeout);
        const dataSrc = video.getAttribute('data-src');
        if (dataSrc && video.getAttribute('src') !== dataSrc) {
          video.setAttribute('src', dataSrc);
          video.load();
        }
        video.play().catch(err => console.log("Hover video play blocked:", err));
      });

      card.addEventListener('mouseleave', () => {
        if (card.videoTimeout) clearTimeout(card.videoTimeout);
        video.style.opacity = '0';
        video.pause();
      });

      // Touchstart (Mobile user gesture helper to bypass strict iOS autoplay blocks)
      card.addEventListener('touchstart', () => {
        if (card.videoTimeout) clearTimeout(card.videoTimeout);
        const dataSrc = video.getAttribute('data-src');
        if (dataSrc && video.getAttribute('src') !== dataSrc) {
          video.setAttribute('src', dataSrc);
          video.load();
        }
        video.play().catch(err => console.log("Touch video play blocked:", err));
      }, { passive: true });
    });

    // Bind IntersectionObserver ONLY for Mobile / Touch Devices
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const card = entry.target;
          const video = card.querySelector('.mockup-product-video');
          if (!video) return;

          if (entry.isIntersecting) {
            if (card.videoTimeout) clearTimeout(card.videoTimeout);
            card.videoTimeout = setTimeout(() => {
              const dataSrc = video.getAttribute('data-src');
              if (dataSrc && video.getAttribute('src') !== dataSrc) {
                video.setAttribute('src', dataSrc);
                video.load();
              }
              video.play().catch(err => {
                console.log("Viewport autoplay play blocked:", err);
              });
            }, 300); // Trigger after 300ms of staying in viewport
          } else {
            if (card.videoTimeout) {
              clearTimeout(card.videoTimeout);
              card.videoTimeout = null;
            }
            video.style.opacity = '0';
            video.pause();
          }
        });
      }, observerOptions);

      cards.forEach(card => observer.observe(card));
    }
  }

  initGlobalCardVideos();
}

// --- INJECT MOBILE CATEGORIES DRAWER ---
function injectMobileCategoriesDrawer() {
  const drawerHTML = `
    <!-- Mobile Categories Drawer -->
    <div id="mobileCategoriesDrawer" style="position: fixed; top: 0; left: 0; right: 0; bottom: 65px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); z-index: 10000; display: none; flex-direction: column; color: #1a1a2e; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease; transform: translateY(100%); opacity: 0;">
      
      <!-- Drawer Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 25px; border-bottom: 1px solid rgba(0,0,0,0.08);">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #1a1a2e;">Kategorie</h3>
        <button onclick="closeMobileCategories()" style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); color: #1a1a2e; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; transition: all 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05);"><i class="ph ph-x"></i></button>
      </div>
      
      <!-- Drawer Grid -->
      <div style="flex-grow: 1; overflow-y: auto; padding: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-content: flex-start; padding-bottom: 100px;">
        
        <style>
          .glass-cat-card {
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            padding: 25px 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 12px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          }
          .glass-cat-card:active {
            transform: scale(0.96);
            background: rgba(255, 255, 255, 0.8);
            border-color: rgba(0, 0, 0, 0.15);
          }
          .glass-cat-icon {
            font-size: 32px;
            color: var(--accent-color, #ff6b00);
            filter: drop-shadow(0 0 10px rgba(255, 107, 0, 0.2));
          }
          .glass-cat-title {
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 700;
            color: #1a1a2e;
            margin: 0;
            letter-spacing: 0.5px;
            line-height: 1.3;
          }
          .glass-cat-badge {
            font-size: 9px;
            background: rgba(0, 0, 0, 0.05);
            padding: 3px 8px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #555;
            margin-bottom: 2px;
          }
        </style>

        <!-- Taśmy LED -->
        <a href="shop.html?category=Ta%C5%9Bmy%20LED" class="glass-cat-card">
          <i class="ph ph-lightbulb glass-cat-icon"></i>
          <span class="glass-cat-badge">Wszystkie</span>
          <h4 class="glass-cat-title">Taśmy LED</h4>
        </a>

        <!-- Taśmy LED 7 lat -->
        <a href="shop.html?category=Ta%C5%9Bmy%20LED%207%20lat%20gwarancji" class="glass-cat-card">
          <i class="ph ph-star glass-cat-icon"></i>
          <span class="glass-cat-badge">Premium</span>
          <h4 class="glass-cat-title">Taśmy LED 7 lat gwarancji</h4>
        </a>

        <!-- Taśmy LED 5 lat -->
        <a href="shop.html?category=Ta%C5%9Bmy%20LED%205%20lat%20gwarancji" class="glass-cat-card">
          <i class="ph ph-shield-check glass-cat-icon"></i>
          <span class="glass-cat-badge">Standard</span>
          <h4 class="glass-cat-title">Taśmy LED 5 lat gwarancji</h4>
        </a>

        <!-- Sterowniki -->
        <a href="shop.html?category=Sterowniki" class="glass-cat-card">
          <i class="ph ph-faders glass-cat-icon"></i>
          <span class="glass-cat-badge">Smart Home</span>
          <h4 class="glass-cat-title">Sterowniki</h4>
        </a>

        <!-- Zasilacze -->
        <a href="shop.html?category=Zasilacze" class="glass-cat-card">
          <i class="ph ph-lightning glass-cat-icon"></i>
          <span class="glass-cat-badge">Zasilanie</span>
          <h4 class="glass-cat-title">Zasilacze</h4>
        </a>

        <!-- Akcesoria -->
        <a href="shop.html?category=Akcesoria" class="glass-cat-card">
          <i class="ph ph-plug glass-cat-icon"></i>
          <span class="glass-cat-badge">Montaż</span>
          <h4 class="glass-cat-title">Akcesoria</h4>
        </a>
      </div>
    </div>
  `;
  if (!document.getElementById('mobileCategoriesDrawer')) {
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  }
}

// Bind drawer functions to global window scope
window.openMobileCategories = function() {
  const drawer = document.getElementById('mobileCategoriesDrawer');
  if (drawer) {
    drawer.style.display = 'flex';
    setTimeout(() => {
      drawer.style.opacity = '1';
      drawer.style.transform = 'translateY(0)';
    }, 10);
  }
};

window.closeMobileCategories = function() {
  const drawer = document.getElementById('mobileCategoriesDrawer');
  if (drawer) {
    drawer.style.opacity = '0';
    drawer.style.transform = 'translateY(100%)';
    setTimeout(() => {
      drawer.style.display = 'none';
    }, 400);
  }
};

window.toggleMobileCatRow = function(row) {
  row.classList.toggle('show-description');
};


window.initSharedPopups = initSharedPopups;

// --- AUTH POPUP (LOGIN / REGISTER) ---
function initAuthPopup() {
  const authStyles = document.createElement('style');
  authStyles.innerHTML = `
    .auth-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
      z-index: 3000; display: none; opacity: 0; transition: opacity 0.3s;
      align-items: center; justify-content: center;
    }
    .auth-modal {
      background: white; width: 100%; max-width: 400px;
      border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      padding: 30px; position: relative;
      transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Outfit', sans-serif;
    }
    .auth-overlay.active { display: flex; opacity: 1; }
    .auth-overlay.active .auth-modal { transform: scale(1); }
    .auth-close {
      position: absolute; top: 20px; right: 20px;
      background: #f5f5f7; border: none; width: 36px; height: 36px; border-radius: 18px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      color: #333; font-size: 18px; transition: 0.2s;
    }
    .auth-close:hover { background: #e5e5e7; }
    
    .auth-tabs { display: flex; gap: 20px; margin-bottom: 24px; border-bottom: 2px solid #eee; }
    .auth-tab {
      padding: 10px 0; font-size: 16px; font-weight: 600; color: #888; cursor: pointer;
      position: relative; transition: 0.2s;
    }
    .auth-tab.active { color: var(--primary-color); }
    .auth-tab.active::after {
      content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 2px;
      background: var(--accent-color, #ff5a00);
    }
    
    .auth-form { display: none; flex-direction: column; gap: 15px; }
    .auth-form.active { display: flex; }
    .auth-input-group { display: flex; flex-direction: column; gap: 5px; }
    .auth-input-group label { font-size: 12px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
    .auth-input-group input {
      padding: 14px 16px; border: 1px solid #ddd; border-radius: 12px;
      font-size: 14px; font-family: 'Outfit', sans-serif; transition: 0.2s;
      box-sizing: border-box; width: 100%;
    }
    .auth-input-group input:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
    
    .auth-btn {
      background: var(--primary-color); color: white; border: none;
      padding: 16px; border-radius: 12px; font-weight: 700; font-size: 15px;
      cursor: pointer; transition: 0.2s; margin-top: 10px; width: 100%;
    }
    .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    
    .auth-social { margin-top: 20px; text-align: center; }
    .auth-social p { font-size: 12px; color: #888; margin-bottom: 15px; position: relative; }
    .auth-social p::before, .auth-social p::after {
      content: ''; position: absolute; top: 50%; width: 25%; height: 1px; background: #eee;
    }
    .auth-social p::before { left: 0; }
    .auth-social p::after { right: 0; }
    .auth-social-btns { display: flex; gap: 10px; }
    .auth-social-btn {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px; border: 1px solid #ddd; border-radius: 12px; background: white;
      font-size: 14px; font-weight: 600; color: #333; cursor: pointer; transition: 0.2s;
    }
    .auth-social-btn:hover { background: #f5f5f7; }
  `;
  document.head.appendChild(authStyles);

  const authOverlay = document.createElement('div');
  authOverlay.className = 'auth-overlay';
  authOverlay.id = 'authOverlay';
  
  authOverlay.innerHTML = `
    <div class="auth-modal" onclick="event.stopPropagation()">
      <button class="auth-close" id="authCloseBtn"><i class="ph ph-x"></i></button>
      
      <div class="auth-tabs">
        <div class="auth-tab active" data-target="login">Logowanie</div>
        <div class="auth-tab" data-target="register">Rejestracja</div>
      </div>
      
      <form class="auth-form active" id="loginForm">
        <div class="auth-input-group">
          <label>Email</label>
          <input type="email" placeholder="twoj@email.pl" required>
        </div>
        <div class="auth-input-group">
          <label>Hasło</label>
          <input type="password" placeholder="••••••••" required>
        </div>
        <div style="text-align: right; margin-top: -10px;">
          <a href="#" style="font-size: 12px; color: #666; text-decoration: none;">Zapomniałeś hasła?</a>
        </div>
        <button type="submit" class="auth-btn">Zaloguj się</button>
      </form>
      
      <form class="auth-form" id="registerForm">
        <div class="auth-input-group">
          <label>Imię i nazwisko</label>
          <input type="text" placeholder="Jan Kowalski" required>
        </div>
        <div class="auth-input-group">
          <label>Email</label>
          <input type="email" placeholder="twoj@email.pl" required>
        </div>
        <div class="auth-input-group">
          <label>Hasło</label>
          <input type="password" placeholder="Minimum 8 znaków" required>
        </div>
        <button type="submit" class="auth-btn">Załóż konto</button>
      </form>
      
      <div class="auth-social">
        <p>LUB ZALOGUJ PRZEZ</p>
        <div class="auth-social-btns">
          <button class="auth-social-btn" type="button"><i class="ph ph-google-logo" style="font-size: 18px; color: #DB4437;"></i> Google</button>
          <button class="auth-social-btn" type="button"><i class="ph ph-facebook-logo" style="font-size: 18px; color: #4267B2;"></i> Facebook</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(authOverlay);

  // Auth logic
  const authCloseBtn = document.getElementById('authCloseBtn');
  authCloseBtn.addEventListener('click', () => {
    authOverlay.classList.remove('active');
    setTimeout(() => authOverlay.style.display = 'none', 300);
  });
  
  authOverlay.addEventListener('click', () => {
    authCloseBtn.click();
  });

  const authTabs = authOverlay.querySelectorAll('.auth-tab');
  const authForms = authOverlay.querySelectorAll('.auth-form');
  
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      authForms.forEach(f => f.classList.remove('active'));
      
      tab.classList.add('active');
      authOverlay.querySelector('#' + tab.dataset.target + 'Form').classList.add('active');
    });
  });

  // Mock login/register submissions
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('prescot_logged_in', 'true');
    window.showToast('Zalogowano pomyślnie!', 'success');
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 800);
  });
  
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem('prescot_logged_in', 'true');
    window.showToast('Konto zostało utworzone!', 'success');
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 800);
  });

  // Bind all user account buttons to trigger auth popup OR go to account
  const userBtns = document.querySelectorAll('button[aria-label="Konto użytkownika"], a[aria-label="Konto użytkownika"], a.mobile-nav-item:has(i.ph-user)');
  
  const setupUserBtnClick = (btn) => {
    // override href if it is an A tag
    if (btn.tagName.toLowerCase() === 'a') {
      btn.href = 'javascript:void(0);';
    }
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isLoggedIn = localStorage.getItem('prescot_logged_in');
      if (isLoggedIn === 'true') {
        window.location.href = 'account.html';
      } else {
        authOverlay.style.display = 'flex';
        // force reflow
        void authOverlay.offsetWidth;
        authOverlay.classList.add('active');
      }
    });
  };

  userBtns.forEach(setupUserBtnClick);
  
  // Expose global open method just in case
  window.openAuthPopup = () => {
    const isLoggedIn = localStorage.getItem('prescot_logged_in');
    if (isLoggedIn === 'true') {
      window.location.href = 'account.html';
    } else {
      authOverlay.style.display = 'flex';
      void authOverlay.offsetWidth;
      authOverlay.classList.add('active');
    }
  };
}

// Call this on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initAuthPopup();
});

