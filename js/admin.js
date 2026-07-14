

let deletedProducts = JSON.parse(localStorage.getItem('sklepSC_deletedProducts')) || [];

// Setup basic functionality on load
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  const menuItems = document.querySelectorAll('.menu-item[data-view]');
  const views = document.querySelectorAll('.view-section');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      
      // Update active menu item
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');
      
      // Update active view
      views.forEach(v => v.classList.remove('active'));
      document.getElementById('view-' + targetView).classList.add('active');
    });
  });

  // Load Data
  loadDashboardData();
  loadOrdersData();
  loadProductsData();
  loadTrashData();
});

// Expose switchView to global for inline onclick
window.switchView = function(viewId) {
  const item = document.querySelector(`.menu-item[data-view="${viewId}"]`);
  if (item) item.click();
};

// ==========================================
// MOCK DATA: Orders
// ==========================================
const mockOrders = [
  { id: 'ORD-9824', client: 'LumenTech Sp. z o.o.', date: '2026-07-09', amount: '12 450.00 zł', status: 'processing', products: 'Zasilacze 150W (x20)' },
  { id: 'ORD-9823', client: 'Elektro-Instal Jan Kowalski', date: '2026-07-08', amount: '3 200.00 zł', status: 'completed', products: 'Sterowniki CCT (x5)' },
  { id: 'ORD-9822', client: 'Architektura Wnętrz SC', date: '2026-07-08', amount: '8 900.00 zł', status: 'completed', products: 'Taśmy 24V (x50m)' },
  { id: 'ORD-9821', client: 'Hurtownia Światła Bydgoszcz', date: '2026-07-07', amount: '45 000.00 zł', status: 'pending', products: 'Mix Zasilaczy (x100)' },
  { id: 'ORD-9820', client: 'Meblo-Styl', date: '2026-07-06', amount: '1 250.00 zł', status: 'cancelled', products: 'Profile KOZEL (x10)' },
];

function loadDashboardData() {
  document.getElementById('dash-new-orders').textContent = mockOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  document.getElementById('dash-total-products').textContent = products.length;
  document.getElementById('order-badge').textContent = mockOrders.length;

  const tbody = document.querySelector('#dash-orders-table tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  mockOrders.slice(0, 4).forEach(order => {
    let statusLabel = order.status;
    if (statusLabel === 'pending') statusLabel = 'Oczekujące';
    if (statusLabel === 'processing') statusLabel = 'W realizacji';
    if (statusLabel === 'completed') statusLabel = 'Zrealizowane';
    if (statusLabel === 'cancelled') statusLabel = 'Anulowane';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${order.id}</strong></td>
      <td>${order.client}</td>
      <td>${order.date}</td>
      <td><strong>${order.amount}</strong></td>
      <td><span class="status ${order.status}">${statusLabel}</span></td>
      <td>
        <button class="action-btn"><i class="ph ph-eye"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function loadOrdersData() {
  const tbody = document.querySelector('#orders-table tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  mockOrders.forEach(order => {
    let statusLabel = order.status;
    if (statusLabel === 'pending') statusLabel = 'Oczekujące';
    if (statusLabel === 'processing') statusLabel = 'W realizacji';
    if (statusLabel === 'completed') statusLabel = 'Zrealizowane';
    if (statusLabel === 'cancelled') statusLabel = 'Anulowane';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${order.id}</strong></td>
      <td>${order.client}</td>
      <td><span style="font-size: 12px; color: var(--text-main);">${order.products}</span></td>
      <td>${order.date}</td>
      <td><strong>${order.amount}</strong></td>
      <td><span class="status ${order.status}">${statusLabel}</span></td>
      <td>
        <button class="action-btn" title="Szczegóły"><i class="ph ph-eye"></i></button>
        <button class="action-btn" title="Faktura"><i class="ph ph-file-pdf"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// PRODUCTS MANAGEMENT
// ==========================================

function loadProductsData() {
  const tbody = document.querySelector('#products-table tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  products.forEach(prod => {
    const tr = document.createElement('tr');
    
    // Check what media it has
    let mediaIcons = '';
    if (prod.has3D || prod.modelSrc) mediaIcons += '<i class="ph ph-cube" title="Model 3D" style="color: #8b5cf6; margin-right: 4px;"></i>';
    if (prod.has360 || prod.images360Count) mediaIcons += '<i class="ph ph-arrows-clockwise" title="Widok 360" style="color: #ec4899; margin-right: 4px;"></i>';
    if (prod.video) mediaIcons += '<i class="ph ph-video-camera" title="Wideo" style="color: #ef4444; margin-right: 4px;"></i>';
    if (mediaIcons === '') mediaIcons = '<span style="color: #ccc; font-size: 12px;">Brak multimediów</span>';

    tr.innerHTML = `
      <td>
        <div class="product-cell">
          <img src="${prod.images && prod.images[0] ? prod.images[0] : '/images/placeholder.png'}" class="product-img">
          <div>
            <div class="product-name">${prod.title}</div>
            <div class="product-sku">ID: ${prod.id}</div>
          </div>
        </div>
      </td>
      <td>${prod.category || 'Inne'}</td>
      <td><strong>${prod.price.toFixed(2)} PLN</strong></td>
      <td><span class="status completed">W magazynie</span></td>
      <td style="font-size: 18px;">${mediaIcons}</td>
      <td><span class="status completed">Aktywny</span></td>
      <td>
        <button class="action-btn btn-edit" onclick="editProduct(${prod.id})" title="Edytuj"><i class="ph ph-pencil-simple"></i> Edytuj</button>
        <button class="action-btn btn-delete" onclick="deleteProduct(${prod.id})" title="Usuń"><i class="ph ph-trash"></i> Kosz</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  document.getElementById('dash-total-products').textContent = products.length;
}

window.openProductModal = function() {
  document.getElementById('product-form').reset();
  document.getElementById('prod-id').value = '';
  document.getElementById('product-modal-title').textContent = 'Dodaj Nowy Produkt';
  document.getElementById('product-modal').classList.add('active');
};

window.closeProductModal = function() {
  document.getElementById('product-modal').classList.remove('active');
};

window.editProduct = function(id) {
  const prod = products.find(p => p.id === id);
  if(!prod) return;
  
  document.getElementById('prod-id').value = prod.id;
  document.getElementById('prod-name').value = prod.title;
  document.getElementById('prod-sku').value = prod.id; // Using ID as SKU for mock
  document.getElementById('prod-category').value = prod.category || 'Inne';
  document.getElementById('prod-price').value = prod.price;
  document.getElementById('prod-desc').value = prod.description || '';
  
  document.getElementById('prod-img').value = (prod.images && prod.images[0]) ? prod.images[0] : '';
  document.getElementById('prod-video').value = prod.video || '';
  document.getElementById('prod-3d').value = prod.modelSrc || '';
  document.getElementById('prod-360').value = prod.images360Pattern || '';
  
  document.getElementById('product-modal-title').textContent = 'Edytuj Produkt';
  document.getElementById('product-modal').classList.add('active');
};

window.saveProduct = function() {
  const idVal = document.getElementById('prod-id').value;
  const name = document.getElementById('prod-name').value;
  const price = parseFloat(document.getElementById('prod-price').value) || 0;
  const category = document.getElementById('prod-category').value;
  const desc = document.getElementById('prod-desc').value;
  
  const imgUrl = document.getElementById('prod-img').value;
  const videoUrl = document.getElementById('prod-video').value;
  const url3d = document.getElementById('prod-3d').value;
  const url360 = document.getElementById('prod-360').value;

  if (!name) { alert("Wprowadź nazwę produktu"); return; }

  let prodIndex = -1;
  let prodObj = {};

  if (idVal) {
    prodIndex = products.findIndex(p => p.id == idVal);
    if(prodIndex > -1) {
      prodObj = products[prodIndex];
    }
  } else {
    // New product
    prodObj = {
      id: Date.now(),
      compareAtPrice: price * 1.2,
      colors: [],
      sizes: []
    };
  }

  prodObj.title = name;
  prodObj.price = price;
  prodObj.category = category;
  prodObj.description = desc;
  
  if(imgUrl) {
    prodObj.images = [imgUrl];
  }

  if(videoUrl) prodObj.video = videoUrl;
  else delete prodObj.video;

  if(url3d) {
    prodObj.has3D = true;
    prodObj.modelSrc = url3d;
  } else {
    prodObj.has3D = false;
    delete prodObj.modelSrc;
  }

  if(url360) {
    prodObj.has360 = true;
    prodObj.images360Pattern = url360;
    prodObj.images360Count = 36; // mock 36 frames
  } else {
    prodObj.has360 = false;
    delete prodObj.images360Pattern;
    delete prodObj.images360Count;
  }

  if(prodIndex > -1) {
    products[prodIndex] = prodObj;
  } else {
    products.push(prodObj);
  }

  // Save to local storage for frontend sync
  localStorage.setItem('sklepSC_products', JSON.stringify(products));
  
  closeProductModal();
  loadProductsData();
  
  // Also dispatch a storage event in case we want to listen for it
  window.dispatchEvent(new Event('storage'));
  
  // Show notification
  alert("Zapisano produkt!");
};

window.deleteProduct = function(id) {
  if(confirm("Czy na pewno chcesz przenieść ten produkt do kosza?")) {
    const idx = products.findIndex(p => p.id === id);
    if(idx > -1) {
      const deletedProd = products.splice(idx, 1)[0];
      deletedProd.deletedAt = new Date().toLocaleString();
      deletedProducts.push(deletedProd);
      
      localStorage.setItem('sklepSC_products', JSON.stringify(products));
      localStorage.setItem('sklepSC_deletedProducts', JSON.stringify(deletedProducts));
      
      loadProductsData();
      loadTrashData();
      window.dispatchEvent(new Event('storage'));
    }
  }
};

window.loadTrashData = function() {
  const tbody = document.getElementById('trash-list');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  deletedProducts.forEach(prod => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="status cancelled">Produkt</span></td>
      <td>
        <div class="product-name">${prod.title}</div>
        <div class="product-sku">ID: ${prod.id}</div>
      </td>
      <td>${prod.deletedAt || 'Nieznana data'}</td>
      <td>
        <button class="action-btn btn-restore" onclick="restoreProduct(${prod.id})" title="Przywróć"><i class="ph ph-arrow-u-up-left"></i> Przywróć</button>
        <button class="action-btn btn-delete" onclick="permanentDeleteProduct(${prod.id})" title="Usuń Trwale"><i class="ph ph-trash"></i> Usuń</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.restoreProduct = function(id) {
  const idx = deletedProducts.findIndex(p => p.id === id);
  if(idx > -1) {
    const prod = deletedProducts.splice(idx, 1)[0];
    delete prod.deletedAt;
    products.push(prod);
    
    localStorage.setItem('sklepSC_products', JSON.stringify(products));
    localStorage.setItem('sklepSC_deletedProducts', JSON.stringify(deletedProducts));
    
    loadProductsData();
    loadTrashData();
    window.dispatchEvent(new Event('storage'));
  }
};

window.permanentDeleteProduct = function(id) {
  if(confirm("UWAGA! Usunięcie z kosza jest nieodwracalne. Chcesz kontynuować?")) {
    const idx = deletedProducts.findIndex(p => p.id === id);
    if(idx > -1) {
      deletedProducts.splice(idx, 1);
      localStorage.setItem('sklepSC_deletedProducts', JSON.stringify(deletedProducts));
      loadTrashData();
    }
  }
};

window.emptyTrash = function() {
  if(deletedProducts.length === 0) return;
  if(confirm("Czy na pewno chcesz trwale usunąć WSZYSTKIE elementy z kosza? Operacji nie można cofnąć!")) {
    deletedProducts = [];
    localStorage.setItem('sklepSC_deletedProducts', JSON.stringify(deletedProducts));
    loadTrashData();
  }
};
