document.addEventListener('DOMContentLoaded', () => {
  const fabButton = document.getElementById('mobileFabFilterBtn');
  const filterContainer = document.getElementById('advancedFilterContainer');
  const filterBackdrop = document.getElementById('filterBackdrop');
  const closeButton = document.getElementById('closeFilterSheetBtn');
  const applyButton = document.getElementById('applyFiltersBtn');
  const activeChipsContainer = document.getElementById('activeChipsContainer');
  const fabFilterCount = document.getElementById('fabFilterCount');
  const toggleButtons = [...document.querySelectorAll('.pro-toggle-switch .toggle-btn')];
  const proToggle = document.getElementById('proToggleSwitch');
  const b2cSection = document.getElementById('b2cFilters');
  const b2bSection = document.getElementById('b2bFilters');
  const filterPills = [...document.querySelectorAll(
    '.advanced-filter-container .filter-pill, .advanced-filter-container .color-swatch-btn, .advanced-filter-container .svg-filter-btn'
  )];

  const activeFilters = {
    room: null,
    expect: null,
    voltage: null,
    color: null,
    pcb: null,
    profile: null,
    price: null
  };

  const params = new URLSearchParams(window.location.search);
  let currentMode = ['pro', 'b2b'].includes(params.get('mode')) ? 'b2b' : 'b2c';

  Object.keys(activeFilters).forEach((key) => {
    const value = params.get(key);
    if (value) activeFilters[key] = value;
  });

  function setSheetState(open) {
    filterContainer?.classList.toggle('active', open);
    filterBackdrop?.classList.toggle('active', open);
    filterContainer?.setAttribute('aria-hidden', String(!open));
    fabButton?.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('filter-sheet-open', open);
  }

  function openFilterSheet() {
    setSheetState(true);
    closeButton?.focus({ preventScroll: true });
  }

  function closeFilterSheet() {
    setSheetState(false);
    fabButton?.focus({ preventScroll: true });
  }

  fabButton?.addEventListener('click', openFilterSheet);
  closeButton?.addEventListener('click', closeFilterSheet);
  filterBackdrop?.addEventListener('click', closeFilterSheet);
  applyButton?.addEventListener('click', closeFilterSheet);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && filterContainer?.classList.contains('active')) closeFilterSheet();
  });

  let touchStartY = 0;
  filterContainer?.addEventListener('touchstart', (event) => {
    touchStartY = event.changedTouches[0].screenY;
  }, { passive: true });
  filterContainer?.addEventListener('touchend', (event) => {
    if (event.changedTouches[0].screenY - touchStartY > 100) closeFilterSheet();
  }, { passive: true });

  function setMode(mode, { update = true } = {}) {
    currentMode = mode === 'b2b' ? 'b2b' : 'b2c';
    toggleButtons.forEach((button) => {
      const selected = button.dataset.mode === currentMode;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    proToggle?.classList.toggle('is-pro', currentMode === 'b2b');
    b2cSection?.classList.toggle('active', currentMode === 'b2c');
    b2bSection?.classList.toggle('active', currentMode === 'b2b');
    if (update) syncUI();
  }

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });

  function updateURL() {
    const nextURL = new URL(window.location.href);
    nextURL.searchParams.set('mode', currentMode);
    let activeCount = 0;

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        nextURL.searchParams.set(key, value);
        activeCount += 1;
      } else {
        nextURL.searchParams.delete(key);
      }
    });

    window.history.replaceState({}, '', nextURL);
    if (fabFilterCount) fabFilterCount.textContent = activeCount ? `(${activeCount})` : '';
  }

  function displayValue(key, value) {
    const prefixes = {
      color: 'Barwa',
      voltage: 'Napięcie',
      pcb: 'PCB',
      price: 'Cena'
    };
    return prefixes[key] ? `${prefixes[key]}: ${value}` : value;
  }

  function renderActiveChips() {
    if (!activeChipsContainer) return;
    activeChipsContainer.innerHTML = '';

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;
      const chip = document.createElement('div');
      const label = displayValue(key, value);
      chip.className = 'active-chip';
      chip.append(document.createTextNode(label));

      const removeButton = document.createElement('button');
      removeButton.className = 'remove-chip';
      removeButton.type = 'button';
      removeButton.dataset.type = key;
      removeButton.setAttribute('aria-label', `Usuń filtr ${label}`);
      removeButton.innerHTML = '<i class="ph ph-x" aria-hidden="true"></i>';
      removeButton.addEventListener('click', () => {
        activeFilters[key] = null;
        syncUI();
      });
      chip.appendChild(removeButton);
      activeChipsContainer.appendChild(chip);
    });
  }

  function emitFilterChange() {
    window.dispatchEvent(new CustomEvent('prescot:filters-change', {
      detail: { ...activeFilters, mode: currentMode }
    }));
  }

  function syncUI() {
    filterPills.forEach((pill) => {
      const selected = activeFilters[pill.dataset.type] === pill.dataset.val;
      pill.classList.toggle('active', selected);
      pill.setAttribute('aria-pressed', String(selected));
    });
    renderActiveChips();
    updateURL();
    emitFilterChange();
  }

  filterPills.forEach((pill) => {
    pill.type = 'button';
    pill.addEventListener('click', () => {
      const { type, val } = pill.dataset;
      activeFilters[type] = activeFilters[type] === val ? null : val;
      syncUI();
    });
  });

  window.applyFiltersFromAI = function applyFiltersFromAI(filtersConfig = {}) {
    if (filtersConfig.mode) setMode(filtersConfig.mode, { update: false });
    Object.entries(filtersConfig).forEach(([key, value]) => {
      if (key in activeFilters) activeFilters[key] = value;
    });
    syncUI();
    if (window.innerWidth <= 991) openFilterSheet();
  };

  window.resetAdvancedShopFilters = function resetAdvancedShopFilters() {
    Object.keys(activeFilters).forEach((key) => { activeFilters[key] = null; });
    syncUI();
  };

  window.updateAdvancedFilterProductCount = function updateAdvancedFilterProductCount(total) {
    if (!applyButton) return;
    applyButton.dataset.resultCount = String(total);
    applyButton.textContent = `Pokaż ${total} ${total === 1 ? 'produkt' : 'produktów'}`;
  };

  document.getElementById('catalogResetFilters')?.addEventListener('click', () => {
    window.resetAdvancedShopFilters();
    window.resetPrimaryShopFilters?.();
  });

  fabButton?.setAttribute('aria-controls', 'advancedFilterContainer');
  fabButton?.setAttribute('aria-expanded', 'false');
  if (filterContainer) filterContainer.setAttribute('aria-hidden', String(window.innerWidth <= 991));

  setMode(currentMode, { update: false });
  syncUI();
});
