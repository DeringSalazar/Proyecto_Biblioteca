# Documentación de la API - Sistema de Biblioteca

## Descripción General
Esta es una API de backend basada en Node.js/Express para un sistema de gestión de biblioteca con soporte para categorías, códigos, colecciones, suscripciones y gestión de usuarios.

## Tabla de Contenidos
1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Instrucciones de Configuración](#instrucciones-de-configuración)
3. [Endpoints de la API](#endpoints-de-la-api)
4. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
5. [Autenticación](#autenticación)
6. [Manejo de Errores](#manejo-de-errores)
7. [Consideraciones de Seguridad](#consideraciones-de-seguridad)

## Estructura del Proyecto

```
Backend/
├── app.js                          # Punto de entrada principal
├── package.json                    # Dependencias y scripts
├── Controllers/                    # Controladores de lógica de negocio
│   ├── categoriesControllers.js
│   ├── codigoCategoriaControllers.js
│   ├── codigosControllers.js
│   ├── collectionsControllers.js
│   ├── subscriptionsControllers.js
│   └── usersControllers.js
├── Database/
│   └── db.js                       # Pool de conexión MySQL
├── Logs/                           # Registros de la aplicación
├── Middleware/
│   ├── authMiddleware.js           # Autenticación JWT
│   └── roleMiddleware.js           # Control de acceso basado en roles
├── Models/                         # Consultas a la base de datos
│   ├── categoriesModels.js
│   ├── codigoCategoriaModels.js
│   ├── codigosModels.js
│   ├── collectionsModels.js
│   ├── subscriptionsModels.js
│   └── usersModels.js
├── Routes/                         # Definición de rutas de API
└── Services/                       # Capa de servicios
```

## Instrucciones de Configuración

### Requisitos Previos
- Node.js (v14+)
- MySQL Server
- Docker (opcional, para la base de datos)

### Instalación

1. **Clonar el repositorio e instalar dependencias:**
```bash
cd Backend
npm install
```

2. **Configurar variables de entorno:**
Crear un archivo `.env` en el directorio `Backend`:
```env
DB_HOST=bjnrdtcl8f1kja2kcbzv-mysql.services.clever-cloud.com
DB_USER=u7obvqrj0dksmiub
DB_PORT=3306
DB_PASSWORD=5NZUueMIUvXGKPcNdjGv
DB_NAME=bjnrdtcl8f1kja2kcbzv
JWT_SECRET=secret123
JWT_EXPIRES_IN=1h
```

3. **Iniciar la base de datos (usando Docker):**
```bash
cd DB
docker-compose up -d
```

4. **Ejecutar la aplicación:**
```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:4000`

## Credenciales de Prueba

Se incluye un usuario de prueba en la base de datos para comenzar:

| Campo | Valor |
|-------|-------|
| **ID** | 1 |
| **Nombre** | Dering Salazar |
| **Email** | dering.1675@gmail.com |
| **Contraseña** | dering123@ |
| **Rol** | admin |
| **Fecha de Creación** | 2025-11-30 18:08:15 |

**Ejemplo de Login:**
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dering.1675@gmail.com",
    "password": "dering123@"
  }'
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Dering Salazar",
    "email": "dering.1675@gmail.com",
    "rol": "admin"
  }
}
```

Utiliza el token devuelto en el header `Authorization: Bearer <token>` para las siguientes solicitudes.

## Endpoints de la API

### URL Base
```
http://localhost:4000/api
```

### Autenticación
Todos los endpoints (excepto login) requieren autenticación JWT mediante el encabezado `Authorization`:
```
Authorization: Bearer <tu_token_jwt>
```

### Categorías (`/api/categories`)
Gestión de categorías de la biblioteca.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todas las categorías |
| GET | `/:id` | Obtener categoría por ID |
| GET | `/code/:id` | Obtener categoría por código |
| POST | `/` | Crear nueva categoría |
| PUT | `/` | Actualizar categoría |
| DELETE | `/:id` | Eliminar categoría |

**Solicitud para Crear Categoría:**
```json
{
  "nombre": "Ficción",
  "descripcion": "Libros de ficción",
  "estado": "activo"
}
```

**Solicitud para Actualizar Categoría:**
```json
{
  "id": 1,
  "nombre": "Ficción Actualizada",
  "descripcion": "Descripción actualizada",
  "estado": "activo"
}
```

---

### Suscripciones (`/api/subscriptions`)
Gestión de suscripciones de usuarios a categorías.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/user/:id` | Obtener suscripción por ID de usuario |
| GET | `/:id` | Obtener suscripción por ID |
| GET | `/feed/user/:id` | Obtener feed del usuario basado en suscripciones |
| POST | `/` | Crear nueva suscripción |
| PUT | `/` | Actualizar suscripción |
| DELETE | `/:id` | Eliminar suscripción |

**Solicitud para Crear Suscripción:**
```json
{
  "id_usuario": 1,
  "id_categoria": 2,
  "notificaciones": true
}
```

**Solicitud para Actualizar Suscripción:**
```json
{
  "id": 1,
  "notificaciones": false
}
```

**Ejemplo de Respuesta:**
```json
{
  "success": true,
  "message": "Suscripción obtenida correctamente",
  "subscription": {
    "id_suscripciones": 1,
    "id_usuario": 1,
    "id_categoria": 2,
    "fecha_suscripcion": "2024-01-15T10:30:00Z",
    "notificaciones": true
  }
}
```

---

### Códigos (`/api/codigos`)
Gestión de códigos de la biblioteca.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los códigos |
| GET | `/:id` | Obtener código por ID |
| POST | `/` | Crear nuevo código |
| PUT | `/` | Actualizar código |
| DELETE | `/:id` | Eliminar código |

---

### Códigos Categorías (`/api/codigos-categorias`)
Gestión de relaciones código-categoría.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los mapeos código-categoría |
| POST | `/` | Crear nuevo mapeo |
| DELETE | `/:id` | Eliminar mapeo |

---

### Colecciones (`/api/collections`)
Gestión de colecciones.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todas las colecciones |
| GET | `/:id` | Obtener colección por ID |
| POST | `/` | Crear nueva colección |
| PUT | `/` | Actualizar colección |
| DELETE | `/:id` | Eliminar colección |

---

### Usuarios (`/api/users`)
Gestión de cuentas de usuario.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los usuarios |
| GET | `/:id` | Obtener usuario por ID |
| POST | `/register` | Registrar nuevo usuario |
| POST | `/login` | Login de usuario |
| PUT | `/:id` | Actualizar usuario |
| DELETE | `/:id` | Eliminar usuario |

---

### Documentación de la API (`/api/documentacion`)
La documentación interactiva de Swagger está disponible en:
```
http://localhost:4000/api/documentacion
```

## Configuración de la Base de Datos

### Configuración del Pool de Conexión
La conexión a la base de datos es gestionada por `mysql2/promise` con la siguiente configuración:

```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,        // Máximo de conexiones
    queueLimit: 0               // Cola ilimitada
});
```

### Configuración de Docker Compose
El archivo `DB/docker-compose.yml` proporciona un contenedor MySQL preconfigurado.

**Para iniciar la base de datos:**
```bash
cd DB
docker-compose up -d
```

**Para detener la base de datos:**
```bash
docker-compose down
```

## Autenticación

### Middleware JWT
Todas las rutas protegidas utilizan autenticación JWT mediante [`authMiddleware`](Backend/Middleware/authMiddleware.js).

**Flujo de Autenticación:**
1. El usuario inicia sesión mediante `/api/users/login`
2. El servidor devuelve un token JWT
3. El cliente incluye el token en el encabezado `Authorization` para solicitudes posteriores
4. El middleware valida el token

**Formato del Token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Control de Acceso Basado en Roles
El [`roleMiddleware`](Backend/Middleware/roleMiddleware.js) restringe los endpoints según los roles de usuario.

## Manejo de Errores

### Respuesta de Error Estándar
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Información detallada del error"
}
```

### Códigos HTTP Comunes
| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos faltantes o inválidos |
| 401 | Unauthorized - Autenticación faltante o inválida |
| 409 | Conflict - Entrada duplicada |
| 500 | Internal Server Error - Error del servidor |

### Límite de Velocidad
La API utiliza `express-rate-limit` para prevenir abuso. Configure según sea necesario en los ajustes de la aplicación.

## Dependencias

| Paquete | Versión | Propósito |
|---------|---------|----------|
| express | ^5.1.0 | Framework web |
| cors | ^2.8.5 | Solicitudes de origen cruzado |
| dotenv | ^17.2.3 | Variables de entorno |
| mysql2 | ^3.15.3 | Driver MySQL |
| jsonwebtoken | ^9.0.2 | Autenticación JWT |
| bcrypt | ^6.0.0 | Hash de contraseñas |
| express-validator | ^7.3.1 | Validación de entrada |
| express-rate-limit | ^8.2.1 | Límite de velocidad |
| swagger-jsdoc | ^6.2.8 | Documentación Swagger |
| swagger-ui-express | ^5.0.1 | UI de Swagger |
| nodemon | ^3.1.11 | Recarga automática para desarrollo |

## Scripts de Desarrollo

```bash
# Iniciar servidor de desarrollo con recarga automática
npm run dev

# Iniciar servidor de producción
npm start

# Ejecutar pruebas (no configurado aún)
npm test
```

## Consideraciones de Seguridad

- ✅ Hash de contraseñas con bcrypt
- ✅ Autenticación basada en token JWT
- ✅ CORS habilitado para solicitudes de origen cruzado
- ✅ Validación de entrada con express-validator
- ✅ Límite de velocidad en endpoints de API
- ✅ Variables de entorno para datos sensibles
- ⚠️ Considera agregar HTTPS en producción
- ⚠️ Implementa mecanismo de actualización de token
- ⚠️ Agrega registro de solicitudes para auditoría

## Mejoras Futuras

- [ ] Implementar paginación para grandes conjuntos de datos
- [ ] Agregar registro de solicitudes/respuestas
- [ ] Implementar capa de caché (Redis)
- [ ] Agregar notificaciones por correo electrónico
- [ ] Implementar versionamiento de API
- [ ] Agregar pruebas unitarias exhaustivas
- [ ] Implementar pipeline de CI/CD
- [ ] Agregar sistema de migraciones de base de datos

## Soporte

Para problemas o preguntas, consulte la documentación de la API en `/api/documentacion`