# TP2 - Gestor de Películas

Aplicación web de página única (SPA) desarrollada en React que permite buscar, visualizar y gestionar películas. Incluye scroll infinito, traducción a español/inglés, y gestión de favoritos persistente.

**Desarrollado por:**

- Mateo Garcia (FAI-4226)
- Ignacio Bonorino (FAI-4863)

## Características

- ♾️ **Scroll infinito**: Carga automática de resultados usando `react-infinite-scroll-hook`.
- ❤️ **Favoritos globales**: Sincronización instantánea entre vistas con persistencia en `localStorage`.
- 🌐 **Multi-idioma**: Soporte para Español e Inglés (`i18next`).
- 📱 **Responsive**: Diseño adaptable con Tailwind CSS.

## Tecnologías

- React 19 + Vite
- Tailwind CSS
- React Router DOM
- i18next
- react-infinite-scroll-hook
- MockAPI
- Vitest
- React Testing Library
- jest-dom
- user-event

## API utilizada

Este proyecto consume una API REST falsa alojada en [MockAPI](https://mockapi.io/), utilizada para simular operaciones CRUD sobre un catálogo de películas.

**URL base:** `https://69e65c86ce4e908a155f6c79.mockapi.io/api/v1/peliculas`

**Endpoints:**
```
GET    /peliculas           # Obtener todas las películas
GET    /peliculas/:id       # Obtener una película por ID
POST   /peliculas           # Crear una nueva película
PUT    /peliculas/:id       # Actualizar una película
DELETE /peliculas/:id       # Eliminar una película
```

> La URL base se configura en `src/config.js`.

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/Mateol20/PWA2026.git
   cd PWA2026/TP2
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## Testing

El proyecto incluye tests automáticos utilizando **Vitest** y **React Testing Library**.

### Librerías instaladas para testing

| Librería                      | 
| ----------------------------- | 
| `vitest`                      |
| `@testing-library/react`      |
| `@testing-library/jest-dom`   |
| `@testing-library/user-event` |
| `jsdom`                       |

### Cómo ejecutar los tests

```bash
cd TP2
npm run test        # Ejecutar en modo watch
npm run test:run    # Ejecutar una sola vez
npm run "nombre del test.jsx" # Ejecutar un test en especifico
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

## Estructura del Proyecto

```
TP2/
├── services/
│   ├── getAllMovies.js          # Función para obtener lista de películas
│   └── getMovieById.js          # Función para obtener detalle de una película
├── src/
│   ├── Components/
│   │   ├── Header/              # Barra de navegación y búsqueda
│   │   ├── Footer/              # Pie de página
│   │   ├── TarjetaPelicula/     # Grid contenedor de películas
│   │   └── ItemPelicula/        # Tarjeta individual de película
│   ├── context/
│   │   ├── ContextoFavoritos.jsx # Estado global de favoritos
│   │   ├── ContextoBusqueda.jsx  # Estado global de búsqueda
│   │   ├── i18n.js               # Configuración de idiomas
│   │   └── locales/              # Archivos JSON (es.json, en.json)
│   ├── pages/
│   │   ├── Home/                 # Página principal con scroll infinito
│   │   ├── DetallePelicula/      # Vista de información detallada
│   │   └── Favoritos/            # Lista de películas guardadas
│   ├── App.jsx                   # Rutas y configuración principal
│   └── main.jsx                  # Punto de entrada
└── README.md
```
