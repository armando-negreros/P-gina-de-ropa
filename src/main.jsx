import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { validate } from '../server/validation.js';
import Login from './Login.jsx';
import Store from './Store.jsx';
import './styles.css';

async function api(route,body) {
  const res=await fetch('/api/'+route,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  const data=await res.json();if(!res.ok)throw new Error(data.message);return data;
}
function App(){
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[register,setRegister]=useState(false),[username,setUsername]=useState(''),[password,setPassword]=useState(''),[show,setShow]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[products,setProducts]=useState([]),[notice,setNotice]=useState('');
  useEffect(()=>{api('me').then(setUser).catch(()=>{}).finally(()=>setLoading(false));},[]);
  useEffect(()=>{
    if(loading)return;
    const syncRoute=()=>{
      const pathname=user?'/bienvenida':'/login';
      if(window.location.pathname!==pathname)window.history.replaceState({},'',pathname);
      document.title=user?'Bienvenida | ATELIER':'Iniciar sesión | ATELIER';
    };
    syncRoute();window.addEventListener('popstate',syncRoute);
    window.scrollTo(0,0);
    return ()=>window.removeEventListener('popstate',syncRoute);
  },[user,loading]);
  useEffect(()=>{if(user)api('collection').then(setProducts).catch(e=>setError(e.message));},[user]);
  async function submit(e){e.preventDefault();setError('');const invalid=validate(username,password);if(invalid){setError(invalid);return;}setBusy(true);try{setUser(await api(register?'register':'login',{username,password}));setPassword('');}catch(e){setError(e.message);}finally{setBusy(false);}}
  async function logout(){try{await api('logout',{});setUser(null);setProducts([]);setNotice('');setError('');}catch(e){setError(e.message);}}
  if(loading)return <div className="splash">ATELIER<span>Cargando tu espacio…</span></div>;
  return <div className={user?'page-store':'page-login'}>
    <div className="announcement">Una nueva forma de vestir. Una forma más tuya. <span>COLECCIÓN DE TEMPORADA ↗</span></div>
    <header><a className="logo" href={user?'/bienvenida':'/login'}>ATELIER<span>ESTUDIO DE MODA</span></a>
      <nav aria-label="Navegación principal">{user?<><a href="#welcome-title">Inicio</a><a href="#collection">Colección</a><a href="#story">Nuestra esencia</a><button onClick={logout}>Cerrar sesión ↗</button></>:<span>Prendas que cuentan tu historia.</span>}</nav>
    </header>
    {user?<Store user={user} products={products} error={error} notice={notice} setNotice={setNotice}/>:<Login {...{register,setRegister,username,setUsername,password,setPassword,show,setShow,busy,error,setError,submit}}/>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
