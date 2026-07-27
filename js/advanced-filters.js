document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Bottom Sheet Logic
    const fabBtn = document.getElementById('mobileFabFilterBtn');
    const filterContainer = document.getElementById('advancedFilterContainer');
    const filterBackdrop = document.getElementById('filterBackdrop');
    const closeSheetBtn = document.getElementById('closeFilterSheetBtn');
    
    function openFilterSheet() {
        if(filterContainer) filterContainer.classList.add('active');
        if(filterBackdrop) filterBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }
    
    function closeFilterSheet() {
        if(filterContainer) filterContainer.classList.remove('active');
        if(filterBackdrop) filterBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if(fabBtn) fabBtn.addEventListener('click', openFilterSheet);
    if(closeSheetBtn) closeSheetBtn.addEventListener('click', closeFilterSheet);
    if(filterBackdrop) filterBackdrop.addEventListener('click', closeFilterSheet);

    // Swipe down to close on mobile
    let touchStartY = 0;
    if(filterContainer) {
        filterContainer.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});
        filterContainer.addEventListener('touchend', e => {
            const touchEndY = e.changedTouches[0].screenY;
            if (touchEndY - touchStartY > 100) { // Swipe down
                closeFilterSheet();
            }
        }, {passive: true});
    }

    // 2. Amator / PRO Toggle Logic
    const toggleBtns = document.querySelectorAll('.pro-toggle-switch .toggle-btn');
    const proToggleSwitch = document.getElementById('proToggleSwitch');
    const b2cSection = document.getElementById('b2cFilters');
    const b2bSection = document.getElementById('b2bFilters');
    
    let currentMode = 'b2c';

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            currentMode = mode;
            
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (mode === 'b2b') {
                proToggleSwitch.classList.add('is-pro');
                b2cSection.classList.remove('active');
                b2bSection.classList.add('active');
            } else {
                proToggleSwitch.classList.remove('is-pro');
                b2bSection.classList.remove('active');
                b2cSection.classList.add('active');
            }
            updateURL();
        });
    });

    // 3. Faceted Navigation Logic
    // This will hold active filters
    const activeFilters = {
        room: null,
        expect: null,
        voltage: null,
        color: null,
        pcb: null,
        profile: null,
        price: null
    };

    const filterPills = document.querySelectorAll('.advanced-filter-container .filter-pill, .advanced-filter-container .color-swatch-btn, .advanced-filter-container .svg-filter-btn');
    const activeChipsContainer = document.getElementById('activeChipsContainer');
    const fabFilterCount = document.getElementById('fabFilterCount');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    
    // Read from URL on load (Shallow Routing)
    const urlParams = new URLSearchParams(window.location.search);
    let urlMode = urlParams.get('mode');
    if (urlMode === 'pro' || urlMode === 'b2b') {
        const b2bBtn = document.querySelector('.toggle-btn[data-mode="b2b"]');
        if(b2bBtn) b2bBtn.click();
    }
    
    Object.keys(activeFilters).forEach(key => {
        const val = urlParams.get(key);
        if (val) activeFilters[key] = val;
    });

    // Update UI based on activeFilters state
    function syncUI() {
        filterPills.forEach(pill => {
            const type = pill.dataset.type;
            const val = pill.dataset.val;
            if (activeFilters[type] === val) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
        
        renderActiveChips();
        updateURL();
        triggerGridUpdate();
    }

    function updateURL() {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('mode', currentMode);
        
        let count = 0;
        Object.keys(activeFilters).forEach(key => {
            if (activeFilters[key]) {
                newUrl.searchParams.set(key, activeFilters[key]);
                count++;
            } else {
                newUrl.searchParams.delete(key);
            }
        });
        
        window.history.replaceState({}, '', newUrl);
        
        if(fabFilterCount) fabFilterCount.textContent = count > 0 ? `(${count})` : '';
        
        // Mocking product count update (in real app, this comes from filtered array length)
        if(applyFiltersBtn) {
            applyFiltersBtn.textContent = count > 0 ? `Pokaż przefiltrowane produkty` : `Pokaż wszystkie produkty`;
        }
    }

    function renderActiveChips() {
        if(!activeChipsContainer) return;
        activeChipsContainer.innerHTML = '';
        
        Object.keys(activeFilters).forEach(key => {
            const val = activeFilters[key];
            if (val) {
                const chip = document.createElement('div');
                chip.className = 'active-chip';
                
                let displayVal = val;
                if (key === 'color') displayVal = "Barwa: " + val;
                if (key === 'voltage') displayVal = "Napięcie: " + val;
                
                chip.innerHTML = `
                    ${displayVal}
                    <div class="remove-chip" data-type="${key}"><i class="ph ph-x"></i></div>
                `;
                activeChipsContainer.appendChild(chip);
            }
        });

        // Bind remove events
        activeChipsContainer.querySelectorAll('.remove-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                activeFilters[type] = null;
                syncUI();
            });
        });
    }

    function triggerGridUpdate() {
        // Trigger a custom event that shop.html can listen to, or just map them to global variables
        window.currentVoltage = activeFilters.voltage || 'all';
        window.currentColorTemp = activeFilters.color || 'all';
        window.currentPriceRange = activeFilters.price || 'all';
        // Add smooth transition to grid
        const grid = document.getElementById('shopGrid');
        if (grid) {
            grid.style.opacity = '0';
            setTimeout(() => {
                if(typeof window.renderFilteredProducts === 'function') {
                    window.renderFilteredProducts();
                }
                grid.style.opacity = '1';
            }, 300);
        }
    }

    // Pill click handler
    filterPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const type = pill.dataset.type;
            const val = pill.dataset.val;
            
            // Toggle
            if (activeFilters[type] === val) {
                activeFilters[type] = null;
            } else {
                activeFilters[type] = val;
            }
            
            // AI Magic: If Łazienka is selected, maybe auto-select something in PRO mode? (Optional)
            
            syncUI();
        });
    });

    // Exposed for AI
    window.applyFiltersFromAI = function(filtersConfig) {
        console.log("AI Applying filters:", filtersConfig);
        // Example: filtersConfig = { mode: 'b2b', color: 'czarny', profile: 'Wpuszczany' }
        if (filtersConfig.mode) {
            const btn = document.querySelector(`.toggle-btn[data-mode="${filtersConfig.mode}"]`);
            if(btn) btn.click();
        }
        
        Object.keys(filtersConfig).forEach(key => {
            if(key !== 'mode' && activeFilters[key] !== undefined) {
                activeFilters[key] = filtersConfig[key];
            }
        });
        
        syncUI();
        
        if (window.innerWidth <= 991) {
            openFilterSheet();
        }
    };

    // Initial sync
    syncUI();
});
