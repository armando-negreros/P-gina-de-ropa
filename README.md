# ATELIER · Tienda de ropa

Proyecto local con React + Vite y backend Express, listo para Visual Studio Code. Marca, catálogo y precios ficticios de demostración, con fotografías reales de referencia; no procesa compras.

## Abrir y ejecutar

1. Instala Node.js 22.12 o superior y Visual Studio Code.
2. En VS Code, selecciona **Archivo → Abrir carpeta** y abre `atelier` (la carpeta que contiene este archivo).
3. Abre **Terminal → Nueva terminal** y ejecuta:

```powershell
npm install
npm run dev
```

4. Abre la dirección que muestra Vite, normalmente http://127.0.0.1:5173.
5. Selecciona **Crear cuenta**, registra por ejemplo `Maria_24` con una contraseña propia que cumpla los requisitos. El registro abre la bienvenida. Puedes cerrar sesión e ingresar de nuevo.

La aplicación tiene dos vistas con URL propia: **Acceso** (`/login`), que reúne inicio de sesión y registro; y **Bienvenida y tienda** (`/bienvenida`), con saludo personalizado, fotografías y catálogo. Al entrar se abre la segunda vista; al cerrar sesión se regresa al acceso. Los enlaces Colección y Nuestra esencia recorren secciones de la bienvenida. Ambas rutas admiten recargar el navegador.

No existe un usuario preconfigurado. No se requieren extensiones de VS Code ni Live Server.

## Reglas de acceso

Se interpretó “nomenclaturas” como nombre de usuario. Debe comenzar con letra ASCII, tener 3–24 caracteres y contener únicamente letras A–Z/a–z, números, punto o guion bajo. No acepta espacios, tildes ni otros símbolos en el usuario.

La contraseña acepta símbolos especiales y exige 8–72 caracteres, mayúscula, minúscula y número, sin espacios. La misma función valida en cliente y servidor. Se puede cambiar en `server/validation.js`.

## Estructura

- `src/main.jsx`: formulario, bienvenida y catálogo protegido.
- `src/styles.css`: diseño adaptable a teléfonos y computadoras.
- `server/app.js`: API, registro, sesiones y almacenamiento.
- `server/validation.js`: reglas compartidas.
- `tests/auth.test.js`: pruebas de autenticación.

Los usuarios persisten en `server/data/users.json`, creado automáticamente. Las contraseñas se almacenan con scrypt y salt aleatorio. Las cookies son HttpOnly, SameSite=Strict y expiran a las 8 horas; las sesiones quedan en memoria y terminan al reiniciar el backend. Hay límite de 20 intentos por IP en 15 minutos. Los datos locales no deben subirse a Git.

## Comprobar y compilar

```powershell
npm test
npm run build
npm start
```

Después de compilar, `npm start` sirve frontend y API en http://127.0.0.1:3001. Detén el modo desarrollo antes de usar este comando para liberar el puerto 3001.

API: POST `/api/register`, POST `/api/login`, GET `/api/me`, GET `/api/collection`, POST `/api/logout`.

## Alcance

Es una base educativa local. Para un despliegue real se necesita HTTPS, base de datos transaccional, almacenamiento compartido de sesiones, recuperación de cuentas y una revisión de seguridad. Con `NODE_ENV=production` las cookies requieren HTTPS. Las fuentes de Google son opcionales y tienen fuentes de sistema de respaldo; las fotografías están guardadas localmente en `public/images` y no requieren conexión para mostrarse. Consulta `FOTOGRAFIAS.md` para las fuentes.
