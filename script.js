// Configuración del background inicial
const defaultBackgrounds = {
    dark: {
        gradient: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0d1b2a 100%)',
        color: '#0a0e27'
    },
    neon: {
        gradient: 'linear-gradient(135deg, #0d0221 0%, #1a0033 50%, #0a0015 100%)',
        color: '#0d0221'
    },
    sunset: {
        gradient: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #1a0033 100%)',
        color: '#1a0033'
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    initBackground();
    setupEventListeners();
});

// Inicializar background
function initBackground() {
    const bg = document.getElementById('background');
    const storedBg = localStorage.getItem('creativosBackground');
    
    if (storedBg) {
        bg.style.backgroundImage = `url('${storedBg}')`;
    } else {
        // Usar background.png local si existe
        bg.style.backgroundImage = `url('background.png')`;
        bg.style.backgroundSize = 'cover';
        bg.style.backgroundPosition = 'center';
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Tecla 'C' para abrir panel de configuración
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'c') {
            toggleConfig();
        }
    });

    // Botón de descubre más
    const discoverMore = document.querySelector('.discover-more');
    if (discoverMore) {
        discoverMore.addEventListener('click', scrollDown);
    }
}

// Alternar panel de configuración
function toggleConfig() {
    const panel = document.getElementById('configPanel');
    panel.classList.toggle('active');
}

// Actualizar background con URL de imagen
function updateBackground() {
    const url = document.getElementById('bgUrl').value;
    if (url.trim() === '') {
        alert('Por favor ingresa una URL válida');
        return;
    }

    const img = new Image();
    img.onload = function() {
        const bg = document.getElementById('background');
        bg.style.backgroundImage = `url('${url}')`;
        localStorage.setItem('creativosBackground', url);
        showNotification('Background actualizado correctamente');
    };
    img.onerror = function() {
        alert('No se pudo cargar la imagen. Verifica la URL.');
    };
    img.src = url;
}

// Actualizar background con color sólido
function updateBackgroundColor() {
    const color = document.getElementById('bgColor').value;
    const bg = document.getElementById('background');
    bg.style.background = color;
    localStorage.setItem('creativosBackgroundColor', color);
    showNotification('Color de fondo actualizado');
}

// Presets de background
function setPreset(preset) {
    const bg = document.getElementById('background');
    
    if (preset === 'dark') {
        bg.style.background = defaultBackgrounds.dark.gradient;
        document.getElementById('bgColor').value = defaultBackgrounds.dark.color;
    } else if (preset === 'neon') {
        bg.style.background = defaultBackgrounds.neon.gradient;
        document.getElementById('bgColor').value = defaultBackgrounds.neon.color;
    } else if (preset === 'sunset') {
        bg.style.background = defaultBackgrounds.sunset.gradient;
        document.getElementById('bgColor').value = defaultBackgrounds.sunset.color;
    }
    
    localStorage.removeItem('creativosBackground');
    showNotification(`Preset "${preset}" aplicado`);
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #0011ff 0%, #0011ff 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
        font-weight: 600;
        letter-spacing: 0.5px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animación de scroll
function scrollDown() {
    window.scrollBy({
        top: window.innerHeight * 0.8,
        behavior: 'smooth'
    });
}

// Click en botón CTA
function handleClick() {
    window.location.href = 'signin.html';
}

// Animaciones adicionales CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Cargar configuración guardada
window.addEventListener('load', function() {
    const savedColor = localStorage.getItem('creativosBackgroundColor');
    if (savedColor) {
        document.getElementById('bgColor').value = savedColor;
    }
});