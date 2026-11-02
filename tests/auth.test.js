import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../server/app.js';
import {validate} from '../server/validation.js';

test('validación de usuario y contraseña',()=>{assert.equal(validate('Maria_24','Seguro!2026'),null);for(const [u,p] of [['12maria','Seguro!2026'],['ma ria','Seguro!2026'],['maria','solo_letras'],['maria','Seguro 2026!'],['maria','Corta1!']])assert.ok(validate(u,p));});
test('registro persistente, acceso protegido y cierre de sesión',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'atelier-')); const server=createApp(dir).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const url=`http://127.0.0.1:${server.address().port}/api/`;
 const post=(route,body,cookie='')=>fetch(url+route,{method:'POST',headers:{'Content-Type':'application/json',cookie},body:JSON.stringify(body)});
 try {
 assert.equal((await fetch(url+'collection')).status,401);
 assert.equal((await post('register',{username:'bad user',password:'Seguro!2026'})).status,400);
 const body={username:'Maria_24',password:'Seguro!2026'};const registration=await post('register',body);assert.equal(registration.status,200);const cookie=registration.headers.get('set-cookie').split(';')[0];assert.match(registration.headers.get('set-cookie'),/HttpOnly/);
 assert.equal((await post('register',body)).status,409);
 assert.equal((await fetch(url+'collection',{headers:{cookie}})).status,200);
 assert.equal((await fetch(url+'me',{headers:{cookie}})).status,200);
 assert.equal((await post('login',{...body,password:'Incorrecta!123'})).status,401);
 assert.equal((await post('login',body)).status,200);
 assert.ok(!readFileSync(path.join(dir,'users.json'),'utf8').includes(body.password));
 await post('logout',{},cookie);assert.equal((await fetch(url+'me',{headers:{cookie}})).status,401);
 }finally{await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
});
