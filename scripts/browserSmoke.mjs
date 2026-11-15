// Test-only HTTP fixtures. Never served by the application or included in its build.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
const directory = process.argv[2];
if (!directory) throw new Error('Usage: node scripts/browserSmoke.mjs <isolated Vite build directory>');
const output = path.resolve('../docs/production/browser'); fs.mkdirSync(output, { recursive: true });
const roles = ['ADMIN_SISTEM','KETUA','PENGAWAS','PEMBINA','SEKRETARIS','BENDAHARA','BIDANG_SOSIAL','BIDANG_PENDIDIKAN','BIDANG_KESEHATAN','BIDANG_INFORMATIKA','HUMAS','DONATUR','PENERIMA_BANTUAN'];
const time = '2026-11-11T01:00:00.000Z';
const recipients = Array.from({length:15},(_,i)=>({id:i+1,nama:`Penerima Uji ${i+1}`,email:`test${i+1}@example.invalid`,role:'PENERIMA_BANTUAN',createdAt:time,penerimaBantuan:{id:i+100,userId:i+1,status:'DISETUJUI',alamat:'Alamat sintetis',alasan:'Pengujian',noHp:'000'}}));
const programs = Array.from({length:12},(_,i)=>({id:i+1,judul:`Program Uji ${i+1}`,deskripsi:'Data sintetis khusus pengujian browser',targetDana:1000000,terkumpul:20000,createdAt:time,donasi:[{jumlah:20000,status:'BERHASIL'}],penyaluranBantuan:[]}));
const donations = Array.from({length:15},(_,i)=>({id:i+1,jumlah:20000,status:'PENDING',metodePembayaran:'QRIS',createdAt:time,program:programs[0],donatur:{id:1,nama:'Donatur Uji',email:'donor@example.invalid'}}));
const applications = recipients.map((user,i)=>({id:i+1,userId:user.id,judul:'[SOSIAL] Permohonan Uji',deskripsi:'Data sintetis',jumlahDiajukan:10000,status:'MENUNGGU',createdAt:time,updatedAt:time,user}));
function fixture(url, role) {
 if (url === '/api/profil') return {id:1,nama:'Nama Akun Pengujian Panjang',email:'test@example.invalid',role,permissions:[],penerimaBantuan:{status:'DISETUJUI'}};
 if (url === '/api/program') return programs;
 if (url === '/api/donasi/transparansi') return {totalTerhimpun:20000,totalTersalurkan:10000,sisaSaldo:10000,totalTransaksiBerhasil:1,totalPenyaluranCount:1,trenDonasi:[],programRealisasi:[],penyaluranTerbaru:[]};
 if (url === '/api/admin/summary-keuangan') return {totalMasuk:20000,totalKeluar:10000,sisaSaldo:10000,donasiPending:15};
 if (url === '/api/admin/pengurus') return roles.slice(0,11).map((role,i)=>({id:i+1,role,nama:'Pengurus Uji',email:'staff@example.invalid',createdAt:time}));
 if (url === '/api/admin/penerima') return recipients;
 if (url === '/api/admin/penerima-pending') return recipients.map(user=>({...user.penerimaBantuan,status:'VERIFIKASI',user}));
 if (url === '/api/admin/donatur') return [{id:1,nama:'Donatur Uji',email:'donor@example.invalid',createdAt:time}];
 if (url === '/api/admin/donasi' || url === '/api/donasi/saya') return donations;
 if (url === '/api/admin/pengajuan' || url === '/api/pengajuan/saya') return applications;
 if (url === '/api/penyaluran/saya') return [];
 return [];
}
const server = http.createServer((req,res)=>{
 const pathname = new URL(req.url,'http://localhost').pathname;
 if (pathname.startsWith('/api/')) {
  const role=(req.headers.authorization||'').replace('Bearer smoke-','');
  res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({data:fixture(pathname,role)}));return;
 }
 const normalized=path.resolve(directory,'.'+pathname);
 const file=normalized.startsWith(path.resolve(directory)+path.sep)&&fs.existsSync(normalized)&&fs.statSync(normalized).isFile()?normalized:path.join(directory,'index.html');
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.jpeg':'image/jpeg'};
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'foundation-smoke-'));
const chrome=spawn(process.env.CHROME_BIN||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let ws;
const results=[],errors=[];
try {
 const portFile=path.join(profile,'DevToolsActivePort');
 for(let i=0;i<100&&!fs.existsSync(portFile);i++)await new Promise(r=>setTimeout(r,100));
 const port=fs.readFileSync(portFile,'utf8').split('\n')[0];
 const targets=await(await fetch(`http://127.0.0.1:${port}/json`)).json();
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let id=0;const pending=new Map();
 ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(new Error(m.error.message));else p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const request=++id;pending.set(request,{resolve,reject});ws.send(JSON.stringify({id:request,method,params}));});
 const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result?.value;
 await call('Page.enable');await call('Runtime.enable');
 const cases=[...roles.map(role=>({role,width:1366,path:role==='DONATUR'?'/donatur':role==='PENERIMA_BANTUAN'?'/penerima':'/admin'})),...[360,768,1024,1440].map(width=>({role:'',width,path:'/'})),{role:'',width:1366,path:'/missing-page'},{role:'',width:360,path:'/login'}];
 let initId;
 for(const scenario of cases){
  if(initId)await call('Page.removeScriptToEvaluateOnNewDocument',{identifier:initId});
  const init=await call('Page.addScriptToEvaluateOnNewDocument',{source:`localStorage.clear();${scenario.role?`localStorage.setItem('token',${JSON.stringify('smoke-'+scenario.role)});localStorage.setItem('user',${JSON.stringify(JSON.stringify({id:1,nama:'Nama Akun Pengujian Panjang',role:scenario.role}))});`:''}`});initId=init.identifier;
  await call('Emulation.setDeviceMetricsOverride',{width:scenario.width,height:900,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:base+scenario.path});
  for(let i=0;i<60;i++){await new Promise(r=>setTimeout(r,100));if(await evaluate(`document.readyState==='complete' && document.body.innerText.length>120 && !document.body.innerText.includes('Memverifikasi sesi')`))break;}
  await new Promise(r=>setTimeout(r,400));
  const state=await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth+1,text:document.body.innerText.length,main:!!document.getElementById('main-content'),has404:document.body.innerText.includes('Halaman tidak ditemukan'),userManagement:[...document.querySelectorAll('.admin-nav button')].some(b=>b.textContent.includes('Daftar Pengurus'))})`);
  results.push({...scenario,...state,status:!state.overflow&&state.text>120&&state.main&&(scenario.path!='/missing-page'||state.has404)&&(scenario.path!='/admin'||state.userManagement===(scenario.role==='ADMIN_SISTEM'))?'PASS':'FAIL'});
  if(scenario.path==='/'&&scenario.width===360||scenario.role==='KETUA'){
   const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,scenario.role?'dashboard-desktop.png':'home-mobile.png'),Buffer.from(shot.data,'base64'));
  }
 }
 fs.writeFileSync(path.join(output,'RESULTS.json'),JSON.stringify({environment:'Chrome headless; real built frontend; test-only mock API; no real database or transactions',results,errors},null,2));
 console.log(JSON.stringify({scenarios:results.length,failed:results.filter(r=>r.status!=='PASS'),runtimeErrors:errors},null,2));
 if(results.some(r=>r.status==='FAIL')||errors.length)process.exitCode=1;
} finally {ws?.close();chrome.kill();await new Promise(resolve=>server.close(resolve));}
