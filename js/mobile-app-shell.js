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
      pointer-events: auto !important;
      transform: translate3d(0, 0, 0) !important;
      transition:
        opacity 0.2s ease,
        transform 0.32s cubic-bezier(0.22, 1, 0.36, 1) !important;
      will-change: transform;
    }
    html.mobile-nav-ready.mobile-bottom-nav-hidden .config-bottom-nav {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translate3d(0, calc(100% + 12px), 0) !important;
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
      z-index: 2147482999;
      width: 126px;
      height: 90px;
      background-image: url("images/PRESCOT_pattern2.svg");
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      content: "";
      opacity: 0;
      pointer-events: none;
      filter: drop-shadow(0 10px 24px rgba(232, 76, 35, 0.2));
      transform: translate(-50%, -50%) scale(0.9);
      transition: opacity 0.18s ease, transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
    }
    html.mobile-app-arriving::after,
    html.mobile-app-leaving::after {
      opacity: 1;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    html.mobile-app-leaving::after {
      background: rgba(11, 26, 48, 0.14);
    }
    html.mobile-app-arriving::before,
    html.mobile-app-leaving::before {
      opacity: 0.68;
      transform: translate(-50%, -50%) scale(1);
      animation: mobilePrescotPatternBreath 0.85s ease-in-out infinite alternate;
    }
    @keyframes mobilePrescotPatternBreath {
      from {
        opacity: 0.46;
        transform: translate(-50%, -50%) scale(0.94);
      }
      to {
        opacity: 0.72;
        transform: translate(-50%, -50%) scale(1.03);
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

  let previousScrollY = Math.max(0, window.scrollY);
  let accumulatedScroll = 0;
  let previousDirection = 0;
  let scrollFramePending = false;

  function setBottomNavigationHidden(hidden) {
    root.classList.toggle('mobile-bottom-nav-hidden', hidden);
  }

  function updateBottomNavigationVisibility() {
    scrollFramePending = false;

    const currentScrollY = Math.max(0, window.scrollY);
    const scrollDifference = currentScrollY - previousScrollY;
    const direction = Math.sign(scrollDifference);

    if (currentScrollY <= 28) {
      setBottomNavigationHidden(false);
      accumulatedScroll = 0;
      previousDirection = 0;
      previousScrollY = currentScrollY;
      return;
    }

    if (direction && direction !== previousDirection) {
      accumulatedScroll = 0;
    }

    if (direction) {
      accumulatedScroll += scrollDifference;
      previousDirection = direction;
    }

    if (currentScrollY > 112 && accumulatedScroll > 20) {
      setBottomNavigationHidden(true);
      accumulatedScroll = 0;
    } else if (accumulatedScroll < -12) {
      setBottomNavigationHidden(false);
      accumulatedScroll = 0;
    }

    previousScrollY = currentScrollY;
  }

  window.addEventListener('scroll', function () {
    if (scrollFramePending) return;
    scrollFramePending = true;
    requestAnimationFrame(updateBottomNavigationVisibility);
  }, { passive: true });

  window.addEventListener('pageshow', function () {
    previousScrollY = Math.max(0, window.scrollY);
    setBottomNavigationHidden(previousScrollY > 112);
  });

  window.addEventListener('resize', function () {
    if (window.scrollY <= 28) setBottomNavigationHidden(false);
  }, { passive: true });

  const prefetchedPages = new Set();

  function prefetchTouchedPage(event) {
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.href === window.location.href || prefetchedPages.has(destination.href)) {
      return;
    }

    prefetchedPages.add(destination.href);
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.as = 'document';
    prefetch.href = destination.href;
    prefetch.fetchPriority = 'low';
    document.head.appendChild(prefetch);
  }

  document.addEventListener('touchstart', prefetchTouchedPage, { passive: true, capture: true });
  document.addEventListener('pointerover', prefetchTouchedPage, { passive: true, capture: true });

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

    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 90;
    navigationTimer = window.setTimeout(function () {
      window.location.assign(destination.href);
    }, delay);
  });
})();
