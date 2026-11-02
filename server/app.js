import express from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import path from 'node:path';
import { validate } from './validation.js';

export function createApp(dataDir) {
  mkdirSync(dataDir, { recursive: true });
  const db = path.join(dataDir, 'users.json');
  let users = existsSync(db) ? JSON.parse(readFileSync(db, 'utf8')) : [];
  const sessions = new Map(), attempts = new Map();
  const app = express();
  if(process.env.RENDER==='true') app.set('trust proxy',1);
  app.disable('x-powered-by');
  app.use((req,res,next)=>{res.set('X-Content-Type-Options','nosniff');res.set('Referrer-Policy','strict-origin-when-cross-origin');res.set('X-Frame-Options','DENY');next();});
  app.use(express.json({ limit: '8kb' }));
  app.use('/api', (req,res,next) => {res.set('Cache-Control','no-store'); next();});
  app.get('/api/health',(req,res)=>res.json({status:'ok'}));
  const cookie = req => { const token = /(?:^|;\s*)atelier_session=([a-f0-9]+)/.exec(req.headers.cookie || '')?.[1]; return { token, session: sessions.get(token) }; };
  const auth = (req,res,next) => { const {session}=cookie(req); if (!session || session.expires < Date.now()) return res.status(401).json({message:'Inicia sesión para continuar.'}); req.user = users.find(u=>u.id===session.id); if(!req.user) return res.sendStatus(401); next(); };
  app.post('/api/:action', (req,res,next) => {
    if (!['login','register'].includes(req.params.action)) return next();
    const key=req.ip, now=Date.now();
    const a=attempts.get(key); if(a && a.until>now && a.count>=20) return res.status(429).json({message:'Demasiados intentos. Intenta de nuevo en 15 minutos.'});
    attempts.set(key, {count:a?.until>now?a.count+1:1, until:a?.until>now?a.until:now+900000});
    const {username,password}=req.body || {}; const error=validate(username,password);
    if(error) return res.status(400).json({message:error});
    let user=users.find(u=>u.username.toLowerCase()===username.toLowerCase());
    if(req.params.action==='register') {
      if(user) return res.status(409).json({message:'Este usuario ya está registrado.'});
      const salt=randomBytes(16).toString('hex');
      user={id:randomBytes(16).toString('hex'),username,salt,hash:scryptSync(password,salt,64).toString('hex')};
      users.push(user); writeFileSync(db+'.tmp',JSON.stringify(users,null,2), {mode:0o600}); renameSync(db+'.tmp',db);
    } else {
      const hash=scryptSync(password,user?.salt || 'invalid-user-salt',64);
      if(!user || !timingSafeEqual(hash,Buffer.from(user.hash,'hex'))) return res.status(401).json({message:'Usuario o contraseña incorrectos.'});
    }
    attempts.delete(key);
    const token=randomBytes(32).toString('hex'); sessions.set(token,{id:user.id,expires:now+8*60*60*1000});
    res.cookie('atelier_session',token,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',maxAge:8*60*60*1000,path:'/'});
    res.json({username:user.username});
  });
  app.get('/api/me',auth,(req,res)=>res.json({username:req.user.username}));
  app.post('/api/logout',(req,res)=>{sessions.delete(cookie(req).token);res.clearCookie('atelier_session',{path:'/'});res.json({ok:true});});
  app.get('/api/collection',auth,(req,res)=>res.json([{name:'Top esencial sin mangas',category:'ESENCIALES',price:249,color:'Blanco' ,kind:'shirt'},{name:'Bolso trenzado con cadena',category:'ACCESORIOS',price:329,color:'Caramelo',kind:'bag'},{name:'Suéter tejido',category:'NUEVA COLECCIÓN',price:299,color:'Verde oliva',kind:'sweater'}]));
  app.use('/api',(req,res)=>res.status(404).json({message:'Ruta no encontrada.'}));
  app.use(express.static(path.resolve('dist')));
  app.get('/{*path}',(req,res)=>res.sendFile(path.resolve('dist/index.html')));
  app.use((err,req,res,next)=>res.status(err.status || 500).json({message:err.status===400?'Solicitud inválida.':'Ocurrió un error en el servidor.'}));
  const timer=setInterval(()=>{const now=Date.now();for(const [k,v] of sessions) if(v.expires<now)sessions.delete(k);for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);},60000);timer.unref();
  return app;
}
