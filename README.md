# BildyApp API — Práctica Intermedia / Intermediate Practice

<details>
<summary>Español</summary>

## Descripción

API REST para la gestión de usuarios de BildyApp, una aplicación de albaranes de obra. Implementa el módulo completo de usuarios: registro, autenticación, onboarding, gestión de sesión y administración de cuentas.

---

## Tecnologías utilizadas

| Categoría | Tecnología |
|-----------|------------|
| Runtime | Node.js 22+ con ESM (`"type": "module"`) |
| Framework | Express 5 |
| Base de datos | MongoDB Atlas + Mongoose |
| Validación | Zod (con `.transform()` y `.refine()`) |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |
| Subida de archivos | Multer |
| Seguridad | Helmet, express-rate-limit, sanitización NoSQL |
| Eventos | EventEmitter (Node.js nativo) |
| Errores | Clase AppError + middleware centralizado |

---

## Requisitos previos

- Node.js 22 o superior
- Cuenta en MongoDB Atlas con un cluster creado

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd practica-intermedia

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores reales
```

---

## Variables de entorno

Crea un fichero `.env` en la raíz del proyecto con las siguientes variables:

```env
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombre_bd>
SERVER_PORT=3000
ACCESS_TOKEN_SECRET=<cadena_aleatoria_larga>
REFRESH_TOKEN_SECRET=<cadena_aleatoria_distinta>
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

Para generar los secretos JWT de forma segura:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Ejecución

```bash
npm run dev
```

Al arrancar correctamente verás:
```
Conexión exitosa a MongoDB
Servidor corriendo en el puerto 3000
```

---

## Estructura del proyecto

```
practica-intermedia/
├── src/
│   ├── config/
│   │   └── index.js              # Configuración centralizada (env vars)
│   ├── controllers/
│   │   └── user.controller.js    # Lógica de negocio de cada endpoint
│   ├── middleware/
│   │   ├── auth.middleware.js    # Verificación JWT
│   │   ├── error-handler.js      # Middleware centralizado de errores
│   │   ├── logger.middleware.js  # Logger de peticiones con timestamp
│   │   ├── role.middleware.js    # Autorización por roles
│   │   ├── sanitize.middleware.js # Sanitización NoSQL
│   │   ├── upload.js             # Configuración Multer (5MB máx.)
│   │   └── validate.js           # Middleware de validación Zod
│   ├── models/
│   │   ├── User.js               # Modelo con virtuals, indexes y soft delete
│   │   └── Company.js            # Modelo de compañía
│   ├── routes/
│   │   └── user.routes.js        # Definición de rutas
│   ├── services/
│   │   └── notification.service.js  # EventEmitter con listeners
│   ├── utils/
│   │   └── AppError.js           # Clase de error con factory methods
│   ├── validators/
│   │   └── user.validator.js     # Schemas Zod (transform + refine)
│   ├── app.js                    # Configuración Express + middlewares globales
│   └── index.js                  # Punto de entrada + conexión MongoDB
├── uploads/                      # Logos de compañías
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Endpoints implementados

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/user/register` | Registro de usuario | No |
| PUT | `/api/user/validation` | Verificación de email | JWT |
| POST | `/api/user/login` | Login | No |
| PUT | `/api/user/register` | Onboarding: datos personales | JWT |
| PATCH | `/api/user/company` | Onboarding: datos de compañía | JWT |
| PATCH | `/api/user/logo` | Subida de logo | JWT |
| GET | `/api/user` | Obtener perfil completo | JWT |
| POST | `/api/user/refresh` | Renovar access token | No |
| POST | `/api/user/logout` | Cerrar sesión | JWT |
| DELETE | `/api/user` | Eliminar usuario (hard/soft) | JWT |
| PUT | `/api/user/password` | Cambiar contraseña (bonus) | JWT |
| POST | `/api/user/invite` | Invitar compañero como guest | JWT + admin |

---

## Pruebas

Las pruebas se realizaron con `curl` desde la terminal siguiendo el flujo completo:

**1. Registro**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/register' \
  -H 'Content-Type: application/json' \
  -d '{"email":"usuario@test.com","password":"12345678"}'
```

**2. Verificación de email** — el código aparece en la consola del servidor
```bash
curl.exe -X PUT 'http://localhost:3000/api/user/validation' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"code":"<CODIGO_6_DIGITOS>"}'
```

**3. Login**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"usuario@test.com","password":"12345678"}'
```

**4. Onboarding datos personales**
```bash
curl.exe -X PUT 'http://localhost:3000/api/user/register' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"name":"Juan","lastName":"Garcia","nif":"12345678A"}'
```

**5. Onboarding compañía**
```bash
curl.exe -X PATCH 'http://localhost:3000/api/user/company' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"name":"Mi Empresa","cif":"B12345678","address":{"street":"Gran Via","number":"1","postal":"28013","city":"Madrid","province":"Madrid"},"isFreelance":false}'
```

**6. Subida de logo**
```bash
curl.exe -X PATCH 'http://localhost:3000/api/user/logo' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -F 'logo=@/ruta/imagen.jpg'
```

**7. Obtener perfil**
```bash
curl.exe -X GET 'http://localhost:3000/api/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

**8. Refresh token**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/refresh' \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

**9. Logout**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/logout' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

**10. Eliminar usuario**
```bash
# Soft delete
curl.exe -X DELETE 'http://localhost:3000/api/user?soft=true' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'

# Hard delete
curl.exe -X DELETE 'http://localhost:3000/api/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

**11. Cambiar contraseña (bonus)**
```bash
curl.exe -X PUT 'http://localhost:3000/api/user/password' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"currentPassword":"12345678","newPassword":"87654321"}'
```

**12. Invitar compañero**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/invite' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"email":"invitado@test.com","password":"12345678"}'
```

---

## Notas de implementación

- `express-mongo-sanitize` no es compatible con Express 5 — se implementó un middleware de sanitización personalizado equivalente.
- El `verificationCode` aparece en la consola del servidor al registrarse (simulando el envío por email).
- El refresh token se rota en cada uso.

</details>

---

<details>
<summary>English</summary>

## Description

REST API for user management in BildyApp, a delivery note management application. Implements the complete user module: registration, authentication, onboarding, session management and account administration.

---

## Technologies used

| Category | Technology |
|----------|------------|
| Runtime | Node.js 22+ with ESM (`"type": "module"`) |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose |
| Validation | Zod (with `.transform()` and `.refine()`) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| File upload | Multer |
| Security | Helmet, express-rate-limit, NoSQL sanitization |
| Events | EventEmitter (native Node.js) |
| Errors | AppError class + centralized middleware |

---

## Prerequisites

- Node.js 22 or higher
- MongoDB Atlas account with a cluster created

---

## Installation

```bash
# 1. Clone the repository
git clone <REPO_URL>
cd practica-intermedia

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your real values
```

---

## Environment variables

Create a `.env` file in the project root with the following variables:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db_name>
SERVER_PORT=3000
ACCESS_TOKEN_SECRET=<long_random_string>
REFRESH_TOKEN_SECRET=<different_random_string>
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

To generate secure JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Running the server

```bash
npm run dev
```

When started successfully you will see:
```
Conexión exitosa a MongoDB
Servidor corriendo en el puerto 3000
```

---

## Project structure

```
practica-intermedia/
├── src/
│   ├── config/
│   │   └── index.js              # Centralized configuration (env vars)
│   ├── controllers/
│   │   └── user.controller.js    # Business logic for each endpoint
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── error-handler.js      # Centralized error middleware
│   │   ├── logger.middleware.js  # Request logger with timestamp
│   │   ├── role.middleware.js    # Role-based authorization
│   │   ├── sanitize.middleware.js # NoSQL sanitization
│   │   ├── upload.js             # Multer configuration (5MB max)
│   │   └── validate.js           # Zod validation middleware
│   ├── models/
│   │   ├── User.js               # Model with virtuals, indexes and soft delete
│   │   └── Company.js            # Company model
│   ├── routes/
│   │   └── user.routes.js        # Route definitions
│   ├── services/
│   │   └── notification.service.js  # EventEmitter with lifecycle listeners
│   ├── utils/
│   │   └── AppError.js           # Error class with factory methods
│   ├── validators/
│   │   └── user.validator.js     # Zod schemas (transform + refine)
│   ├── app.js                    # Express config + global middlewares
│   └── index.js                  # Entry point + MongoDB connection
├── uploads/                      # Company logos
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Implemented endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/user/register` | User registration | No |
| PUT | `/api/user/validation` | Email verification with 6-digit code | JWT |
| POST | `/api/user/login` | Login | No |
| PUT | `/api/user/register` | Onboarding: personal data | JWT |
| PATCH | `/api/user/company` | Onboarding: company data | JWT |
| PATCH | `/api/user/logo` | Company logo upload | JWT |
| GET | `/api/user` | Get full profile with populated Company | JWT |
| POST | `/api/user/refresh` | Renew access token | No |
| POST | `/api/user/logout` | Logout | JWT |
| DELETE | `/api/user` | Delete user (hard/soft) | JWT |
| PUT | `/api/user/password` | Change password (bonus) | JWT |
| POST | `/api/user/invite` | Invite colleague as guest | JWT + admin |

---

## Testing

Tests were performed using `curl` from the terminal following the complete user flow:

**1. Register**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/register' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@test.com","password":"12345678"}'
```

**2. Verify email** — verification code appears in the server console
```bash
curl.exe -X PUT 'http://localhost:3000/api/user/validation' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"code":"<6_DIGIT_CODE>"}'
```

**3. Login**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@test.com","password":"12345678"}'
```

**4. Onboarding personal data**
```bash
curl.exe -X PUT 'http://localhost:3000/api/user/register' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"name":"John","lastName":"Doe","nif":"12345678A"}'
```

**5. Onboarding company**
```bash
curl.exe -X PATCH 'http://localhost:3000/api/user/company' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"name":"My Company","cif":"B12345678","address":{"street":"Main St","number":"1","postal":"28013","city":"Madrid","province":"Madrid"},"isFreelance":false}'
```

**6. Upload logo**
```bash
curl.exe -X PATCH 'http://localhost:3000/api/user/logo' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -F 'logo=@/path/to/image.jpg'
```

**7. Get profile**
```bash
curl.exe -X GET 'http://localhost:3000/api/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

**8. Refresh token**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/refresh' \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken":"<REFRESH_TOKEN>"}'
```

**9. Logout**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/logout' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

**10. Delete user**
```bash
# Soft delete
curl.exe -X DELETE 'http://localhost:3000/api/user?soft=true' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'

# Hard delete
curl.exe -X DELETE 'http://localhost:3000/api/user' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

**11. Change password (bonus)**
```bash
curl.exe -X PUT 'http://localhost:3000/api/user/password' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"currentPassword":"12345678","newPassword":"87654321"}'
```

**12. Invite colleague**
```bash
curl.exe -X POST 'http://localhost:3000/api/user/invite' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{"email":"guest@test.com","password":"12345678"}'
```

---

## Implementation notes

- `express-mongo-sanitize` is not compatible with Express 5 — a custom equivalent sanitization middleware was implemented instead.
- The `verificationCode` appears in the server console upon registration (simulating email delivery).
- The refresh token is rotated on every use — each call to `/refresh` returns a new token pair.

</details>
