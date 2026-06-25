# TP2 - Gestor de Películas

Aplicación web SPA en React que permite buscar, visualizar y gestionar películas. Incluye scroll infinito con cursor-based pagination, multi-idioma, panel de administración y documentación Swagger.

**Desarrollado por:**

- Mateo Garcia (FAI-4226)
- Ignacio Bonorino (FAI-4863)

## Características

- ♾️ **Scroll infinito** con cursor-based pagination + caché en memoria
- 🔐 **Autenticación JWT**: Login, Register, sesión persistente, refresh tokens
- ❤️ **Favoritos** con optimistic update, protegidos por JWT
- 🌐 **Multi-idioma**: Español e Inglés (i18next)
- 📱 **Responsive**: Tailwind CSS + DaisyUI
- 🔧 **Panel admin**: CRUD de usuarios y películas con tabs (solo role admin)
- 📄 **Documentación API**: Swagger UI integrada
- 🚀 **Cancelación de requests** con AbortController

## Tecnologías

- React 19 + Vite
- Tailwind CSS + DaisyUI 5
- React Router DOM
- i18next
- react-infinite-scroll-hook (IntersectionObserver)
- Vitest + React Testing Library

## API

Este proyecto consume su propia API REST (backend del mismo TP):

- **URL base:** Configurable vía `VITE_API_URL` en `.env`
- **Paginación:** Cursor-based (cursor = ID de última película)
- **Documentación:** Swagger UI en `http://localhost:3000/api-docs`

## Requisitos

- Node.js 18+
- Backend corriendo en `http://localhost:3000` (ver [PWA-backend](https://github.com/Mateol20/PWA-backend))

## Instalación

```bash
git clone https://github.com/Mateol20/PWA-FRONTEND.git
cd PWA-FRONTEND
npm install
```

### Variables de entorno

```bash
cp .env.example .env
```

Por defecto apunta a `http://localhost:3000`. Si el backend está en otra URL, editar `.env`.

### Iniciar

```bash
npm run dev
```

Disponible en `http://localhost:5173`.

## Testing

```bash
npm test          # Modo watch
npm run test:run  # Una sola vez
```

### Estructura de tests

```
src/
├── Components/
│   ├── Etiqueta/Etiqueta.test.jsx
│   ├── Header/Header.test.jsx
│   ├── Footer/Footer.test.jsx
│   ├── ItemPelicula/ItemPelicula.test.jsx
│   └── TarjetaPelicula/TarjetaPelicula.test.jsx
├── pages/
│   ├── Home/Home.test.jsx
│   ├── DetallePelicula/DetallePelicula.test.jsx
│   └── Favoritos/PaginaDeFavoritos.test.jsx
└── services/
    ├── obtenerTodasLasPeliculas.test.js
    └── obtenerPeliculaPorId.test.js
```

## Estructura del proyecto

```
src/
├── Components/
│   ├── Header/               # Barra de navegación, búsqueda, login/logout, admin button
│   ├── Footer/               # Pie de página
│   ├── TarjetaPelicula/      # Grid contenedor de películas
│   ├── ItemPelicula/         # Tarjeta individual con botón de favorito
│   ├── FiltrosPelicula/      # Filtros por género y tipo
│   ├── ProtectedRoute/       # Ruta protegida (redirige a /login si no hay sesión)
│   └── Etiqueta/             # Badge de tipo (película/serie)
├── context/
│   ├── AuthContext.jsx        # Estado global de autenticación (JWT, login, register, logout)
│   ├── ContextoFavoritos.jsx  # Estado global de favoritos (optimistic update)
│   ├── ContextoBusqueda.jsx   # Estado global de búsqueda
│   ├── i18n.js                # Configuración de idiomas
│   └── locales/               # Archivos JSON de traducción
├── layouts/
│   └── adminLayout.jsx        # Layout del panel admin con tabs
├── pages/
│   ├── Home/                  # Página principal con scroll infinito
│   ├── DetallePelicula/       # Vista detallada con PDF export
│   ├── Favoritos/             # Lista de películas guardadas (protegida)
│   ├── Login/                 # Formulario de inicio de sesión
│   ├── Register/              # Formulario de registro
│   ├── NotFound/              # Página 404
│   └── Admin/
│       ├── Dashboard.jsx      # CRUD de usuarios
│       └── Movies.jsx         # CRUD de películas (admin)
├── services/
│   ├── auth.service.js        # API calls: login, register, getMe
│   ├── obtenerTodasLasPeliculas.js  # Lista paginada (cursor-based)
│   ├── obtenerPeliculaPorId.js      # Detalle de película
│   └── obtenerFavoritos.js          # Favoritos + toggle (con JWT)
├── utils/
│   ├── mapearPelicula.js      # Mapper compartido backend → frontend
│   └── cache.js               # Caché en memoria con TTL
├── App.jsx                    # Rutas y configuración principal (AuthProvider)
├── main.jsx                   # Punto de entrada
└── config.js                  # Constantes (API_URL, ITEMS_PER_PAGE)
```

## Arquitectura

### Paginación (cursor-based)

```
Request:  GET /api/peliculas?limit=8
Response: { data: [...], nextCursor: 16 }
          └── cursor para la siguiente página
Request:  GET /api/peliculas?cursor=16&limit=8
Response: { data: [...], nextCursor: null }
          └── no hay más páginas
```

### Caché

Los servicios de datos tienen caché en memoria con TTL de 5 minutos. La caché de favoritos se invalida al alternar un favorito.

### AbortController

Las requests se cancelan al cambiar el término de búsqueda o al desmontar el componente, evitando race conditions y requests innecesarias.

### Autenticación

- **AuthContext** provee `user`, `token`, `login()`, `register()`, `logout()` a toda la app
- El token JWT se persiste en `localStorage` y se restaura al recargar la página
- `<ProtectedRoute>` redirige a `/login` si no hay sesión activa
- El Header muestra "Ingresar" o "Bienvenido [nombre]" + "Salir" según el estado
- El botón Admin solo es visible si `user.role === "admin"`

### Favoritos

- **Protegidos con JWT**: se envía `Authorization: Bearer <token>` en cada request
- **Optimistic update**: la UI se actualiza instantáneamente antes de la respuesta del servidor
- **Sin rollback por ahora**: si la API falla, el estado local queda desincronizado
- La ruta `/favoritos` está envuelta en `<ProtectedRoute>`

### Panel Admin

- Solo visible si el usuario autenticado tiene role `admin`
- Tabs de navegación: Usuarios | Películas
- Modal CRUD con formularios
- Botón "API Docs" que abre Swagger en nueva pestaña
