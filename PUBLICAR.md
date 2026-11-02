# Publicar ATELIER

El proyecto sirve React y la API Express desde un mismo dominio, incluidas las rutas `/login` y `/bienvenida`. GitHub guarda el código; un servicio web de Node ejecuta la aplicación.

## GitHub

Sube el contenido de esta carpeta a la raíz del repositorio. Incluye `package-lock.json`, `public/images`, `src`, `server`, `tests`, `.github`, `render.yaml` y la configuración de Vite. No subas `node_modules`, `dist`, `.env` ni `server/data`.

La configuración de GitHub Actions comprueba pruebas y compilación en cada push o pull request.

## Render

Conecta el repositorio desde **New → Blueprint**. Render puede leer `render.yaml`, que configura una demostración gratuita de Node. Como alternativa, crea un **Web Service** con estos valores:

| Campo | Valor |
| --- | --- |
| Build command | `npm ci --include=dev && npm run build` |
| Start command | `npm start` |
| Health check | `/api/health` |
| NODE_ENV | `production` |
| NODE_VERSION | `24.14.0` |
| HOST | `0.0.0.0` |

`PORT` lo proporciona Render. El servicio debe desplegarse desde la raíz de este proyecto, donde está `package.json`.

### Guardado de cuentas

El plan gratuito usa archivos temporales: las cuentas pueden perderse con reinicios y despliegues. Sirve para demostrar el proyecto. El servicio gratuito también puede suspenderse por inactividad.

Para guardar las cuentas entre despliegues, revisa y autoriza primero un plan compatible con disco persistente, monta un disco y configura `DATA_DIR` con su ruta (por ejemplo `/var/data/atelier`). Las sesiones siguen en memoria: después de reiniciar se necesita volver a iniciar sesión. Usa una sola instancia mientras el almacenamiento sea un archivo JSON.

## Comprobar después de publicar

1. Abre la URL HTTPS devuelta por el alojamiento y verifica `/api/health`.
2. Registra una cuenta de prueba, confirma la bienvenida y el catálogo.
3. Recarga `/bienvenida`: debe mantener la sesión.
4. Cierra sesión e inicia de nuevo con la misma cuenta.

No habilites GitHub Pages para este proyecto completo: solo aloja contenido estático y no ejecutará la API Express.

Referencias: [Node en Render](https://render.com/docs/deploy-node-express-app), [servicios web](https://render.com/docs/web-services), [discos persistentes](https://render.com/docs/disks).
