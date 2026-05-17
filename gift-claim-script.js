// FUNCIONES PARA RECLAMAR REGALOS

function initializeClaimPage() {
    // Obtener carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('giftsCart')) || [];
    
    if (cart.length === 0) {
        document.querySelector('.claim-container').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: #9aa3c1; margin-bottom: 20px;">🛒 Tu carrito está vacío</p>
                <a href="gifts.html" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00ffc8, #00ff8a); color: #000; text-decoration: none; border-radius: 10px; font-weight: 700;">Volver a Regalos</a>
            </div>
        `;
        return;
    }

    // Cargar items del carrito
    loadClaimItems(cart);
    
    // Cargar info del perfil en el formulario
    loadProfileInfo();
}

function loadClaimItems(cart) {
    const container = document.getElementById('claimItemsContainer');
    let total = 0;

    const itemsHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="claim-item">
                <div class="claim-item-icon">${item.icon}</div>
                <div class="claim-item-info">
                    <div class="claim-item-name">${item.name}</div>
                    <div class="claim-item-desc">${item.description}</div>
                </div>
                <div>
                    <div class="claim-item-price">$${item.price.toFixed(2)}</div>
                    <div class="claim-item-qty">x1</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = itemsHTML;
    
    // Actualizar total
    document.getElementById('claimTotal').textContent = `$${total.toFixed(2)}`;
    
    // Guardar total para después
    localStorage.setItem('claimTotal', total.toFixed(2));
}

function loadProfileInfo() {
    const username = localStorage.getItem('creativosDiscordUsername') || 'Usuario';
    const email = localStorage.getItem('creativosDiscordEmail') || '';
    
    // Pre-llenar el formulario si tenemos datos
    if (username) {
        document.getElementById('claimName').value = username;
    }
    if (email) {
        document.getElementById('claimEmail').value = email;
    }
}

function submitClaim(event) {
    event.preventDefault();
    
    const name = document.getElementById('claimName').value.trim();
    const email = document.getElementById('claimEmail').value.trim();
    const phone = document.getElementById('claimPhone').value.trim();
    const note = document.getElementById('claimNote').value.trim();
    const agree = document.getElementById('claimAgree').checked;

    // Validaciones
    if (!name) {
        alert('Por favor ingresa tu nombre completo');
        return;
    }
    if (!email) {
        alert('Por favor ingresa tu correo electrónico');
        return;
    }
    if (!agree) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }

    // Desabilitar botón
    const submitBtn = document.querySelector('.claim-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    // Simular envío de datos
    setTimeout(() => {
        // Guardar datos de la reclamación
        const claimData = {
            name,
            email,
            phone,
            note,
            timestamp: new Date().toISOString(),
            cart: JSON.parse(localStorage.getItem('giftsCart')) || [],
            total: localStorage.getItem('claimTotal')
        };

        localStorage.setItem('lastClaim', JSON.stringify(claimData));

        // Ocultar formulario
        document.querySelector('.claim-form').style.display = 'none';
        
        // Mostrar sección de descargas
        showDownloadSection();
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirmar y Descargar Regalos';
    }, 1000);
}

function showDownloadSection() {
    const downloadSection = document.getElementById('downloadSection');
    const cart = JSON.parse(localStorage.getItem('giftsCart')) || [];
    const total = localStorage.getItem('claimTotal');

    // Mostrar mensaje de éxito
    let html = `
        <div class="success-message">
            <div class="success-icon">✅</div>
            <div class="success-text">¡Reclamación Completada!</div>
            <div class="success-subtext">Tus regalos están listos para descargar</div>
        </div>
    `;

    // Agregar items descargables
    html += '<div class="download-items">';
    
    cart.forEach((item, index) => {
        html += `
            <div class="download-item">
                <div class="download-icon">${item.icon}</div>
                <div class="download-name">${item.name}</div>
                <div class="download-info">
                    <p>$${item.price.toFixed(2)}</p>
                    <p style="font-size: 11px; margin-top: 4px;">Listo para descargar</p>
                </div>
                <button class="download-btn" onclick="downloadGift('${item.name}', ${item.id})">
                    📥 Descargar
                </button>
            </div>
        `;
    });

    html += '</div>';
    
    // Agregar resumen
    html += `
        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
            <p style="color: #9aa3c1; font-size: 13px; margin-bottom: 15px;">Total reclamado: <span style="color: #00ffc8; font-weight: 700;">$${total}</span></p>
            <button onclick="finishClaim()" style="padding: 12px 30px; background: linear-gradient(135deg, #00ffc8, #00ff8a); color: #000; border: none; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; margin-right: 10px;">✓ Finalizar</button>
            <button onclick="window.location.href='gifts.html'" style="padding: 12px 30px; background: rgba(255, 255, 255, 0.1); color: #9aa3c1; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer;">Seguir Comprando</button>
        </div>
    `;

    downloadSection.innerHTML = html;
    downloadSection.style.display = 'block';
}

function downloadGift(giftName, giftId) {
    // Simular descarga
    alert(`📥 Iniciando descarga de "${giftName}"...`);
    
    // Crear un simulación de descarga
    const link = document.createElement('a');
    const content = `
        RECURSO: ${giftName}
        ID: ${giftId}
        Descargado: ${new Date().toLocaleString()}
        
        Este es tu recurso descargado de UnderWater
        `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    link.download = `${giftName.toLowerCase().replace(/\s+/g, '_')}.txt`;
    link.click();
}

function finishClaim() {
    // Limpiar carrito
    localStorage.removeItem('giftsCart');
    localStorage.removeItem('claimTotal');
    
    // Redirigir al dashboard
    alert('¡Gracias por tu compra! Los regalos están en tu cuenta.');
    window.location.href = 'dashboard.html';
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    initializeClaimPage();
    setProfileInfo();
    setActiveNav();
});
