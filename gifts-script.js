// DATOS DE LOS REGALOS/RECURSOS
const giftsData = [
    {
        id: 1,
        name: "Hospital",
        icon: "🏥",
        description: "Hospital de alta calidad.",
        price: 0,
        category: "Mapas",
        image: "🏥"
    }
];

// CARRITO
let cart = JSON.parse(localStorage.getItem('giftsCart')) || [];

// FUNCIONES PRINCIPALES
function loadGifts(filter = 'all', searchTerm = '', maxPrice = 50) {
    const container = document.getElementById('giftsContent');
    
    let filtered = giftsData.filter(gift => {
        const matchesCategory = filter === 'all' || gift.category === filter;
        const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            gift.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = gift.price <= maxPrice;
        
        return matchesCategory && matchesSearch && matchesPrice;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #9aa3c1;">
                <p style="font-size: 16px; margin-bottom: 10px;">😔 No encontramos regalos con esos criterios</p>
                <p style="font-size: 13px;">Intenta cambiar los filtros o buscar otro término</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(gift => {
        const inCart = cart.find(item => item.id === gift.id);
        const btnClass = inCart ? 'gift-btn-added' : 'gift-btn-add';
        const btnText = inCart ? '✓ En Carrito' : '🛒 Reclamar';
        const btnOnClick = inCart ? `removeFromCart(${gift.id})` : `addToCart(${gift.id})`;

        return `
            <div class="gift-card" data-id="${gift.id}">
                <div class="gift-card-image">
                    <span class="gift-card-icon">${gift.icon}</span>
                </div>
                <div class="gift-card-content">
                    <div class="gift-card-name">${gift.name}</div>
                    <div class="gift-card-desc">${gift.description}</div>
                    <div class="gift-card-price">$${gift.price.toFixed(2)}</div>
                    <div class="gift-card-actions">
                        <button class="gift-btn gift-btn-view" onclick="viewGiftDetails(${gift.id})">Ver</button>
                        <button class="gift-btn ${btnClass}" id="btn-${gift.id}" onclick="${btnOnClick}">${btnText}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addToCart(id) {
    const gift = giftsData.find(g => g.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (!existing) {
        cart.push({ ...gift, quantity: 1 });
        saveCart();
        updateCartUI();
        
        // Efecto visual
        const btn = document.getElementById(`btn-${id}`);
        if (btn) {
            btn.classList.add('gift-btn-added');
            btn.textContent = '✓ En Carrito';
            btn.onclick = () => removeFromCart(id);
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    
    // Efecto visual
    const btn = document.getElementById(`btn-${id}`);
    if (btn) {
        btn.classList.remove('gift-btn-added');
        btn.textContent = '🛒 Regalar';
        btn.onclick = () => addToCart(id);
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.length;
}

function saveCart() {
    localStorage.setItem('giftsCart', JSON.stringify(cart));
}

function viewCart() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos regalos primero.');
        return;
    }
    
    // Guardar el carrito y redirigir a la página de reclamación
    window.location.href = 'gift-claim.html';
}

function viewGiftDetails(id) {
    const gift = giftsData.find(g => g.id === id);
    alert(`${gift.icon} ${gift.name}\n\n${gift.description}\n\nPrecio: $${gift.price.toFixed(2)}`);
}

// FILTROS
function setupFilters() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Filtros por categoría
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });

    // Rango de precio
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.querySelector('.price-max').textContent = `$${this.value}+`;
            applyFilters();
        });
    }
}

function applyFilters() {
    const activeFilter = document.querySelector('[data-filter].active');
    const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value : '';
    
    const priceRange = document.getElementById('priceRange');
    const maxPrice = priceRange ? parseInt(priceRange.value) : 50;
    
    loadGifts(filter, searchTerm, maxPrice);
}

function clearFilters() {
    // Reset búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset categoría
    document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    // Reset precio
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 50;
        document.querySelector('.price-max').textContent = '$50+';
    }
    
    loadGifts();
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    setupFilters();
    loadGifts();
    updateCartUI();
    setProfileInfo();
    setActiveNav();
});
