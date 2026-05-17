// PAGE TRANSITION EFFECT
function initPageTransitions() {\n    document.querySelectorAll('.nav-item, .sidebar-nav a').forEach(link => {\n        link.addEventListener('click', function(e) {\n            const href = this.getAttribute('href');\n            \n            // No hacer transición si es un click a la misma página\n            if (!href || href === window.location.pathname || href === '') {\n                return;\n            }\n            \n            e.preventDefault();\n            \n            const dashboardPage = document.querySelector('.dashboard-page');\n            if (dashboardPage) {\n                dashboardPage.style.animation = 'pageTransitionOut 0.3s ease both';\n                \n                setTimeout(() => {\n                    window.location.href = href;\n                }, 300);\n            } else {\n                window.location.href = href;\n            }\n        });\n    });\n}\n\nfunction getDiscordData() {\n    const username = localStorage.getItem('creativosDiscordUser') || 'Invitado';\n    const days = localStorage.getItem('creativosDiscordDays') || '0';\n    return { username, days };\n}

function getInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

function updateText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function setActiveNav() {
    const current = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href === current) {
            item.classList.add('active');
        }
    });
}

function setProfileInfo() {
    const { username, days } = getDiscordData();
    const usernameLabel = username.startsWith('@') ? username : `@${username}`;
    const avatarUrl = localStorage.getItem('creativosDiscordAvatar');
    const email = localStorage.getItem('creativosDiscordEmail') || '-';
    const userId = localStorage.getItem('creativosDiscordId') || '-';
    const username_only = localStorage.getItem('creativosDiscordUsername') || '-';

    updateText('#profileName', username);
    updateText('#profileDays', `${days}d`);
    updateText('#welcomeTitle', `Bienvenido, ${username}`);
    updateText('#welcomeMeta', `${usernameLabel} • ${days}d en el servidor`);
    updateText('#userHandle', usernameLabel);
    updateText('#memberDays', `${days}d en el servidor`);
    updateText('#discordUser', username);
    updateText('#discordStatus', `${days}d en el servidor`);

    updateText('#discordName', username);
    updateText('#discordHandle', `@${username_only}`);
    updateText('#discordEmail', email);
    updateText('#discordUserId', userId);
    updateText('#discordIdSmall', userId);

    // Avatar pequeño en sidebar
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
        if (avatarUrl) {
            avatar.style.backgroundImage = `url('${avatarUrl}')`;
            avatar.textContent = '';
        } else {
            avatar.style.backgroundImage = '';
            avatar.textContent = getInitials(username);
        }
    }

    // Avatar grande en perfil
    const largeAvatar = document.getElementById('largeProfileAvatar');
    if (largeAvatar) {
        if (avatarUrl) {
            largeAvatar.style.backgroundImage = `url('${avatarUrl}')`;
            largeAvatar.textContent = '';
        } else {
            largeAvatar.style.backgroundImage = '';
            largeAvatar.textContent = getInitials(username);
        }
    }
}

function setupLogout() {
    document.querySelectorAll('.logout').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            localStorage.removeItem('creativosDiscordUser');
            localStorage.removeItem('creativosDiscordDays');
            localStorage.removeItem('creativosDiscordAvatar');
            localStorage.removeItem('creativosDiscordToken');
            window.location.href = 'index.html';
        });
    });
}

// ---------- Server status functionality ----------
// Endpoint público en GitHub Pages generado por la acción programada.
// El archivo server-status.json se actualiza automáticamente desde GitHub Actions.
const MTA_STATUS_API = 'https://jaxpr01.github.io/underwaterrp/server-status.json';

async function fetchServerStatus() {
    const panel = document.getElementById('serverStatusContent');
    if (!panel) return;

    if (!MTA_STATUS_API) {
        panel.innerHTML = `
            <p>No hay endpoint configurado para el estado del servidor.</p>
            <p>Configura la variable <strong>MTA_STATUS_API</strong> en <em>panel.js</em> con una URL que devuelva JSON.</p>
            <p>Ejemplo de respuesta esperada: <code>{ name, ip, port, players, maxPlayers, ping, uptime, online }</code></p>
        `;
        return;
    }

    panel.innerHTML = '<p>Obteniendo estado...</p>';
    try {
        const res = await fetch(MTA_STATUS_API, { cache: 'no-store' });
        if (!res.ok) throw new Error('Error al consultar el endpoint');
        const data = await res.json();
        const online = data.online === true;
        const statusLabel = online ? 'Online' : 'Offline';
        const statusClass = online ? 'status-dot green' : 'status-dot red';

        const html = `
            <ul>
                <li><strong>Nombre:</strong> ${data.name || '-'} </li>
                <li><strong>IP:</strong> ${data.ip || '-'}${data.port ? `:${data.port}` : ''}</li>
                <li><strong>Jugadores:</strong> ${data.players ?? '-'} / ${data.maxPlayers ?? '-'}</li>
                <li><strong>Ping:</strong> ${data.ping ?? '-'} ms</li>
                <li><strong>Uptime:</strong> ${data.uptime ?? '-'} </li>
                <li><strong>Estado:</strong> <span class="${statusClass}"></span> ${statusLabel}</li>
                <li><strong>Última actualización:</strong> ${data.timestamp || '-'}</li>
                ${data.error ? `<li><strong>Error:</strong> ${data.error}</li>` : ''}
            </ul>
        `;

        panel.innerHTML = html;
    } catch (err) {
        panel.innerHTML = `<p class="error">No se pudo obtener el estado del servidor: ${err.message}</p>`;
    }
}

function setupServerStatusUI() {
    const btn = document.getElementById('serverStatusBtn');
    const panel = document.getElementById('serverStatusPanel');
    const refresh = document.getElementById('refreshServerStatus');

    if (btn && panel) {
        btn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            if (panel.style.display === 'block') fetchServerStatus();
        });
    }

    if (refresh) {
        refresh.addEventListener('click', () => fetchServerStatus());
    }

    // Si existe el contenedor de contenido (página dedicada), cargar automáticamente el estado
    const content = document.getElementById('serverStatusContent');
    if (content && !btn) {
        fetchServerStatus();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveNav();
    setProfileInfo();
    setupLogout();
    initPageTransitions();
    setupServerStatusUI();
});
