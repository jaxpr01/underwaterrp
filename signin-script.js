// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    initBackground();
});

const DISCORD_CLIENT_ID = '1505077301547761716'; // Pon aquí tu Client ID de Discord
// Si alojas la web en este mismo dominio, deja vacío para usar oauth-callback.html local
const DISCORD_REDIRECT_URI = 'https://jaxpr01.github.io/underwaterrp/oauth-callback.html'; // Ejemplo: 'https://tudominio.com/oauth-callback.html'
const DISCORD_OAUTH_SCOPE = 'identify email';

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

// Función para login con Discord
function loginDiscord() {
    if (!DISCORD_CLIENT_ID) {
        showNotification('Configura tu Client ID de Discord en signin-script.js');
        return;
    }

    const defaultRedirect = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, 'oauth-callback.html')}`;
    const redirectUri = DISCORD_REDIRECT_URI || defaultRedirect;
    const state = Math.random().toString(36).slice(2);
    localStorage.setItem('discord_oauth_state', state);

    const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: DISCORD_OAUTH_SCOPE,
        state,
        prompt: 'consent'
    });

    window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
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
        background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
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

// Animaciones
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
