
    // Mobile Collapsible Footer Columns
    document.querySelectorAll('.footer-col h3').forEach(h3 => {
      h3.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          const col = h3.parentElement;
          col.classList.toggle('active');
        }
      });
    });

    
    

    const productsList = typeof products !== "undefined" ? products : (typeof window.products !== "undefined" ? window.products : (typeof getProducts !== "undefined" ? getProducts() : []));
    // Parse URL parameter ?id=
    const urlParams = new URLSearchParams(window.location.search);
    const pId = parseInt(urlParams.get('id')) || 1;
    const product = productsList.find(p => p.id === pId) || productsList[0];

    // Load Product Data into DOM
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

    // Load Product Data into DOM
    document.title = `${product.title} | Prescot LED — Producent taśm LED i hurtownia elektryczna`;
    document.getElementById('pTitle').textContent = product.title;
    document.getElementById('pCategory').textContent = product.category;
    document.getElementById('pPrice').innerHTML = `${product.price.toFixed(2)} zł <span class="price-unit">/ ${product.category === "Taśmy LED" ? "metr" : "szt."}</span>`;
    const pDescEl = document.getElementById('pDesc'); if (pDescEl) pDescEl.style.display = 'none';

    // Render Actions Bar dynamically (Shopify Style)
    const actionsBar = document.getElementById('productActionsBar');
    if (actionsBar) {
      actionsBar.innerHTML = '';
      const items = [];

      // 1. Parametry technical specifications (always show)
      items.push(`
        <button class="product-action-item" onclick="document.getElementById('popupParametry').style.display='flex'">
          <i class="ph ph-file-text"></i>
          <span>Parametry techniczne</span>
        </button>
      `);

      // 2. Barwy światła light color guide (only for Taśmy LED or Sterowniki LED)
      if (product.category === "Taśmy LED" || product.category === "Sterowniki LED") {
        items.push(`
          <button class="product-action-item" onclick="document.getElementById('popupBarwa').style.display='flex'">
            <i class="ph ph-palette"></i>
            <span>Barwy światła</span>
          </button>
        `);
      }

      // 3. Model 3D / AR
      if (product.has3D) {
        items.push(`
          <button class="product-action-item" id="actionBar3DBtn">
            <i class="ph ph-cube"></i>
            <span>Model 3D (AR)</span>
          </button>
        `);
      }

      // 4. Widok 360
      if (product.has360) {
        items.push(`
          <button class="product-action-item" id="actionBar360Btn">
            <i class="ph ph-arrows-clockwise"></i>
            <span>Widok 360°</span>
          </button>
        `);
      }

      // 5. Wideo
      if (product.video) {
        items.push(`
          <button class="product-action-item" id="actionBarVideoBtn">
            <i class="ph ph-play-circle"></i>
            <span>Prezentacja wideo</span>
          </button>
        `);
      }

      // 6. Zapytaj o produkt
      items.push(`
        <button class="product-action-item" id="actionBarAskBtn">
          <i class="ph ph-question"></i>
          <span>Zapytaj o produkt</span>
        </button>
      `);

      // 7. Udostępnij
      items.push(`
        <button class="product-action-item" id="actionBarShareBtn">
          <i class="ph ph-share-network"></i>
          <span>Udostępnij</span>
        </button>
      `);

      // Join items with dividers
      actionsBar.innerHTML = items.join('<div class="product-action-divider"></div>');

      // Bind events directly
      const btn3D = document.getElementById('actionBar3DBtn');
      if (btn3D) {
        btn3D.addEventListener('click', () => {
          if (trigger) trigger.click();
        });
      }

      const btn360 = document.getElementById('actionBar360Btn');
      if (btn360) {
        btn360.addEventListener('click', () => {
          const trigger = document.getElementById('trigger360');
          if (trigger) trigger.click();
        });
      }

      const btnVideo = document.getElementById('actionBarVideoBtn');
      if (btnVideo) {
        btnVideo.addEventListener('click', () => {
          const mainVid = document.getElementById('mainVideo');
          resetGalleryTabs();
          if (mainVid) {
            mainVid.style.display = 'block';
            mainVid.style.opacity = '1';
            mainVid.src = product.video;
            mainVid.play().catch(err => console.log("Video play failed:", err));
          }
          const vThumb = document.querySelector('.thumbnail.video-thumbnail-card');
          if (vThumb) {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            vThumb.classList.add('active');
          }
        });
      }

      const btnAsk = document.getElementById('actionBarAskBtn');
      if (btnAsk) {
        btnAsk.addEventListener('click', () => {
          const text = document.getElementById('askQuestionTextarea');
          if (text) {
            text.value = `Dzień dobry, mam pytanie dotyczące produktu: ${product.title}. Chciałbym dowiedzieć się więcej o...`;
          }
          document.getElementById('popupZapytaj').style.display = 'flex';
        });
      }

      const btnShare = document.getElementById('actionBarShareBtn');
      if (btnShare) {
        btnShare.addEventListener('click', () => {
          navigator.clipboard.writeText(window.location.href)
            .then(() => {
              const toast = document.getElementById('shareToast');
              if (toast) {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2000);
              }
            })
            .catch(err => console.error("Could not copy text: ", err));
        });
      }
    }

    // Show/hide Delux/Premium banner badge image
    const deluxContainer = document.getElementById('deluxBadgeContainer');
    if (deluxContainer) {
      const isDelux = product.title.toLowerCase().includes('delux') || 
                      product.description.toLowerCase().includes('delux') ||
                      product.title.toLowerCase().includes('premium') || 
                      product.description.toLowerCase().includes('premium');
      if (isDelux) {
        deluxContainer.style.display = 'block';
      } else {
        deluxContainer.style.display = 'none';
      }
    }

    const heroTitle = document.getElementById('heroProductTitle');
    const heroCat = document.getElementById('heroProductCategory');
    if (heroTitle) heroTitle.textContent = product.title;
    if (heroCat) heroCat.textContent = product.category;

        // Populate Breadcrumbs dynamically with exact closed network navigation
    const bcContainer = document.getElementById('dynamicBreadcrumbs');
    if (bcContainer) {
      let parts = [];
      parts.push(`
        <a href="index.html" style="color: #64748b; text-decoration: none; display: flex; align-items: center; gap: 5px; font-weight: 500;">
          <svg fill="none" height="13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24" width="13" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Główna
        </a>
      `);
      parts.push(`<span style="color: #cbd5e1;">/</span>`);
      parts.push(`<a href="shop.html" style="color: #64748b; text-decoration: none; font-weight: 500;">Sklep</a>`);

      // Category in shop
      const catName = product.category || "Taśmy LED";
      parts.push(`<span style="color: #cbd5e1;">/</span>`);
      parts.push(`<a href="shop.html?category=${encodeURIComponent(catName)}" style="color: #64748b; text-decoration: none; font-weight: 600;">${catName}</a>`);

      // Product Title
      parts.push(`<span style="color: #cbd5e1;">/</span>`);
      parts.push(`<span style="color: #0b1a30; font-weight: 700;">${product.title}</span>`);

      bcContainer.innerHTML = parts.join(' ');
    }

    // Load description with full HTML formatting inside bottom descTab
    const descTabEl = document.getElementById('descTab');
    if (descTabEl) {
      descTabEl.innerHTML = `<div class="product-html-description">${product.description}</div>`;
    }

    // Main Image & Gallery
    const mainImg = document.getElementById('mainImg');
    mainImg.src = (product.images && product.images[0]) ? product.images[0] : 'images/okladka-produkty.webp';
    mainImg.alt = product.title;

    const qvThumbnails = document.getElementById('qvThumbnails');
    
    // First image thumbnail
    const firstThumb = document.createElement('img');
    firstThumb.className = 'thumbnail active';
    firstThumb.src = (product.images && product.images[0]) ? product.images[0] : 'images/okladka-produkty.webp';
    firstThumb.alt = `${product.title} - 1`;
    firstThumb.addEventListener('click', () => {
      resetGalleryTabs();
      mainImg.style.display = 'block';
      mainImg.src = (product.images && product.images[0]) ? product.images[0] : 'images/okladka-produkty.webp';
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      firstThumb.classList.add('active');
    });
    qvThumbnails.appendChild(firstThumb);

    // If product has a video, insert video thumbnail as the second thumbnail!
    if (product.video) {
      const videoThumb = document.createElement('div');
      videoThumb.className = 'thumbnail video-thumbnail-card';
      videoThumb.style.position = 'relative';
      videoThumb.style.cursor = 'pointer';
      videoThumb.innerHTML = `
        <img src="${(product.images && product.images[0]) ? product.images[0] : 'images/okladka-produkty.webp'}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6; border-radius: inherit;" onerror="this.onerror=null;this.src='images/okladka-produkty.webp'">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--primary-color); color: #fff; width: 22px; height: 22px;  display: flex; align-items: center; justify-content: center; font-size: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">▶</div>
      `;
      videoThumb.addEventListener('click', () => {
        resetGalleryTabs();
        if (mainVideo) {
          mainVideo.style.display = 'block';
          mainVideo.style.opacity = '1';
          mainVideo.src = product.video;
          mainVideo.play().catch(err => console.log("Video thumb play failed:", err));
        }
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        videoThumb.classList.add('active');
      });
      qvThumbnails.appendChild(videoThumb);
    }

    // Remaining image thumbnails (starting from index 1)
    product.images.slice(1).forEach((imgSrc, i) => {
      const thumb = document.createElement('img');
      thumb.className = 'thumbnail';
      thumb.src = imgSrc;
      thumb.alt = `${product.title} - ${i + 2}`;
      thumb.addEventListener('click', () => {
        resetGalleryTabs();
        mainImg.style.display = 'block';
        mainImg.src = imgSrc;
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      qvThumbnails.appendChild(thumb);
    });

    // Load Colors
    const pColors = document.getElementById('pColors');
    if (product.colors && product.colors.length > 0) {
      product.colors.forEach((color, i) => {
        const activeClass = i === 0 ? 'active' : '';
        const colorDot = document.createElement('div');
        colorDot.className = `color-swatch-dot ${activeClass}`;
        colorDot.style.backgroundColor = color;
        colorDot.addEventListener('click', () => {
          document.querySelectorAll('.color-swatch-dot').forEach(d => d.classList.remove('active'));
          colorDot.classList.add('active');
          if (product.variants) {
            const variant = product.variants.find(v => v.color === color);
            if (variant) {
              document.getElementById('pPrice').innerHTML = `${variant.price.toFixed(2)} zł <span class="price-unit">/ ${product.category === "Taśmy LED" ? "metr" : "szt."}</span>`;
              if (variant.image) {
                mainImg.src = variant.image;
              }
            }
          }
        });
        pColors.appendChild(colorDot);
      });
    } else {
      document.getElementById('colorContainer').style.display = 'none';
    }

    // Load Sizes
    const pSizes = document.getElementById('pSizes');
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size, i) => {
        const activeClass = i === 0 ? 'active' : '';
        const sizeSwatch = document.createElement('div');
        sizeSwatch.className = `size-swatch ${activeClass}`;
        sizeSwatch.textContent = size;
        sizeSwatch.addEventListener('click', () => {
          document.querySelectorAll('.size-swatch').forEach(s => s.classList.remove('active'));
          sizeSwatch.classList.add('active');
        });
        pSizes.appendChild(sizeSwatch);
      });
    } else {
      document.getElementById('sizeContainer').style.display = 'none';
    }

    // Render Controller Variants
    const variantsContainer = document.getElementById('productVariantsContainer');
    if (product.variants && product.variants.length > 0 && product.variants[0].name) {
      const variantsHTML = product.variants.map(v => `
        <a href="product.html?id=${v.id}" class="variant-card ${v.id === pId ? 'active' : ''}">
          <div class="variant-card-img">
            <img src="${v.image}" alt="${v.name}">
            ${v.video ? `<video src="${v.video}" loop muted playsinline autoplay class="variant-card-video"></video>` : ''}
          </div>
          <span class="variant-card-label">${v.name}</span>
        </a>
      `).join('');
      variantsContainer.innerHTML = `
        <h4 style="margin-bottom: 15px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: rgba(0,0,0,0.5);">Dostępne modele</h4>
        <div class="variants-grid">
          ${variantsHTML}
        </div>
      `;
    }

    // === POPUP HANDLERS ===
    const btnParametry = document.getElementById('btnParametry');
    const btnBarwa = document.getElementById('btnBarwa');
    const popupParametry = document.getElementById('popupParametry');
    const popupBarwa = document.getElementById('popupBarwa');

    // Populate specs overlay dynamically
    const specGrid = document.querySelector('#popupParametry .spec-grid');
    if (specGrid) {
      const { specs } = getProductSpecs(product);
      if (specs.length > 0) {
        // Build base specs
        let specsHtml = specs.map(s => `
          <div class="spec-bento-card">
            <span>${s.name}</span>
            <strong>${s.value}</strong>
          </div>
        `).join('');
        // Append premium badge dynamically
        specsHtml += `
          <div class="spec-bento-card premium-badge">
            <span>Gwarancja producenta</span>
            <strong>5 lat gwarancji Premium</strong>
          </div>
        `;
        specGrid.innerHTML = specsHtml;
      }
    }

    // Populate barwa light temp overlay dynamically
    const barwaGrid = document.querySelector('#popupBarwa .color-temp-grid');
    if (barwaGrid) {
      const { barwy } = getProductSpecs(product);
      if (barwy.length > 0) {
        barwaGrid.innerHTML = barwy.map(b => `
          <div class="color-temp-option liquid-option" style="--ct-color: ${b.color};">
            <div class="ct-circle liquid-circle ${b.color.includes('linear-gradient') ? 'ct-rgb' : ''}"></div>
            <span class="liquid-title">${b.label}</span>
            <small class="liquid-subtitle">${b.desc}</small>
          </div>
        `).join('');
      } else if (btnBarwa) {
        btnBarwa.style.display = 'none';
      }
    }

    if (btnParametry && popupParametry) {
      btnParametry.addEventListener('click', () => { popupParametry.style.display = 'flex'; });
    }
    if (btnBarwa && popupBarwa) {
      btnBarwa.addEventListener('click', () => { popupBarwa.style.display = 'flex'; });
    }
    // Close popups on overlay click
    document.querySelectorAll('.product-popup-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
      });
    });

    // Quantity selectors
    const qtyInput = document.getElementById('qtyInput');
    document.getElementById('qtyMinus').addEventListener('click', () => {
      let qty = parseInt(qtyInput.value);
      if (qty > 1) qtyInput.value = qty - 1;
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
      let qty = parseInt(qtyInput.value);
      qtyInput.value = qty + 1;
    });

    // Tab switching
    const tabs = ['descTab', 'shippingTab', 'reviewsTab'];
    tabs.forEach(tab => {
      document.getElementById(`${tab}Header`).addEventListener('click', (e) => {
        document.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        e.target.classList.add('active');
        document.getElementById(tab).classList.add('active');
      });
    });

    // 3D and 360 View Triggers & Logic
    const triggerImage = document.getElementById('triggerImage');
    const trigger360 = document.getElementById('trigger360');
    const sixtyViewerContainer = document.getElementById('sixtyViewerContainer');
    const sixtyImg = document.getElementById('sixtyImg');
    const sixtyLoading = document.getElementById('sixtyLoading');
    const product360Images = Array.isArray(product.images360) ? product.images360.filter(Boolean) : [];
    const product360Pattern = typeof product.images360Pattern === 'string' ? product.images360Pattern : '';
    const totalSixtyImages = product360Pattern
      ? (product.images360Count || 36)
      : Math.max(1, product360Images.length);

    function getSixtyImageSource(index) {
      if (product360Pattern) return product360Pattern.replace('{index}', index);
      return product360Images[index - 1] || product360Images[0] || ((product.images && product.images[0]) ? product.images[0] : 'images/okladka-produkty.webp');
    }

    // 1. Show triggers if product supports them
    if (product.has360) {
      trigger360.style.display = 'flex';

      // Preload 360 images
      const imagesCount = totalSixtyImages;
      let loadedCount = 0;
      const preloadedImages = [];

      for (let i = 1; i <= imagesCount; i++) {
        const src = getSixtyImageSource(i);
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === imagesCount) {
            sixtyLoading.style.display = 'none';
          }
        };
        preloadedImages.push(img);
      }

      // Set initial image
      sixtyImg.src = getSixtyImageSource(1);
    }

    const mainVideo = document.getElementById('mainVideo');

    // 2. Tab switching inside gallery
    function resetGalleryTabs() {
      mainImg.style.display = 'none';
      if (mainVideo) {
        mainVideo.style.display = 'none';
        mainVideo.style.opacity = '0';
        mainVideo.pause();
      }
      sixtyViewerContainer.style.display = 'none';
      triggerImage.classList.remove('active');
      trigger360.classList.remove('active');

      // Stop 360 interval if playing
      stopSixtyAutoPlay();
    }

    if (product.video && mainVideo) {
      mainVideo.addEventListener('playing', () => {
        mainVideo.style.opacity = '1';
      });
    }

    triggerImage.addEventListener('click', () => {
      resetGalleryTabs();
      const activeThumb = document.querySelector('.thumbnail.active');
      if (activeThumb && activeThumb.classList.contains('video-thumbnail-card')) {
        if (mainVideo) {
          mainVideo.style.display = 'block';
          mainVideo.style.opacity = '1';
          mainVideo.src = product.video;
          mainVideo.play().catch(err => console.log("Main video play failed:", err));
        }
      } else {
        mainImg.style.display = 'block';
      }
      triggerImage.classList.add('active');
    });

    if (product.video && mainVideo) {
      mainVideo.src = product.video;
    }



    trigger360.addEventListener('click', () => {
      resetGalleryTabs();
      sixtyViewerContainer.style.display = 'flex';
      trigger360.classList.add('active');
    });

    // 3. 360 Degree Rotation Logic
    let activeSixtyIndex = 1;

    // --- Zoom and Pan Logic for 360 Viewer ---
    let sixtyScale = 1;
    let sixtyPanX = 0;
    let sixtyPanY = 0;
    let isPanningSixty = false;
    let startPanX = 0;
    let startPanY = 0;
    let initialPinchDistance = null;

    sixtyImg.style.transformOrigin = 'center center';
    sixtyImg.style.transition = 'transform 0.1s ease-out';

    function updateSixtyTransform() {
      sixtyImg.style.transform = `translate(${sixtyPanX}px, ${sixtyPanY}px) scale(${sixtyScale})`;
    }

    sixtyViewerContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      sixtyScale += e.deltaY * -0.005;
      sixtyScale = Math.min(Math.max(1, sixtyScale), 5);
      if (sixtyScale === 1) { sixtyPanX = 0; sixtyPanY = 0; }
      updateSixtyTransform();
    }, {passive: false});

    // We need to differentiate between rotating (drag) and panning (if zoomed in, maybe drag should pan instead of rotate? 
    // Or drag with 2 fingers to pan. Let's do: if zoomed in, 1-finger drag pans, 2-finger pinch zooms.
    // To rotate when zoomed in, we can provide buttons or require zooming out first.
    // Actually, typical 360 viewer: horizontal drag rotates, but if zoomed, maybe we can just let it rotate, and double-click to zoom in/out.
    sixtyViewerContainer.addEventListener('dblclick', (e) => {
      if (sixtyScale > 1) {
        sixtyScale = 1;
        sixtyPanX = 0;
        sixtyPanY = 0;
      } else {
        sixtyScale = 2.5;
      }
      updateSixtyTransform();
    });

    sixtyViewerContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        isDraggingSixty = false;
        initialPinchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    sixtyViewerContainer.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDistance) {
        e.preventDefault();
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = currentDistance - initialPinchDistance;
        sixtyScale += diff * 0.01;
        sixtyScale = Math.min(Math.max(1, sixtyScale), 5);
        if (sixtyScale === 1) { sixtyPanX = 0; sixtyPanY = 0; }
        initialPinchDistance = currentDistance;
        updateSixtyTransform();
      }
    }, {passive: false});

    sixtyViewerContainer.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        initialPinchDistance = null;
      }
    });
    

    function showSixtyImage(index) {
      if (index < 1) index = totalSixtyImages;
      if (index > totalSixtyImages) index = 1;
      activeSixtyIndex = index;
      sixtyImg.src = getSixtyImageSource(index);
    }

    // Drag / Swipe Interaction
    let isDraggingSixty = false;
    let startSixtyX = 0;

    sixtyViewerContainer.addEventListener('mousedown', (e) => {
      isDraggingSixty = true;
      startSixtyX = e.clientX;
      stopSixtyAutoPlay();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingSixty) return;
      if (sixtyScale > 1) {
        const dx = e.clientX - startSixtyX;
        const dy = e.movementY;
        sixtyPanX += dx;
        sixtyPanY += dy;
        startSixtyX = e.clientX;
        updateSixtyTransform();
        return;
      }
      const diffX = e.clientX - startSixtyX;
      if (Math.abs(diffX) > 12) {
        if (diffX > 0) {
          showSixtyImage(activeSixtyIndex - 1);
        } else {
          showSixtyImage(activeSixtyIndex + 1);
        }
        startSixtyX = e.clientX;
      }
    });

    window.addEventListener('mouseup', () => {
      isDraggingSixty = false;
    });

    // Touch support
    sixtyViewerContainer.addEventListener('touchstart', (e) => {
      isDraggingSixty = true;
      startSixtyX = e.touches[0].clientX;
      stopSixtyAutoPlay();
    });

    sixtyViewerContainer.addEventListener('touchmove', (e) => {
      if (!isDraggingSixty || e.touches.length > 1) return;
      if (sixtyScale > 1) {
        const dx = e.touches[0].clientX - startSixtyX;
        sixtyPanX += dx;
        // Basic touch pan logic for Y can also be added if we store startSixtyY
        startSixtyX = e.touches[0].clientX;
        updateSixtyTransform();
        e.preventDefault(); // Prevent scrolling when panning
        return;
      }
      const diffX = e.touches[0].clientX - startSixtyX;
      if (Math.abs(diffX) > 12) {
        if (diffX > 0) {
          showSixtyImage(activeSixtyIndex - 1);
        } else {
          showSixtyImage(activeSixtyIndex + 1);
        }
        startSixtyX = e.touches[0].clientX;
      }
    }, {passive: false});

    sixtyViewerContainer.addEventListener('touchend', () => {
      isDraggingSixty = false;
    });

    // Control buttons (Play / Pause / Zoom)
    const sixtyZoomIn = document.getElementById('sixtyZoomIn');
    const sixtyZoomOut = document.getElementById('sixtyZoomOut');
    const sixtyPlay = document.getElementById('sixtyPlay');
    const sixtyPause = document.getElementById('sixtyPause');
    let sixtyAutoPlayInterval = null;

    sixtyZoomIn.addEventListener('click', (e) => {
      e.stopPropagation();
      sixtyScale = Math.min(sixtyScale + 0.5, 5);
      updateSixtyTransform();
    });

    sixtyZoomOut.addEventListener('click', (e) => {
      e.stopPropagation();
      sixtyScale = Math.max(sixtyScale - 0.5, 1);
      if (sixtyScale === 1) { sixtyPanX = 0; sixtyPanY = 0; }
      updateSixtyTransform();
    });

    sixtyPlay.addEventListener('click', (e) => {
      e.stopPropagation();
      startSixtyAutoPlay();
    });

    sixtyPause.addEventListener('click', (e) => {
      e.stopPropagation();
      stopSixtyAutoPlay();
    });

    function startSixtyAutoPlay() {
      if (sixtyAutoPlayInterval) return;
      sixtyPlay.style.display = 'none';
      sixtyPause.style.display = 'flex';
      sixtyAutoPlayInterval = setInterval(() => {
        showSixtyImage(activeSixtyIndex + 1);
      }, 120); // 120ms frame rate (slower rotation)
    }

    function stopSixtyAutoPlay() {
      if (sixtyAutoPlayInterval) {
        clearInterval(sixtyAutoPlayInterval);
        sixtyAutoPlayInterval = null;
      }
      sixtyPlay.style.display = 'flex';
      sixtyPause.style.display = 'none';
    }

        // Header Scroll Effect
    const header = document.getElementById('mainHeader');
    const headerLogo = document.getElementById('headerLogo');
    const hasHero = document.querySelector('.page-hero, .mockup-hero-slider, .hero, .hero-section');
    
    if (!hasHero && header) {
      header.classList.add('scrolled');
      if (headerLogo) headerLogo.src = 'images/logo-dark.png';
      header.classList.add('force-scrolled');
    }
    
    window.addEventListener('scroll', () => {
      if (!header) return;
      if (header.classList.contains('force-scrolled')) return;
      
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
        if (headerLogo) headerLogo.src = 'images/logo-dark.png';
      } else {
        header.classList.remove('scrolled');
        if (headerLogo) headerLogo.src = 'images/logo-white.png';
      }
    });

    // Header Search bar logic
    const headerSearchInput = document.getElementById('headerSearchInput');
    const headerSearchBtn = document.getElementById('headerSearchBtn');

    function performHeaderSearch() {
      if (headerSearchInput) {
        const q = headerSearchInput.value.trim();
        if (q) {
          window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
        }
      }
    }

    if (headerSearchInput) {
      headerSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performHeaderSearch();
        }
      });
    }
    if (headerSearchBtn) {
      headerSearchBtn.addEventListener('click', performHeaderSearch);
    }

    // Render Recommended Products Grid
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (recommendedGrid) {
      // Map of complementary categories
      const complementMap = {
        'Taśmy LED': ['Zasilacze', 'Profile aluminiowe', 'Sterowniki LED'],
        'Zasilacze': ['Taśmy LED', 'Sterowniki LED'],
        'Profile aluminiowe': ['Taśmy LED', 'Zasilacze'],
        'Sterowniki LED': ['Taśmy LED', 'Zasilacze']
      };
      
      const compCats = complementMap[product.category] || [product.category];
      
      // Try to find products from complementary categories first
      let recommended = products.filter(p => p.id !== product.id && compCats.includes(p.category))
                                .sort(() => 0.5 - Math.random()) // shuffle a bit for variety
                                .slice(0, 4);
                                
      // Fallback if not enough products found
      if (recommended.length < 4) {
        const remaining = products.filter(p => p.id !== product.id && !compCats.includes(p.category))
                                  .sort(() => 0.5 - Math.random())
                                  .slice(0, 4 - recommended.length);
        recommended = [...recommended, ...remaining];
      }

      recommended.forEach(p => {
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

        const cardHTML = `
          <div class="mockup-product-card" data-id="${p.id}">
            <div class="mockup-product-media" style="position: relative; overflow: hidden;">
              <img src="${p.images && p.images[0] ? p.images[0] : 'images/okladka-produkty.webp'}" alt="${p.title}" class="mockup-product-img" onerror="this.onerror=null;this.src='images/okladka-produkty.webp'">
              ${p.video ? `
                <video class="mockup-product-video" data-src="${p.video}" loop muted playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;"></video>
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
                ${p.price.toFixed(2)} zł <span class="price-unit">/ ${p.category === "Taśmy LED" ? "metr" : "szt."}</span>
              </p>
              <button class="add-to-cart-btn qv-add-cart-btn" data-id="${p.id}" type="button" aria-label="Dodaj do koszyka" style="width: 100%; margin-top: 12px; cursor: pointer;">
                <span class="btn-slide-wrap">
                  <span class="btn-txt-default">Dodaj do koszyka</span>
                  <span class="btn-txt-hover"><i class="ph ph-shopping-cart-simple" style="margin-right: 6px;"></i>Dodaj teraz!</span>
                </span>
              </button>
            </div>
          </div>
        `;
        recommendedGrid.insertAdjacentHTML('beforeend', cardHTML);
      });
    }

    
    // Sticky Cart Logic
    const stickyCartBar = document.getElementById('stickyCartBar');
    const mainCartBtn = document.getElementById('addToCart');
    
    if (stickyCartBar && mainCartBtn && product) {
      document.getElementById('stickyCartImg').src = (product.images && product.images[0]) ? product.images[0] : 'images/okladka-produkty.webp';
      document.getElementById('stickyCartTitle').textContent = product.title;
      document.getElementById('stickyCartPrice').textContent = product.price.toFixed(2) + ' zł';
      
      document.getElementById('stickyAddToCartBtn').addEventListener('click', () => {
        mainCartBtn.click();
      });

      window.addEventListener('scroll', () => {
        const rect = mainCartBtn.getBoundingClientRect();
        // If main cart button is scrolled out of view (above viewport)
        if (rect.bottom < 0) {
          stickyCartBar.classList.add('active');
        } else {
          stickyCartBar.classList.remove('active');
        }
      });
    }
    
    
    // Recently Viewed Logic
    let recentlyViewed = JSON.parse(localStorage.getItem('sklepSC_recentlyViewed')) || [];
    
    if (product) {
      // Remove if already exists to push to front
      recentlyViewed = recentlyViewed.filter(id => id !== product.id);
      recentlyViewed.unshift(product.id);
      if (recentlyViewed.length > 8) recentlyViewed.pop();
      localStorage.setItem('sklepSC_recentlyViewed', JSON.stringify(recentlyViewed));
    }

    const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');
    if (recentlyViewedGrid) {
      const recentIds = recentlyViewed.filter(id => !product || id !== product.id).slice(0, 4);
      if (recentIds.length > 0) {
        const recentProds = recentIds.map(id => products.find(p => p.id === id)).filter(p => p);
        recentProds.forEach(p => {
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

          const cardHTML = `
            <div class="mockup-product-card" data-id="${p.id}">
              <div class="mockup-product-media" style="position: relative; overflow: hidden;">
                <img src="${p.images && p.images[0] ? p.images[0] : 'images/okladka-produkty.webp'}" alt="${p.title}" class="mockup-product-img" onerror="this.onerror=null;this.src='images/okladka-produkty.webp'">
                ${p.video ? `
                  <video class="mockup-product-video" data-src="${p.video}" loop muted playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;"></video>
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
                  ${p.price.toFixed(2)} zł <span class="price-unit">/ ${p.category === "Taśmy LED" ? "metr" : "szt."}</span>
                </p>
              <button class="add-to-cart-btn qv-add-cart-btn" data-id="${p.id}" type="button" aria-label="Dodaj do koszyka" style="width: 100%; margin-top: 12px; cursor: pointer;">
                <span class="btn-slide-wrap">
                  <span class="btn-txt-default">Dodaj do koszyka</span>
                  <span class="btn-txt-hover"><i class="ph ph-shopping-cart-simple" style="margin-right: 6px;"></i>Dodaj teraz!</span>
                </span>
              </button>
              </div>
            </div>
          `;
          recentlyViewedGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
      } else {
        recentlyViewedGrid.parentElement.style.display = 'none';
      }
    }
    
    // Initialize Shared Popups
    initSharedPopups();

    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
      });
    }

    // Delivery Countdown & Estimator Logic
    const countdownEl = document.getElementById('deliveryCountdown');
    const deliveryDateEl = document.getElementById('estimatedDeliveryDate');

    function updateDeliveryEstimator() {
      if (!countdownEl || !deliveryDateEl) return;

      const now = new Date();
      // Set the shipping cut-off time to 18:00 (6:00 PM) today
      const cutoff = new Date();
      cutoff.setHours(18, 0, 0, 0);

      let targetTime;
      let shippingToday = true;

      if (now < cutoff) {
        targetTime = cutoff;
      } else {
        // Cut-off passed, countdown to tomorrow's 18:00
        targetTime = new Date(cutoff);
        targetTime.setDate(cutoff.getDate() + 1);
        shippingToday = false;
      }

      // Calculate remaining time
      const diffMs = targetTime - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      // Format countdown text: e.g. 04g 12m 30s
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');
      countdownEl.textContent = `${hStr}g ${mStr}m ${sStr}s`;

      // Calculate estimated delivery date: shipping date + 1 business day
      let shippingDate = new Date(now);
      if (!shippingToday) {
        shippingDate.setDate(shippingDate.getDate() + 1);
      }

      // If shipping date falls on Sunday, move to Monday
      if (shippingDate.getDay() === 0) {
        shippingDate.setDate(shippingDate.getDate() + 1);
      }

      // Delivery date = shipping date + 1 business day
      let deliveryDate = new Date(shippingDate);
      deliveryDate.setDate(deliveryDate.getDate() + 1);

      // Skip Saturday and Sunday for delivery
      if (deliveryDate.getDay() === 6) { // Saturday -> Monday
        deliveryDate.setDate(deliveryDate.getDate() + 2);
      } else if (deliveryDate.getDay() === 0) { // Sunday -> Monday
        deliveryDate.setDate(deliveryDate.getDate() + 1);
      }

      // Format delivery date in Polish
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      const formattedDate = deliveryDate.toLocaleDateString('pl-PL', options);
      // Capitalize first letter
      deliveryDateEl.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    // Run estimator immediately and update every second
    updateDeliveryEstimator();
    setInterval(updateDeliveryEstimator, 1000);
  