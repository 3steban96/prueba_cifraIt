# Sistema de Gestión de Solicitudes

Sistema completo de gestión de solicitudes desarrollado con React y CoreUI, que permite a clientes crear solicitudes, personal de soporte gestionarlas, y administradores supervisar todo el proceso.

## 🚀 Características

### Panel Cliente
- Crear nuevas solicitudes con prioridad y categoría
- Ver historial de solicitudes propias
- Consultar estado y respuestas de solicitudes

### Panel Soporte
- Visualizar solicitudes asignadas
- Actualizar estado de solicitudes
- Redactar respuestas a clientes

### Panel Administrador
- Vista general de todas las solicitudes
- Filtros avanzados (cliente, estado, fecha)
- Estadísticas y métricas del sistema
- Conteo de solicitudes por estado, prioridad y categoría

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- npm >= 7.0.0 o yarn >= 1.22.0

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <url-repositorio>
cd sistema-solicitudes
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno (opcional):
Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:8080
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── assets/              # Recursos estáticos (CSS, imágenes)
├── components/          # Componentes reutilizables
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Select.jsx
│   ├── Table.jsx
│   └── TextArea.jsx
├── context/            # Context API
│   └── AuthContext.jsx
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   └── useRequests.js
├── layouts/            # Layouts por rol
│   ├── AdminLayout.jsx
│   ├── ClienteLayout.jsx
│   └── SupportLayout.jsx
├── pages/              # Páginas principales
│   ├── admin/
│   │   ├── AllRequests.jsx
│   │   └── Statistics.jsx
│   ├── auth/
│   │   └── Login.jsx
│   ├── client/
│   │   ├── CreateRequest.jsx
│   │   └── MyRequests.jsx
│   └── support/
│       ├── AssignedRequests.jsx
│       └── UpdateRequest.jsx
├── routes/             # Configuración de rutas
│   └── AppRouter.jsx
├── services/           # Servicios API
│   └── requestsService.js
├── utils/              # Utilidades
│   ├── constants.js
│   └── formatDate.js
├── App.jsx
└── main.jsx
```

## 🔐 Roles y Permisos

### Cliente
- Crear solicitudes
- Ver sus propias solicitudes
- Consultar respuestas

### Soporte
- Ver solicitudes asignadas
- Actualizar estado de solicitudes
- Redactar respuestas

### Administrador
- Acceso completo a todas las solicitudes
- Ver estadísticas del sistema
- Aplicar filtros avanzados

## 🛠️ Tecnologías Utilizadas

- **React 18** - Librería de UI
- **React Router DOM** - Enrutamiento
- **CoreUI** - Framework de componentes UI
- **Axios** - Cliente HTTP
- **Vite** - Build tool y dev server

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera el build de producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## 🌐 API Backend

El frontend espera que el backend esté disponible en `http://localhost:8080` con los siguientes endpoints:

### Autenticación
- `POST /login` - Iniciar sesión

### Solicitudes
- `POST /solicitudes` - Crear solicitud
- `GET /solicitudes/cliente/:clienteId` - Obtener solicitudes de un cliente
- `GET /solicitudes/soporte/:soporteId` - Obtener solicitudes asignadas a soporte
- `GET /solicitudes` - Obtener todas las solicitudes (con filtros opcionales)
- `PUT /solicitudes/:id` - Actualizar solicitud

### Administración
- `GET /estadisticas` - Obtener estadísticas del sistema
- `GET /clientes` - Obtener lista de clientes

## 🎨 Personalización

### Estilos
Los estilos globales se encuentran en `src/assets/styles/global.css`. CoreUI utiliza variables CSS que pueden ser personalizadas.

### Temas
CoreUI soporta temas claros y oscuros. Para cambiar el tema, modifica las clases en los layouts.

## 🚀 Deployment

Para generar el build de producción:

```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/` y pueden ser servidos por cualquier servidor web estático.

## 📝 Notas de Desarrollo

- El proyecto utiliza Context API para el manejo del estado de autenticación
- Las rutas están protegidas según el rol del usuario
- Se implementa manejo de errores en todas las peticiones HTTP
- Los formularios incluyen validación en el frontend

## 🤝 Contribuir
