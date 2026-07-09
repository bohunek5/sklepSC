import { products } from './products-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('mobile-app-root');
  if (!root) return;

  // Render HTML structure
  root.innerHTML = `
    <!-- Mobile Header -->
    <header class="m-header">
      <div class="m-logo">
        <img src="/images/logo-dark.png" alt="Prescot LED">
      </div>
      <div>
        <a href="tel:+48877776482" style="color:var(--accent-color); font-weight:700; text-decoration:none;">
          <i class="ph ph-phone"></i> Zadzwoń
        </a>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="m-main">
      
      <!-- HOME VIEW -->
      <div id="m-view-home" class="m-view active">
        <div class="m-hero">
          <div class="m-hero-video-wrapper">
            <!-- Using the Prescot LED AR/3D video as hero background -->
            <video src="/videos/cct_salon.mp4" autoplay loop muted playsinline style="width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; object-fit: cover;"></video>
          </div>
          <div class="m-hero-overlay"></div>
          
          <div class="m-hero-content">
            <h1 class="m-hero-title">
              Innowacje w oświetleniu.<br>
              <span>Prescot LED</span><br>
              Dla profesjonalistów.
            </h1>
            <p class="m-hero-desc">
              Najwyższej jakości sterowniki, zasilacze i taśmy LED. Zobacz nasze produkty w przestrzeni 3D i AR. Niezawodność potwierdzona gwarancją.
            </p>
            
            <button class="m-btn-primary" onclick="window.switchMobileTab('oferta')">
              Przeglądaj Sklep B2B
            </button>
            <button class="m-btn-outline" onclick="window.switchMobileTab('info')">
              Poznaj Technologie
            </button>

            <div class="m-trust-bar">
              <div class="m-trust-item">
                <span class="m-trust-val">5</span>
                <span class="m-trust-lbl">Lat Gwarancji</span>
              </div>
              <div class="m-trust-item">
                <span class="m-trust-val">3D</span>
                <span class="m-trust-lbl">Modele AR</span>
              </div>
              <div class="m-trust-item">
                <span class="m-trust-val">100%</span>
                <span class="m-trust-lbl">Niezawodność</span>
              </div>
            </div>
          </div>
        </div>

        <div class="m-section">
          <h2 class="m-section-title">Technologia Prescot LED</h2>
          <p class="m-section-desc">Odkryj innowacje i zabezpieczenia, które sprawiają, że nasze systemy są najczęstszym wyborem profesjonalistów w branży oświetleniowej i B2B.</p>

          <!-- Feature 1 -->
          <div class="m-feature-card">
            <img src="/images/products/controller_rgbw.webp" alt="Sterowniki LED">
            <div class="m-feature-content">
              <h3 class="m-feature-title">Inteligentne Sterowanie</h3>
              <p class="m-feature-text">Poznaj naszą gamę sterowników Mono, CCT, RGB i RGBW. Płynna regulacja z zasięgiem do 30m.</p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="m-feature-card">
            <img src="/images/products/scharfer_100w.webp" alt="Zasilacze 100W">
            <div class="m-feature-content">
              <h3 class="m-feature-title">Praca pod 100% obciążeniem</h3>
              <p class="m-feature-text">Koniec z przewymiarowaniem zasilaczy! W przeciwieństwie do tańszych zamienników, nasza technologia pozwala na stałą pracę pod 100% zadeklarowanym obciążeniem.</p>
            </div>
          </div>
          
          <!-- Feature 3 -->
          <div class="m-feature-card">
            <img src="/images/products/tasma_4000k.webp" alt="Taśmy LED">
            <div class="m-feature-content">
              <h3 class="m-feature-title">Taśmy Premium z CRI>80</h3>
              <p class="m-feature-text">Profesjonalne taśmy LED Delux Pro o wysokim strumieniu świetlnym i wieloletniej gwarancji producenta.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- OFERTA VIEW -->
      <div id="m-view-oferta" class="m-view">
        <div class="m-section bg-light" style="padding-top: 20px;">
          <h2 class="m-section-title" style="text-align: left; margin-bottom: 20px;">Wszystkie Produkty</h2>
          <div class="m-product-grid" id="m-products-container">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>

      <!-- INFO VIEW -->
      <div id="m-view-info" class="m-view">
        <div class="m-section">
          <h2 class="m-section-title">O Prescot</h2>
          <p class="m-section-desc">Jesteśmy wiodącym dostawcą profesjonalnych rozwiązań oświetleniowych LED w Polsce.</p>
          
          <div style="background:#fafafa; padding:20px; border-radius:12px; margin-bottom:20px;">
            <h3 style="margin-bottom:10px; font-family:'Outfit';">Współpraca B2B</h3>
            <p style="font-size:0.9rem; color:#555; line-height:1.5; margin-bottom:15px;">
              Oferujemy dedykowane warunki handlowe, rabaty hurtowe oraz wsparcie projektowe dla instalatorów, architektów i hurtowni.
            </p>
            <button class="m-btn-primary" onclick="window.location.href='mailto:komponenty@prescot.pl'">Napisz do nas</button>
          </div>
          
          <img src="/images/office-mock.webp" style="width:100%; border-radius:12px;" onerror="this.style.display='none'">
        </div>
      </div>

    </main>

    <!-- Bottom Navigation -->
    <nav class="m-bottom-nav">
      <a href="#home" class="m-nav-item active" onclick="window.switchMobileTab('home'); return false;">
        <i class="ph ph-house"></i>
        Home
      </a>
      <a href="#oferta" class="m-nav-item" onclick="window.switchMobileTab('oferta'); return false;">
        <i class="ph ph-shopping-bag"></i>
        Sklep B2B
      </a>
      <a href="#info" class="m-nav-item" onclick="window.switchMobileTab('info'); return false;">
        <i class="ph ph-lightbulb"></i>
        Technologie
      </a>
      <a href="#kontakt" class="m-nav-item" onclick="window.location.href='/contact.html'; return false;">
        <i class="ph ph-envelope"></i>
        Kontakt
      </a>
    </nav>
  `;

  // Render products
  const pContainer = document.getElementById('m-products-container');
  if (pContainer) {
    products.forEach(p => {
      const img = p.images && p.images[0] ? p.images[0] : '/images/placeholder.png';
      pContainer.insertAdjacentHTML('beforeend', `
        <div class="m-product-card" onclick="window.location.href='/product.html?id=${p.id}'">
          <img src="${img}" alt="${p.title}">
          <div class="m-product-card-body">
            <div class="m-product-cat">${p.category || 'Inne'}</div>
            <div class="m-product-title">${p.title}</div>
            <div class="m-product-price">${p.price.toFixed(2)} PLN</div>
          </div>
        </div>
      `);
    });
  }
});

// Global tab switcher
window.switchMobileTab = function(tabId) {
  // Update nav items
  document.querySelectorAll('.m-nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.querySelector(`.m-nav-item[href="#${tabId}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Update views
  document.querySelectorAll('.m-view').forEach(el => el.classList.remove('active'));
  const activeView = document.getElementById(`m-view-${tabId}`);
  if (activeView) {
    activeView.classList.add('active');
    window.scrollTo(0, 0);
  }
};
