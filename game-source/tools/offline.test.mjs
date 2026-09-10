import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';
test('production worker caches the complete app and serves it offline',async()=>{
 const dist=path.resolve('dist'),scope='http://localhost:4180/',events={},stores=new Map();let network=true;
 const fetchLocal=async input=>{if(!network)throw new Error('offline');const url=new URL(typeof input==='string'?input:input.url),name=url.pathname==='/'?'index.html':url.pathname.slice(1);const file=path.resolve(dist,name);assert.ok(file.startsWith(dist+path.sep));return{url:url.href,body:await fs.readFile(file)};};
 const caches={open:async name=>{if(!stores.has(name)){const records=new Map();stores.set(name,{addAll:async urls=>{for(const url of urls)records.set(url,await fetchLocal(url));},match:async input=>records.get(typeof input==='string'?input:input.url)});}return stores.get(name);},keys:async()=>[...stores.keys()],delete:async k=>stores.delete(k)};
 const self={registration:{scope},location:{origin:'http://localhost:4180'},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(name,fn)=>events[name]=fn};
 vm.runInNewContext(await fs.readFile('dist/sw.js','utf8'),{self,caches,fetch:fetchLocal,URL});
 let work;events.install({waitUntil:p=>work=p});await work;events.activate({waitUntil:p=>work=p});await work;network=false;
 const read=async(url,mode='cors')=>{let response;events.fetch({request:{url:new URL(url,scope).href,mode,method:'GET'},respondWith:p=>response=p});return await response;};
 const html=await read('','navigate');assert.ok(html.body.toString().includes('Moko'));const js=html.body.toString().match(/src="([^"]+\.js)"/)[1];assert.ok((await read(js)).body.length>1000);
 for(const asset of ['assets/character.glb','assets/animals/Fox.glb','assets/animals/Deer.glb','assets/animals/Stag.glb','icon-192.png'])assert.ok((await read(asset)).body.length>100);
});
