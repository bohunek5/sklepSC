(function () {
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  if (!mobileQuery.matches) return;

  const root = document.documentElement;
  const transitionKey = 'prescot_mobile_page_transition';
  let navigationTimer = null;

  const shellStyles = document.createElement('style');
  shellStyles.id = 'mobileAppShellCriticalStyles';
  shellStyles.textContent = `
    html:not(.mobile-nav-ready) .config-bottom-nav {
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
    html.mobile-nav-ready .config-bottom-nav {
      visibility: visible !important;
      opacity: 1 !important;
      transition: opacity 0.2s ease !important;
    }
    html.mobile-app-shell::after {
      position: fixed;
      inset: 0;
      z-index: 2147483000;
      background: rgba(244, 246, 249, 0.18);
      content: "";
      opacity: 0;
      pointer-events: none;
      backdrop-filter: blur(0);
      -webkit-backdrop-filter: blur(0);
      transition: opacity 0.22s ease, backdrop-filter 0.22s ease, -webkit-backdrop-filter 0.22s ease;
    }
    html.mobile-app-shell::before {
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 2147483001;
      width: 48px;
      height: 48px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 15px;
      background: #0b1a30 url("images/prescot-pattern.png") center / 26px 26px no-repeat;
      box-shadow: 0 16px 38px rgba(6, 16, 28, 0.22);
      content: "";
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, -44%) scale(0.88);
      transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    html.mobile-app-arriving::after,
    html.mobile-app-leaving::after {
      opacity: 1;
      backdrop-filter: blur(9px);
      -webkit-backdrop-filter: blur(9px);
    }
    html.mobile-app-leaving::after {
      background: rgba(11, 26, 48, 0.2);
    }
    html.mobile-app-leaving::before {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      animation: mobilePrescotLoader 0.9s ease-in-out infinite alternate;
    }
    @keyframes mobilePrescotLoader {
      from {
        box-shadow: 0 14px 34px rgba(6, 16, 28, 0.2), 0 0 0 0 rgba(232, 76, 35, 0.08);
      }
      to {
        box-shadow: 0 18px 42px rgba(6, 16, 28, 0.28), 0 0 0 8px rgba(232, 76, 35, 0.12);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      html.mobile-app-shell::after,
      html.mobile-app-shell::before,
      html.mobile-nav-ready .config-bottom-nav {
        transition-duration: 0.01ms !important;
        animation: none !important;
      }
    }
  `;
  (document.head || root).appendChild(shellStyles);

  root.classList.add('mobile-app-shell');

  try {
    if (sessionStorage.getItem(transitionKey) === '1') {
      root.classList.add('mobile-app-arriving');
      sessionStorage.removeItem(transitionKey);
    }
  } catch (error) {
    // The transition remains optional when storage is unavailable.
  }

  function revealPage() {
    window.setTimeout(function () {
      requestAnimationFrame(function () {
        root.classList.remove('mobile-app-arriving', 'mobile-app-leaving');
      });
    }, 90);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealPage, { once: true });
  } else {
    revealPage();
  }

  window.addEventListener('pageshow', revealPage);

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    const sameDocument = destination.pathname === window.location.pathname
      && destination.search === window.location.search;
    if (sameDocument) {
      if (destination.hash) return;
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
      return;
    }

    event.preventDefault();
    if (navigationTimer) return;

    root.classList.add('mobile-app-leaving');

    try {
      sessionStorage.setItem(transitionKey, '1');
    } catch (error) {
      // Continue with the visual transition even without storage.
    }

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 170;
    navigationTimer = window.setTimeout(function () {
      window.location.assign(destination.href);
    }, delay);
  });
})();
