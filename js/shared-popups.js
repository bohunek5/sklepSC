

// --- CART STATE ---
let wishlist = JSON.parse(localStorage.getItem('prescot_wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('prescot_cart')) || [];

// Product-page purchase actions are bound independently from the popup
// initializer. This keeps checkout working even if an unrelated optional
// popup/widget cannot initialize on a given product page.
function getCurrentProductCartItem() {
  const productId = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
  const productList = Array.isArray(window.products) ? window.products : [];
  const product = productList.find((item) => item.id === productId);
  if (!product) return null;

  const quantityInput = document.getElementById('qtyInput');
  const qty = Math.max(1, parseInt(quantityInput?.value, 10) || 1);
  const activeColorDot = document.querySelector('.color-swatch-dot.active');
  const activeSizeSwatch = document.querySelector('.size-swatch.active');

  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.images?.[0] || '',
    qty,
    color: activeColorDot?.style.backgroundColor || null,
    size: activeSizeSwatch?.textContent?.trim() || null
  };
}

function saveCurrentProductToCart() {
  const cartItem = getCurrentProductCartItem();
  if (!cartItem) return null;

  const storedCart = JSON.parse(localStorage.getItem('prescot_cart')) || [];
  const existingIndex = storedCart.findIndex((item) =>
    item.id === cartItem.id &&
    item.color === cartItem.color &&
    item.size === cartItem.size
  );

  if (existingIndex > -1) {
    storedCart[existingIndex].qty = (storedCart[existingIndex].qty || 1) + cartItem.qty;
  } else {
    storedCart.push(cartItem);
  }

  cart = storedCart;
  localStorage.setItem('prescot_cart', JSON.stringify(storedCart));
  updateCartBadge();
  triggerCartIconAnimation();
  return cartItem;
}

function bindProductPurchaseActions() {
  const addButton = document.getElementById('addToCart');
  const buyButton = document.getElementById('buyItNow');

  if (addButton && addButton.dataset.purchaseActionBound !== 'true') {
    addButton.dataset.purchaseActionBound = 'true';
    addButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (addButton.classList.contains('is-added')) {
        window.openCartDrawer?.();
        return;
      }

      const cartItem = saveCurrentProductToCart();
      if (!cartItem) return;

      addButton.classList.add('is-added');
      addButton.setAttribute('aria-label', 'Przejdź do koszyka');
      const defaultLabel = addButton.querySelector('.btn-txt-default');
      const hoverLabel = addButton.querySelector('.btn-txt-hover');
      if (defaultLabel) defaultLabel.textContent = 'Dodano do koszyka';
      if (hoverLabel) {
        hoverLabel.innerHTML = '<i class="ph ph-shopping-cart-simple" aria-hidden="true" style="margin-right: 6px;"></i> Przejdź do koszyka';
      }

      showToast(`Dodano do koszyka: ${cartItem.qty} szt.`, 'cart');
      window.openCartDrawer?.();
    });
  }

  if (buyButton && buyButton.dataset.purchaseActionBound !== 'true') {
    buyButton.dataset.purchaseActionBound = 'true';
    buyButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const cartItem = saveCurrentProductToCart();
      if (!cartItem) return;
      window.location.assign('checkout.html');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindProductPurchaseActions);
} else {
  bindProductPurchaseActions();
}
window.bindProductPurchaseActions = bindProductPurchaseActions;

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

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    document.querySelectorAll('.config-bottom-nav .cart-badge, .mobile-bottom-nav .cart-badge').forEach((badge) => badge.remove());
  }

  // On mobile the quantity belongs only to the top-right cart icon.
  const cartBtns = document.querySelectorAll(isMobile
    ? '.mockup-header .mockup-actions a[aria-label="Koszyk"], .site-header .header-actions a[aria-label="Koszyk"], .config-header .header-actions a[aria-label="Koszyk"]'
    : 'a[href*="cart.html"]:not(.checkout-breadcrumbs a), .mockup-actions a[aria-label="Koszyk"], .cart-toggle');
  
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
    color: var(--accent-color, #0b1a30);
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

  #cartDrawer .cart-drawer-actions {
    display: flex !important;
    width: 100% !important;
    align-items: stretch !important;
    gap: 12px !important;
  }
  #cartDrawer .cart-drawer-actions > #cartDrawerGoToCart,
  #cartDrawer .cart-drawer-actions > #cartDrawerCheckout {
    flex: 1 1 0 !important;
    width: auto !important;
    min-width: 0 !important;
    height: 44px !important;
    min-height: 44px !important;
    max-height: 44px !important;
    margin: 0 !important;
    padding: 0 !important;
    align-self: stretch !important;
    transform: none !important;
  }
  #cartDrawer .cart-drawer-actions > #cartDrawerGoToCart:hover,
  #cartDrawer .cart-drawer-actions > #cartDrawerCheckout:hover {
    transform: none !important;
  }

  /* Shared premium footer refresh. */
  body .premium-footer {
    position: relative !important;
    isolation: isolate !important;
    overflow: hidden !important;
    margin-top: clamp(56px, 7vw, 104px) !important;
    padding: clamp(58px, 6vw, 82px) max(5%, calc((100vw - 1600px) / 2)) 30px !important;
    border-top: 0 !important;
    background:
      radial-gradient(circle at 8% 12%, rgba(232, 76, 35, 0.13), transparent 25%),
      radial-gradient(circle at 91% 9%, rgba(34, 211, 238, 0.09), transparent 24%),
      linear-gradient(145deg, #071321 0%, #0b1a30 52%, #0d223a 100%) !important;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06) !important;
  }
  body .premium-footer::before {
    content: '' !important;
    position: absolute !important;
    inset: 0 0 auto !important;
    z-index: 0 !important;
    height: 3px !important;
    background: linear-gradient(90deg, transparent 3%, #e84c23 22%, #f59e72 43%, rgba(34, 211, 238, 0.7) 70%, transparent 97%) !important;
  }
  body .premium-footer::after {
    content: '' !important;
    position: absolute !important;
    right: -110px !important;
    bottom: -170px !important;
    z-index: 0 !important;
    width: 420px !important;
    height: 420px !important;
    border: 1px solid rgba(255, 255, 255, 0.055) !important;
    border-radius: 50% !important;
    box-shadow:
      0 0 0 54px rgba(255, 255, 255, 0.018),
      0 0 0 108px rgba(255, 255, 255, 0.012) !important;
    pointer-events: none !important;
  }
  body .premium-footer .footer-grid,
  body .premium-footer .footer-bottom {
    position: relative !important;
    z-index: 1 !important;
    width: 100% !important;
    max-width: 1600px !important;
    margin-right: auto !important;
    margin-left: auto !important;
  }
  body .premium-footer .footer-grid {
    grid-template-columns: minmax(280px, 1.75fr) repeat(2, minmax(150px, 0.85fr)) minmax(240px, 1.25fr) !important;
    gap: clamp(28px, 4vw, 68px) !important;
    align-items: start !important;
    margin-bottom: 48px !important;
  }
  body .premium-footer .brand-col {
    padding: 28px !important;
    border: 1px solid rgba(255, 255, 255, 0.085) !important;
    border-radius: 20px !important;
    background: rgba(255, 255, 255, 0.035) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.14) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
  }
  body .premium-footer .footer-logo img {
    width: auto !important;
    height: 34px !important;
    margin-bottom: 20px !important;
    filter: drop-shadow(0 7px 18px rgba(0, 0, 0, 0.28)) !important;
  }
  body .premium-footer .brand-desc {
    max-width: 540px !important;
    margin-bottom: 24px !important;
    color: rgba(232, 239, 247, 0.68) !important;
    font-size: 14px !important;
    line-height: 1.75 !important;
  }
  body .premium-footer h3 {
    display: flex !important;
    align-items: center !important;
    gap: 9px !important;
    margin: 5px 0 22px !important;
    color: #ffffff !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    letter-spacing: 1.7px !important;
    line-height: 1.2 !important;
    text-transform: uppercase !important;
  }
  body .premium-footer h3::before {
    content: '' !important;
    display: block !important;
    width: 18px !important;
    height: 2px !important;
    flex: 0 0 18px !important;
    border-radius: 2px !important;
    background: #e84c23 !important;
    box-shadow: 0 0 10px rgba(232, 76, 35, 0.42) !important;
  }
  body .premium-footer ul li {
    margin-bottom: 11px !important;
  }
  body .premium-footer ul li a {
    position: relative !important;
    color: rgba(232, 239, 247, 0.66) !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 1.45 !important;
    transition: color 0.22s ease, transform 0.22s ease !important;
  }
  body .premium-footer ul li a::before {
    content: '›' !important;
    display: inline-block !important;
    width: 0 !important;
    overflow: hidden !important;
    color: #e84c23 !important;
    opacity: 0 !important;
    transition: width 0.22s ease, opacity 0.22s ease !important;
  }
  body .premium-footer ul li a:hover {
    padding-left: 0 !important;
    color: #ffffff !important;
    transform: translateX(3px) !important;
  }
  body .premium-footer ul li a:hover::before {
    width: 13px !important;
    opacity: 1 !important;
  }
  body .premium-footer .contact-info {
    display: grid !important;
    gap: 9px !important;
  }
  body .premium-footer .contact-info li {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    margin: 0 !important;
    padding: 10px 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.065) !important;
    border-radius: 11px !important;
    background: rgba(255, 255, 255, 0.027) !important;
    color: rgba(232, 239, 247, 0.72) !important;
    font-size: 13px !important;
    line-height: 1.45 !important;
  }
  body .premium-footer .contact-info i {
    flex: 0 0 auto !important;
    margin: 0 !important;
    color: #f07450 !important;
    font-size: 18px !important;
  }
  body .premium-footer .social-links {
    gap: 10px !important;
  }
  body .premium-footer .social-links a {
    width: 40px !important;
    height: 40px !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 12px !important;
    background: rgba(255, 255, 255, 0.055) !important;
    color: rgba(255, 255, 255, 0.82) !important;
    box-shadow: none !important;
  }
  body .premium-footer .social-links a:hover {
    border-color: rgba(232, 76, 35, 0.6) !important;
    background: #e84c23 !important;
    color: #ffffff !important;
    transform: translateY(-3px) !important;
  }
  body .premium-footer .footer-bottom {
    margin-bottom: 0 !important;
    padding-top: 24px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.09) !important;
    color: rgba(232, 239, 247, 0.46) !important;
  }
  body .premium-footer .footer-bottom p {
    margin: 0 !important;
    color: inherit !important;
    font-size: 12px !important;
    letter-spacing: 0.25px !important;
  }
  body .premium-footer .payment-methods {
    gap: 8px !important;
    color: rgba(255, 255, 255, 0.62) !important;
  }
  body .premium-footer .payment-methods i {
    display: inline-flex !important;
    width: 38px !important;
    height: 30px !important;
    align-items: center !important;
    justify-content: center !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 8px !important;
    background: rgba(255, 255, 255, 0.04) !important;
    font-size: 20px !important;
  }

  @keyframes prescotMobilePatternShimmer {
    0%, 100% {
      opacity: 0.9;
      filter: drop-shadow(0 0 2px rgba(232, 76, 35, 0.18));
    }
    50% {
      opacity: 1;
      filter: drop-shadow(0 0 7px rgba(232, 76, 35, 0.55));
    }
  }

  @media (max-width: 768px) {
    body .premium-footer {
      margin-top: 54px !important;
      margin-bottom: 0 !important;
      padding: 45px 18px calc(96px + env(safe-area-inset-bottom)) !important;
    }
    body .premium-footer .footer-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
      margin-bottom: 30px !important;
    }
    body .premium-footer .brand-col {
      padding: 22px !important;
      border-radius: 17px !important;
    }
    body .premium-footer h3 {
      margin: 0 !important;
      padding: 15px 2px !important;
      border-bottom-color: rgba(255, 255, 255, 0.09) !important;
    }
    body .premium-footer .footer-col.active h3 {
      color: #ffffff !important;
    }
    body .premium-footer .footer-col.active ul {
      max-height: 320px !important;
      margin: 5px 0 12px !important;
    }
    body .premium-footer .footer-bottom {
      gap: 15px !important;
      padding-top: 20px !important;
      text-align: center !important;
    }

    /* One predictable mobile header: logo on the left, cart on the right. */
    body .mockup-header {
      grid-template-columns: auto auto !important;
      justify-content: space-between !important;
    }
    body .mockup-header .mockup-actions,
    body .site-header .header-actions {
      display: flex !important;
      flex: 0 0 auto !important;
      width: auto !important;
      min-width: 44px !important;
      align-items: center !important;
      justify-content: flex-end !important;
      margin-left: auto !important;
      gap: 0 !important;
    }
    body .mockup-header .mockup-search-container,
    body .site-header .header-search,
    body .mockup-header .mockup-actions > button,
    body .mockup-header .mockup-actions > .wishlist-trigger,
    body .site-header .header-actions > button,
    body .site-header .header-actions > a:not([aria-label="Koszyk"]) {
      display: none !important;
    }
    body .mockup-header .mockup-actions > a[aria-label="Koszyk"],
    body .site-header .header-actions > a[aria-label="Koszyk"] {
      display: inline-flex !important;
      flex: 0 0 44px !important;
      width: 44px !important;
      height: 44px !important;
      min-width: 44px !important;
      min-height: 44px !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 !important;
      border-radius: 50% !important;
    }
    body .mockup-header:not(.scrolled) .mockup-actions > a[aria-label="Koszyk"],
    body .site-header:not(.scrolled) .header-actions > a[aria-label="Koszyk"] {
      color: #fff !important;
      border: 1px solid rgba(255, 255, 255, 0.78) !important;
      background: rgba(255, 255, 255, 0.08) !important;
      box-shadow: none !important;
    }
    body .mockup-header:not(.scrolled) .mockup-actions > a[aria-label="Koszyk"] svg,
    body .site-header:not(.scrolled) .header-actions > a[aria-label="Koszyk"] svg {
      color: #fff !important;
      fill: none !important;
      stroke: #fff !important;
    }
    body .mockup-header .mockup-actions > a[aria-label="Koszyk"]:hover,
    body .site-header .header-actions > a[aria-label="Koszyk"]:hover {
      color: #e84c23 !important;
      border-color: rgba(232, 76, 35, 0.72) !important;
      background: rgba(232, 76, 35, 0.09) !important;
      box-shadow: 0 0 0 3px rgba(232, 76, 35, 0.1) !important;
    }
    body .mockup-header .mockup-actions > a[aria-label="Koszyk"]:hover svg,
    body .site-header .header-actions > a[aria-label="Koszyk"]:hover svg {
      color: #e84c23 !important;
      stroke: #e84c23 !important;
    }

    /* Home hero: message card first, navigation arrows directly below it. */
    body .mockup-hero-slider .slide {
      padding-bottom: 174px !important;
    }
    body .mockup-hero-slider .hero-controls-bar {
      bottom: calc(72px + env(safe-area-inset-bottom) + 16px) !important;
    }

    /* Shared five-item mobile navigation. */
    body .config-bottom-nav {
      position: fixed !important;
      inset: auto 0 0 !important;
      z-index: 9999 !important;
      display: grid !important;
      grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
      width: 100% !important;
      height: calc(72px + env(safe-area-inset-bottom)) !important;
      padding: 5px 4px calc(5px + env(safe-area-inset-bottom)) !important;
      overflow: visible !important;
      border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
      background: rgba(6, 16, 28, 0.98) !important;
      box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.16) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
    }
    body .config-bottom-nav > a,
    body .config-bottom-nav > button {
      position: relative !important;
      display: flex !important;
      min-width: 0 !important;
      min-height: 0 !important;
      align-items: center !important;
      justify-content: center !important;
      flex-direction: column !important;
      gap: 3px !important;
      margin: 0 !important;
      padding: 3px 1px 2px !important;
      color: rgba(255, 255, 255, 0.55) !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      text-decoration: none !important;
      transform: none !important;
    }
    body .config-bottom-nav .mobile-bottom-icon {
      display: inline-flex !important;
      width: 25px !important;
      height: 25px !important;
      min-width: 25px !important;
      min-height: 25px !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: transparent !important;
      color: inherit !important;
      box-shadow: none !important;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s ease !important;
    }
    body .config-bottom-nav .mobile-bottom-icon i {
      margin: 0 !important;
      font-size: 21px !important;
      line-height: 1 !important;
    }
    body .config-bottom-nav .mobile-bottom-label {
      position: static !important;
      display: flex !important;
      height: 12px !important;
      align-items: center !important;
      justify-content: center !important;
      top: 0 !important;
      font-size: clamp(9px, 2.55vw, 10.5px) !important;
      font-weight: 650 !important;
      letter-spacing: 0.02em !important;
      line-height: 12px !important;
      text-transform: none !important;
      white-space: nowrap !important;
      transform: none !important;
      transition: color 0.2s ease !important;
    }
    body .config-bottom-nav > .active {
      color: #fff !important;
    }
    body .config-bottom-nav > .active:not(.mobile-home-link) .mobile-bottom-icon {
      width: 34px !important;
      height: 34px !important;
      min-width: 34px !important;
      min-height: 34px !important;
      margin-top: -11px !important;
      color: #e84c23 !important;
      border: 2px solid #e84c23 !important;
      background: #10233a !important;
      box-shadow: 0 0 15px rgba(232, 76, 35, 0.24) !important;
    }
    body .config-bottom-nav > a:hover,
    body .config-bottom-nav > button:hover {
      transform: none !important;
    }
    body .config-bottom-nav > a:hover .mobile-bottom-icon,
    body .config-bottom-nav > button:hover .mobile-bottom-icon {
      transform: translateY(-3px) !important;
    }
    body .config-bottom-nav > a:hover .mobile-bottom-label,
    body .config-bottom-nav > button:hover .mobile-bottom-label {
      top: 0 !important;
      transform: none !important;
    }
    body .config-bottom-nav .cart-badge,
    body .mobile-bottom-nav .cart-badge {
      display: none !important;
    }
    body .config-bottom-nav .mobile-home-pattern {
      display: block !important;
      width: 29px !important;
      height: 22px !important;
      object-fit: contain !important;
      object-position: center !important;
      overflow: visible !important;
      animation: prescotMobilePatternShimmer 3.2s ease-in-out infinite !important;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }
    body .config-bottom-nav > .mobile-home-link .mobile-bottom-icon {
      width: 29px !important;
      height: 29px !important;
      min-width: 29px !important;
      min-height: 29px !important;
    }
    body .config-bottom-nav > .mobile-home-link.active .mobile-bottom-icon {
      width: 29px !important;
      height: 29px !important;
      min-width: 29px !important;
      min-height: 29px !important;
      margin-top: -2px !important;
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    body .config-bottom-nav > .mobile-home-link.active .mobile-home-pattern {
      transform: scale(1.13) !important;
    }
    body .config-bottom-nav > a:hover .mobile-bottom-icon,
    body .config-bottom-nav > button:hover .mobile-bottom-icon {
      transform: scale(1.06) !important;
    }
  }

  @media (max-width: 600px) {
    body .mockup-hero-slider .slide {
      padding-right: 10px !important;
      padding-bottom: 164px !important;
      padding-left: 10px !important;
    }
    body .mockup-hero-slider .slide-banner-box {
      width: 100% !important;
      max-width: 480px !important;
    }
    body .mockup-hero-slider .slide-banner-box p {
      margin-top: 7px !important;
    }
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    body .mockup-hero-slider .slide {
      padding-bottom: 210px !important;
    }
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
      
      <!-- Drawer Footer -->
      <div style="padding: 25px; border-top: 1px solid #eee; background: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <span style="font-size: 16px; font-weight: 700; color: #1a1a1a;">Razem:</span>
          <span id="cartDrawerTotal" style="font-size: 20px; font-weight: 700; color: #1a1a1a;">0,00 zł</span>
        </div>
        <p style="font-size: 11px; color: #777; margin: 0 0 20px 0;">Podatki i koszt dostawy obliczane przy kasie</p>
        
        <div class="cart-drawer-actions">
          <button id="cartDrawerGoToCart" class="add-to-cart-btn" type="button" aria-label="Zwiń koszyk" style="flex: 1 1 0; width: auto; height: 44px; min-height: 44px; margin: 0; padding: 0; font-size: 13px;">
            <span class="btn-slide-wrap">
              <span class="btn-txt-default">Powrót</span>
              <span class="btn-txt-hover">Zamknij koszyk</span>
            </span>
          </button>
          <button id="cartDrawerCheckout" class="buy-it-now-btn" onclick="window.location.href='checkout.html'" style="flex: 1 1 0; width: auto; height: 44px; min-height: 44px; margin: 0; padding: 0; font-size: 13px;">
            <span class="btn-slide-wrap">
              <span class="btn-txt-default">Do kasy</span>
              <span class="btn-txt-hover">Płatność</span>
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- No Cart Drawer Overlay -->
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
          border-color: var(--accent-color, #0b1a30);
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
          color: var(--accent-color, #0b1a30);
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
            <div id="qvCategory" style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #0b1a30; font-weight: 600; margin-bottom: 10px;"></div>
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
      color: #0b1a30 !important;
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
      border-color: #0b1a30;
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
        openCart();
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
  }

  window.openCartDrawer = openCart;

  function closeCart() {
    cartDrawer.style.right = '-450px';
  }

  window.closeCartDrawer = closeCart;

  if (closeCartDrawer) closeCartDrawer.addEventListener('click', closeCart);

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

  // Collapse the drawer and return to the page.
  const goToCartBtn = document.getElementById('cartDrawerGoToCart');
  if (goToCartBtn) {
    goToCartBtn.addEventListener('click', closeCart);
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

    if (typeof products === 'undefined') {
      recContainer.style.display = 'none';
      return;
    }

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
    document.getElementById('qvDesc').innerHTML = selectedProduct.description;

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
      openCart();
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
      e.stopImmediatePropagation();

      if (addCartBtn.classList.contains('is-added')) {
        if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
        return;
      }

      const pId = parseInt(addCartBtn.dataset.id);
      const p = products.find(prod => prod.id === pId);
      if (!p) return;

      const cartItem = {
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.images[0],
        qty: 1,
        color: p.colors?.[0] || null,
        size: p.sizes?.[0] || null
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

      addCartBtn.classList.add('is-added');
      addCartBtn.setAttribute('aria-label', 'Przejdź do koszyka');
      const defaultLabel = addCartBtn.querySelector('.btn-txt-default');
      const hoverLabel = addCartBtn.querySelector('.btn-txt-hover');
      if (defaultLabel) defaultLabel.textContent = 'Dodano do koszyka';
      if (hoverLabel) hoverLabel.innerHTML = '<i class="ph ph-shopping-cart-simple" aria-hidden="true" style="margin-right: 6px;"></i> Przejdź do koszyka';
      openCart();
      return;
    }

    // 2. Buy directly from a catalog or AI recommendation card
    const quickBuyBtn = e.target.closest('.catalog-quick-buy-btn');
    if (quickBuyBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const pId = parseInt(quickBuyBtn.dataset.id);
      const p = products.find(prod => prod.id === pId);
      if (!p) return;

      const cartItem = {
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.images[0],
        qty: 1,
        color: p.colors?.[0] || null,
        size: p.sizes?.[0] || null
      };
      const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size);
      if (existingIndex > -1) {
        cart[existingIndex].qty++;
      } else {
        cart.push(cartItem);
      }

      updateLocalStorage();
      window.dispatchEvent(new Event('storage'));
      window.location.assign('checkout.html');
      return;
    }

    // 3. Quick view (eye icon)
    const eyeBtn = e.target.closest('.qv-eye-btn');
    if (eyeBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(parseInt(eyeBtn.dataset.id), 'normal');
      return;
    }

    // 4. 3D view
    const tdBtn = e.target.closest('.qv-3d-btn');
    if (tdBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(parseInt(tdBtn.dataset.id), '3d');
      return;
    }

    // 5. 360 view
    const sxtyBtn = e.target.closest('.qv-360-btn');
    if (sxtyBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(parseInt(sxtyBtn.dataset.id), '360');
      return;
    }

    // 5. Product card click (navigate to details)
    const card = e.target.closest('.mockup-product-card');
    if (card && !e.target.closest('.action-btn-circle') && !e.target.closest('a') && !e.target.closest('button')) {
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
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '/sklepSC/' || window.location.pathname === '/sklepSC/index.html') {
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
    <div id="mobileCategoriesDrawer" class="mobile-category-drawer" role="dialog" aria-modal="true" aria-labelledby="mobileCategoryTitle" aria-hidden="true" hidden>
      <div class="mobile-category-content">
        <h2 id="mobileCategoryTitle" style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #0b1a30; font-family: 'Outfit', sans-serif;">Kategorie produktów</h2>
        <p class="mobile-category-intro">Wejdź przez rodzinę produktu albo od razu zawęź katalog po technologii.</p>
        <nav class="mobile-category-list" aria-label="Rodziny produktów">
          <a href="shop.html?category=Ta%C5%9Bmy%20LED"><img src="images/hero_cob.webp" alt="" loading="lazy"><span><small>01 · Źródła światła</small><strong>Taśmy LED</strong><em>COB, SMD, mono, CCT, RGB i systemy 48 V</em></span><b aria-hidden="true">→</b></a>
          <a href="shop.html?category=Sterowniki%20LED"><img src="images/banner_controllers.webp" alt="" loading="lazy"><span><small>02 · Kontrola</small><strong>Sterowniki LED</strong><em>MONO, CCT, RGB, RGBW, pilot i Wi‑Fi</em></span><b aria-hidden="true">→</b></a>
          <a href="shop.html?category=Zasilacze%20LED%20Scharfer"><img src="images/banner_scharfer.webp" alt="" loading="lazy"><span><small>03 · Zasilanie</small><strong>Zasilacze Scharfer</strong><em>12 V i 24 V · dobór mocy z rezerwą</em></span><b aria-hidden="true">→</b></a>
          <a href="shop.html?category=Akcesoria%20do%20ta%C5%9Bm%20LED%20i%20zasilaczy"><img src="images/okladka-produkty.webp" alt="" loading="lazy"><span><small>04 · Montaż</small><strong>Akcesoria systemowe</strong><em>Złącza, przewody i elementy instalacyjne</em></span><b aria-hidden="true">→</b></a>
          <a href="shop.html?category=Koszulki%20silikonowe%20PRO"><span class="category-material-visual" aria-hidden="true"><i></i></span><span><small>05 · Ochrona</small><strong>Koszulki silikonowe PRO</strong><em>Osłona i uszczelnienie taśmy LED</em></span><b aria-hidden="true">→</b></a>
        </nav>
        <section class="mobile-tech-shortcuts" aria-labelledby="mobileTechTitle"><span id="mobileTechTitle">Technologie taśm</span><div><a href="shop.html?q=COB">COB</a><a href="shop.html?q=SMD">SMD</a><a href="shop.html?q=CCT">CCT</a><a href="shop.html?q=RGB">RGB / RGBW</a><a href="shop.html?q=48V">48 V</a></div></section>
        <a class="mobile-configurator-entry" href="configurator.html"><span><small>Nie znasz parametrów?</small><strong>Dobierz kompletny system LED</strong></span><b aria-hidden="true">Rozpocznij →</b></a>
      </div>
    </div>
  `;
  if (!document.getElementById('mobileCategoriesDrawer')) {
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  }
  upgradeMobileCommerceNavigation();
  setTimeout(upgradeMobileCommerceNavigation, 0);
}

function upgradeMobileCommerceNavigation() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const icon = (content) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`;
  const homePatternIcon = '<img class="mobile-home-pattern" src="images/PRESCOT_pattern2.svg" alt="" aria-hidden="true">';
  const entries = [
    { label: 'Home', href: 'index.html', active: path === '' || path === 'index.html', icon: icon('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>') },
    { label: 'Kategorie', action: true, onClick: 'openMobileCategories()', active: false, icon: icon('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>') },
    { label: 'Dobierz', href: 'configurator.html', active: path === 'configurator.html', icon: icon('<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>') },
    { label: 'Zakup AI', href: 'ai-shopping.html', active: path === 'ai-shopping.html', icon: icon('<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>') }
  ];
  const markup = entries.map((entry) => entry.action
    ? `<button class="mobile-nav-item ${entry.active ? 'active' : ''}" type="button" onclick="${entry.onClick}">${entry.icon}<span>${entry.label}</span></button>`
    : `<a class="mobile-nav-item ${entry.active ? 'active' : ''}" href="${entry.href}">${entry.icon}<span>${entry.label}</span></a>`
  ).join('');
  document.querySelectorAll('.mobile-nav-items').forEach((navigation) => { navigation.innerHTML = markup; });

  const bottomEntries = [
    {
      label: 'Start',
      href: 'index.html',
      active: path === '' || path === 'index.html',
      className: 'mobile-home-link',
      icon: homePatternIcon
    },
    {
      label: 'Sklep',
      href: 'shop.html',
      active: ['shop.html', 'product.html', 'cart.html', 'checkout.html'].includes(path),
      icon: '<i class="ph ph-shopping-cart-simple" aria-hidden="true"></i>'
    },
    {
      label: 'Zakup AI',
      href: 'ai-shopping.html',
      active: path === 'ai-shopping.html',
      icon: '<i class="ph ph-sparkle" aria-hidden="true"></i>'
    },
    {
      label: 'O nas',
      href: 'about.html',
      active: path === 'about.html',
      icon: '<i class="ph ph-buildings" aria-hidden="true"></i>'
    },
    {
      label: 'Kontakt',
      href: 'contact.html',
      active: path === 'contact.html',
      icon: '<i class="ph ph-headset" aria-hidden="true"></i>'
    }
  ];
  const bottomMarkup = bottomEntries.map((entry) => {
    const content = `<span class="mobile-bottom-icon">${entry.icon}</span>
      <span class="mobile-bottom-label">${entry.label}</span>`;
    const className = `${entry.active ? 'active ' : ''}${entry.className || ''}`;
    return entry.action
      ? `<button class="${className}" type="button" onclick="${entry.onClick}">${content}</button>`
      : `<a class="${className}" href="${entry.href}">${content}</a>`;
  }).join('');
  const bottomNavigations = document.querySelectorAll('.config-bottom-nav');
  bottomNavigations.forEach((navigation) => {
    navigation.innerHTML = bottomMarkup;
  });
  if (bottomNavigations.length) {
    document.documentElement.classList.add('mobile-nav-ready');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', upgradeMobileCommerceNavigation);
} else {
  upgradeMobileCommerceNavigation();
}

// Bind drawer functions to global window scope
window.openMobileCategories = function() {
  const drawer = document.getElementById('mobileCategoriesDrawer');
  if (drawer) {
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mobile-categories-open');
    document.querySelector('.site-header')?.classList.add('menu-active');
    requestAnimationFrame(() => drawer.classList.add('is-open'));
  }
};

window.closeMobileCategories = function() {
  const drawer = document.getElementById('mobileCategoriesDrawer');
  if (drawer) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-categories-open');
    document.querySelector('.site-header')?.classList.remove('menu-active');
    setTimeout(() => {
      drawer.hidden = true;
    }, 280);
  }
};

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.getElementById('mobileCategoriesDrawer')?.classList.contains('is-open')) {
    window.closeMobileCategories();
  }
});

window.toggleMobileCatRow = function(row) {
  row.classList.toggle('show-description');
};


window.initSharedPopups = initSharedPopups;



// Global Header Search Listener
function initGlobalHeaderSearch() {
  const headerSearchInput = document.getElementById('headerSearchInput');
  const headerSearchBtn = document.getElementById('headerSearchBtn');

  function doSearch() {
    if (!headerSearchInput) return;
    const query = headerSearchInput.value.trim();
    if (query) {
      window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
  }

  if (headerSearchBtn) {
    headerSearchBtn.onclick = (e) => {
      e.preventDefault();
      doSearch();
    };
  }

  if (headerSearchInput) {
    headerSearchInput.onkeypress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSearch();
      }
    };
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalHeaderSearch);
} else {
  initGlobalHeaderSearch();
}


// --- GLOBAL PRODUCT INQUIRY MODAL (Zapytaj o produkt) ---
function openInquiryModal(presetText = '') {
  let modal = document.getElementById('popupZapytaj');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'product-popup-overlay';
    modal.id = 'popupZapytaj';
    modal.style.cssText = 'display:none; z-index: 99999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(11, 26, 48, 0.7); backdrop-filter: blur(8px); justify-content: center; align-items: center;';
    modal.innerHTML = `
      <div class="product-popup-box" style="max-width: 520px; width: 90%; background: #ffffff; border-radius: 24px; padding: 32px; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.25);">
        <button class="popup-close" onclick="document.getElementById('popupZapytaj').style.display='none'" style="position: absolute; top: 20px; right: 20px; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; color: #0b1a30; font-weight: 700;">✕</button>
        <div style="font-size: 11px; font-weight: 800; color: #0b1a30; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Wycena Indywidualna</div>
        <h3 style="margin-bottom: 8px; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 22px; color: #0b1a30;">Zapytaj o produkt / ofertę</h3>
        <p style="font-size: 13.5px; color: #64748b; margin-bottom: 20px; line-height: 1.4;">Nasi specjaliści przygotują wycenę indywidualną taśmy LED i dedykowanego zasilacza.</p>
        <form id="askQuestionForm" onsubmit="return submitProductInquiry(event);">
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 5px; color: #0b1a30;">Twoje Imię i Nazwisko</label>
            <input type="text" required style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13.5px; font-family: inherit; outline: none;" placeholder="np. Jan Kowalski">
          </div>
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 5px; color: #0b1a30;">Twój Adres E-mail</label>
            <input type="email" required style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13.5px; font-family: inherit; outline: none;" placeholder="np. jan@example.com">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 5px; color: #0b1a30;">Preferencje i treść zapytania</label>
            <textarea id="askQuestionTextarea" required style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; height: 130px; font-family: inherit; resize: vertical; outline: none; line-height: 1.4;" placeholder="Opisz swoje wymagania..."></textarea>
          </div>
          <button type="submit" class="inquiry-submit-btn">
            <span class="btn-slide-wrap">
              <span class="btn-txt-default">Wyślij zapytanie</span>
              <span class="btn-txt-hover">Wyślij</span>
            </span>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }
  const textarea = modal.querySelector('#askQuestionTextarea');
  if (textarea && presetText) {
    textarea.value = presetText;
  }
  modal.style.display = 'flex';
}
window.openInquiryModal = openInquiryModal;

function submitProductInquiry(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.querySelector('input[type="text"]')?.value.trim() || '';
  const email = form.querySelector('input[type="email"]')?.value.trim() || '';
  const message = form.querySelector('textarea')?.value.trim() || '';
  const productTitle = document.getElementById('pTitle')?.textContent.trim() || 'ofertę Prescot LED';
  const subject = `Zapytanie o produkt: ${productTitle}`;
  const body = [
    `Imię i nazwisko: ${name}`,
    `E-mail: ${email}`,
    `Produkt: ${productTitle}`,
    `Link: ${window.location.href}`,
    '',
    message
  ].join('\n');

  const modal = document.getElementById('popupZapytaj');
  if (modal) modal.style.display = 'none';
  window.location.href = `mailto:sekretariat@prescot.pl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (typeof window.showToast === 'function') {
    window.showToast('Otwieramy zapytanie do sekretariatu.', 'info');
  }
  return false;
}
window.submitProductInquiry = submitProductInquiry;

window.addEventListener('DOMContentLoaded', () => {
  if (window.location.search.includes('cart=open')) {
    setTimeout(() => {
      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }
    }, 200);
  }
});
