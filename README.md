# Guía de Configuración - Creativos RP

## Instrucciones de Discord OAuth

### 1. Crear aplicación en Discord Developer Portal

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en "New Application"
3. Dale un nombre (ej: "Creativos RP")
4. Ve a la sección "OAuth2" en el menú lateral
5. Copia el "CLIENT_ID"

### 2. Configurar el Redirect URI

1. En Discord Developer Portal, ve a "OAuth2" → "General"
2. Haz clic en "Add Redirect" y añade:
   ```
   https://tudominio.com/oauth-callback.html
   ```
   (En local para pruebas: `http://localhost:8000/oauth-callback.html`)

3. **Importante**: Haz coincidir exactamente con la URL de tu servidor

### 3. Configurar en el código

En `signin-script.js`, reemplaza:

```javascript
const DISCORD_CLIENT_ID = 'TU_CLIENT_ID';  // Aquí va tu CLIENT_ID
const DISCORD_REDIRECT_URI = ''; // Deja vacío para usar oauth-callback.html en tu dominio actual
```

### 4. Ejecutar localmente (para pruebas)

```bash
cd c:\Users\yashi\Desktop\PaginaWeb
python -m http.server 8000
```

Luego accede a: `http://localhost:8000`

## Estructura de carpetas

```
PaginaWeb/
├── index.html              (Página 1: Landing)
├── signin.html             (Página 2: Login)
├── oauth-callback.html     (Callback de Discord OAuth)
├── dashboard.html          (Página 3: Dashboard)
├── perfil.html             (Mi Perfil)
├── aplicaciones.html       (Aplicaciones)
├── normativas.html         (Normativas)
├── styles.css              (Estilos de index)
├── signin-styles.css       (Estilos de signin)
├── dashboard-styles.css    (Estilos del dashboard y demás)
├── script.js               (Scripts de index)
├── signin-script.js        (Scripts de signin)
├── panel.js                (Scripts del dashboard y panel)
└── background.png          (Imagen de fondo)
```

## Flujo de navegación

1. **index.html** → Botón "Comenzar Aventura" → signin.html
2. **signin.html** → Botón "Continuar con Discord" → Discord OAuth
3. **oauth-callback.html** → Procesa token → **dashboard.html**
4. **dashboard.html** → Navegación a perfil, aplicaciones, normativas
5. **Cerrar Sesión** → Limpia localStorage → Vuelve a index.html

## Características implementadas

✅ Landing page con animaciones  
✅ Página de login con Discord OAuth  
✅ Dashboard dinámico con datos reales de Discord  
✅ Avatar real de Discord (pequeño y grande)  
✅ Nombre de usuario y días en servidor  
✅ Navegación entre páginas  
✅ Cierre de sesión completo  
✅ Background personalizable (tecla C)  
✅ Responsive design  

## Notas importantes

- El token de Discord se guarda localmente en `localStorage` por seguridad (en producción usar backend)
- El avatar se obtiene de CDN de Discord
- Si el usuario no tiene avatar, se mostrarán sus iniciales
- El localStorage se limpia completamente al hacer logout
