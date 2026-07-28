(function () {
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  if (!mobileQuery.matches) return;

  const root = document.documentElement;
  const transitionKey = 'prescot_mobile_page_transition';
  let navigationTimer = null;

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
