# Vinculación Sísmico Backend

API REST para el sistema de gestión de inspecciones sísmicas de edificios. Este backend proporciona servicios para la autenticación de usuarios, gestión de edificios, catálogos y administración de roles.

<img width="1344" height="619" alt="image" src="https://github.com/user-attachments/assets/107a674e-670a-489c-8c2d-3b3332bf6a50" />

## Arquitectura

El proyecto sigue una arquitectura limpia con separación de responsabilidades:

```
lib/
├── controllers/     # Controladores HTTP
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos
├── middleware/      # Middlewares de autenticación y validación
├── routes/          # Definición de rutas
├── schema/          # Validaciones con Zod
└── firebase/        # Configuración de Firebase Storage
```

## Características

- **Autenticación JWT** con tokens de acceso
- **Gestión de usuarios** con roles (admin, inspector, ayudante)
- **Subida de archivos** a Firebase Storage
- **Validaciones robustas** con Zod
- **Base de datos PostgreSQL** con Knex.js
- **Documentación automática** con Swagger
- **Arquitectura modular** y escalable

## Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL(Supabase)
- Cuenta de Firebase (para Storage)
- npm 

## Instalación

1. **Clona el repositorio:**
```bash
git clone [https://github.com/kevonlemon/vinculacion-sismico-backend.git]
cd vinculacion-sismico-backend
```

2. **Instala las dependencias:**
```bash
npm i
```

3. **Configura las variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vinculacion_sismico
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT
JWT_ACCESS_SECRET=tu_jwt_secret_muy_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_muy_seguro

# Firebase
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@sistema-vulnerabilidad-sismica.iam.gserviceaccount.com
FIREBASE_PROJECT_ID=sistema-vulnerabilidad-sismica

DOMAIN_URL_FIREBASE_STORAGE=https://storage.googleapis.com
STORAGE_BUCKET=sistema-vulnerabilidad-sismica.firebasestorage.app

# Servidor
PORT=3000
```

4. **Configura Firebase:**
- Coloca las credenciales de Firebase en el archivo .env
- Actualiza la configuración en `lib/firebase/firebase.js`

5. **Configura la base de datos:**
- Crea la base de datos PostgreSQL(Supabase)

## Ejecución

### Desarrollo (con auto-reload):
```bash
node --watch server.js
```

### Producción:
```bash
node server.js
```

El servidor se iniciará en `http://localhost:3000`

## Documentación API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:
```
http://localhost:3000/api-docs
```

## 🔐 Endpoints Principales

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario

### Usuarios
- `GET /users` - Obtener todos los usuarios activos
- `GET /users/byRole/:role` - Obtener usuarios por rol específico
- `GET /users/:id` - Obtener usuario por ID
- `PUT /users/:id` - Actualizar usuario (datos personales y foto de perfil)
- `PATCH /users/:id/role` - Actualizar rol de usuario (Solo administradores)

### Edificios
- `GET /buildings` - Listar edificios
- `POST /buildings` - Crear edificio
- `GET /buildings/:id` - Obtener edificio específico

### Catálogos
- `GET /catalogues` - Obtener catálogos del sistema

## 🛡️ Autenticación

El sistema utiliza JWT para autenticación. Para acceder a rutas protegidas:

1. Realiza login en `/auth/login`
2. Incluye el token en el header: `Authorization: Bearer <token>`

### Roles de Usuario
- **admin**: Acceso completo al sistema, puede gestionar roles de usuarios
- **inspector**: Puede crear y gestionar inspecciones
- **ayudante**: Acceso limitado de solo lectura

### Detalles de Endpoints de Usuarios

#### `GET /users/active`
- **Descripción**: Obtiene todos los usuarios activos del sistema
- **Permisos**: Requiere autenticación
- **Respuesta**: Array de usuarios con toda su información

#### `GET /users/byRole/:role` 
- **Descripción**: Obtiene usuarios filtrados por rol específico (admin, inspector, ayudante)
- **Permisos**: Requiere autenticación
- **Parámetros**: `role` - Rol a filtrar
- **Respuesta**: Array de usuarios activos con el rol especificado

#### `PUT /users/:id`
- **Descripción**: Actualiza información personal del usuario (nombre, email, teléfono, foto de perfil, contraseña)
- **Permisos**: Requiere autenticación
- **Características**: 
  - Actualización parcial (solo los campos enviados)
  - Requiere contraseña actual para cambiar contraseña
  - Soporte para subida de foto de perfil
  - Preserva datos existentes si se envían campos vacíos

#### `PATCH /users/:id/role`
- **Descripción**: Actualiza el rol de un usuario
- **Permisos**: Solo administradores
- **Características**: Cambio inmediato de permisos sin necesidad de re-login

## 📁 Estructura de Archivos

```
├── server.js              # Punto de entrada
├── data/
│   ├── database.js         # Configuración de base de datos
│   └── databaseTables.js   # Definición de tablas
├── lib/
│   ├── controllers/        # Lógica de controladores
│   ├── services/          # Lógica de negocio
│   ├── repositories/      # Acceso a datos
│   ├── middleware/        # Middlewares
│   ├── routes/           # Definición de rutas
│   ├── schema/           # Validaciones Zod
│   └── firebase/         # Configuración Firebase
├── utils.js              # Utilidades generales
├── anomaly.js           # Códigos de error
└── README.md
```

## Flujo de Datos

1. **Request** → Router → Middleware → Controller
2. **Controller** → Service → Repository → Database
3. **Response** ← Controller ← Service ← Repository


## Dependencias Principales

- **Express.js** - Framework web
- **Knex.js** - Query builder para PostgreSQL
- **JWT** - Autenticación
- **Zod** - Validación de schemas
- **Multer** - Manejo de archivos
- **Firebase Admin** - Storage en la nube
- **Bcrypt** - Hashing de contraseñas
- **Swagger** - Documentación API

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
