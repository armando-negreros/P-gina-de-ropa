import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
const dataDir=process.env.DATA_DIR || fileURLToPath(new URL('./data/',import.meta.url));
const port=Number(process.env.PORT || 3001);
const host=process.env.HOST || (process.env.NODE_ENV==='production'?'0.0.0.0':'127.0.0.1');
const app=createApp(dataDir);
const server=app.listen(port,host,()=>console.log(`ATELIER escuchando en ${host}:${port}`));
function shutdown(){server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref();}
process.on('SIGTERM',shutdown);
process.on('SIGINT',shutdown);
