# Proyecto Los Simpson - Diseño de Software I

## Descripción

Aplicación web interactiva sobre el universo de Los Simpson que permite explorar personajes, episodios y ubicaciones de la serie. La aplicación ofrece una experiencia personalizada con temas claro/oscuro, internacionalización completa, sistema de autenticación, y funcionalidades de búsqueda avanzada con filtros.

## Características Principales

### Sistema de Autenticación
- Autenticación con Google
- Autenticación con correo electrónico y contraseña
- Integración completa con Firebase Authentication
- Perfil de usuario personalizado
- Gestión de sesiones

### Personalización
- Modo claro/oscuro con temas personalizados
- Soporte multiidioma (Español/Inglés)
- Internacionalización completa de la interfaz
- Diseño responsive para dispositivos móviles y escritorio

### Búsqueda y Filtros
- Sistema de búsqueda avanzado en tiempo real
- Búsqueda por nombre en personajes, episodios y ubicaciones
- Filtros dinámicos por:
  - Categoría (personajes, episodios, ubicaciones)
  - Género (para personajes)
  - Temporada (para episodios)
  - Estado (alive/deceased para personajes)
  - Ciudad y uso (para ubicaciones)
- Paginación de resultados (12 elementos por página)
- Scroll automático al cambiar de página

### Sistema de Favoritos
- Guardar tarjetas favoritas
- Sincronización en tiempo real con Firebase Firestore
- Página dedicada para ver colección de favoritos
- Persistencia de datos por usuario

### Analytics y Estadísticas
- Top 10 personajes más buscados
- Estadísticas por temporada
- Análisis de episodios completos
- Visualización de datos interactiva

### Visualización de Contenido
- Tarjetas (Cards) interactivas para personajes, episodios y ubicaciones
- Vista detallada de cada elemento
- Información completa: biografía, ocupación, frases, fechas, sinopsis, etc.
- Imágenes de alta calidad de la API oficial

## Tecnologías Utilizadas

### Frontend
- **React** 19.2.0 - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** 5.9.3 - Superset tipado de JavaScript
- **Vite** 7.2.4 - Build tool y servidor de desarrollo
- **React Router DOM** 7.11.0 - Enrutamiento para aplicaciones React

### Backend y Servicios
- **Firebase Authentication** - Sistema de autenticación
- **Firebase Firestore** - Base de datos NoSQL en tiempo real
- **The Simpsons API** - API externa para datos de Los Simpson

### Herramientas de Desarrollo
- **ESLint** - Linter para mantener código limpio
- **React Icons** - Biblioteca de iconos
- **CSS Modules** - Estilos modulares y encapsulados

## Estructura del Proyecto

```
Dise-o-de-Software-I-Proyecto/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon.svg
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Card.tsx
│   │   ├── CardDetail.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ...
│   ├── context/           # Context API
│   │   ├── AppContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── LanguageContext.tsx
│   ├── i18n/              # Internacionalización
│   │   ├── languages/
│   │   │   ├── es.ts
│   │   │   └── en.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── services/          # Servicios externos
│   │   └── simpsonsApi.ts
│   ├── styles/            # Estilos CSS
│   │   ├── components/
│   │   ├── theme-light.css
│   │   └── theme-dark.css
│   ├── App.tsx            # Página principal
│   ├── SearchResults.tsx  # Resultados de búsqueda
│   ├── Analytics.tsx      # Página de estadísticas
│   ├── favoritos.tsx      # Página de favoritos
│   ├── perfil.tsx         # Perfil de usuario
│   ├── login.tsx          # Login principal
│   ├── loginEmail.tsx     # Login con email
│   ├── loginGoogle.tsx    # Login con Google
│   ├── Routs.tsx          # Configuración de rutas
│   ├── firebaseConfig.ts  # Configuración de Firebase
│   └── main.tsx           # Punto de entrada
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Firebase (para autenticación y base de datos)

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Trabajos-TEC/Dise-o-de-Software-I-Proyecto.git
cd Dise-o-de-Software-I-Proyecto
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar Firebase:
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Authentication (Google y Email/Password)
   - Crear una base de datos Firestore
   - Copiar las credenciales de configuración
   - Actualizar `src/firebaseConfig.ts` con tus credenciales

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir en el navegador:
```
http://localhost:5173
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Vite
- `npm run build` - Compila el proyecto para producción
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run preview` - Previsualiza la build de producción

## Rutas de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal con tarjetas iniciales |
| `/login` | Página de login principal |
| `/loginEmail` | Login con correo electrónico |
| `/loginGoogle` | Login con Google |
| `/search` | Resultados de búsqueda con filtros |
| `/card/:id` | Vista detallada de una tarjeta |
| `/favoritos` | Colección de favoritos del usuario |
| `/perfil` | Perfil del usuario |
| `/analytics` | Estadísticas y análisis |

## Funcionalidades por Página

### Página Principal (/)
- Muestra tarjetas aleatorias de personajes, episodios y ubicaciones
- Navegación por categorías
- Búsqueda rápida en el header
- Scroll suave entre secciones

### Búsqueda (/search)
- Resultados filtrados por texto
- Filtros dinámicos según categoría
- Paginación de resultados
- Contador de resultados

### Favoritos (/favoritos)
- Lista de todas las tarjetas guardadas
- Sincronización en tiempo real
- Eliminar de favoritos
- Organización por tipo

### Analytics (/analytics)
- Top 10 personajes más buscados
- Estadísticas por temporada
- Gráficos y visualizaciones
- Análisis de datos

### Perfil (/perfil)
- Información del usuario
- Configuración de cuenta
- Historial de actividad

## Configuración de Firebase

El proyecto utiliza Firebase para:
- **Authentication**: Gestión de usuarios y sesiones
- **Firestore**: Almacenamiento de favoritos por usuario

Estructura de Firestore:
```
users/
  {userId}/
    favorites/
      {cardId}: {
        id: number,
        type: string,
        name: string,
        image_path: string,
        info1: string,
        info2: string,
        info3: string,
        extraInfo: object
      }
```

## API Externa

La aplicación consume datos de [The Simpsons API](https://thesimpsonsapi.com/):
- `/api/characters` - Personajes
- `/api/episodes` - Episodios
- `/api/locations` - Ubicaciones

## Arquitectura y Patrones

### Context API
- **ThemeContext**: Gestión del tema claro/oscuro
- **LanguageContext**: Gestión del idioma
- **AppContext**: Estado global de la aplicación

### Componentes Reutilizables
- Sistema de tarjetas (Cards) genéricas
- Layout principal compartido
- Botones de acción uniformes
- Header y Footer consistentes
