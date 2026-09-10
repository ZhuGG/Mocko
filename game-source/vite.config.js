import { defineConfig } from 'vite';
import {createHash} from 'node:crypto';
const assets=['character.glb',...['tree_detailed','tree_oak','tree_small','mushroom_redGroup','flower_yellowC','flower_purpleA','grass_large','rock_smallA','plant_bush'].map(n=>'nature/'+n+'.glb'),...['Fox','Deer','Stag'].map(n=>'animals/'+n+'.glb')].map(p=>'assets/'+p);
export default defineConfig({base:'./',build:{chunkSizeWarningLimit:750},plugins:[{name:'moko-offline',generateBundle(options,bundle){const revision=createHash('sha256').update(Object.keys(bundle).sort().join('|')).digest('hex').slice(0,12);const files=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png',...Object.keys(bundle),...assets];this.emitFile({type:'asset',fileName:'sw.js',source:`const CACHE='moko-pocket-${revision}';
const FILES=${JSON.stringify([...new Set(files)])};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(f=>new URL(f,self.registration.scope).href))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('moko-pocket-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
if(request.mode==='navigate'){event.respondWith(fetch(request).catch(()=>caches.open(CACHE).then(cache=>cache.match(new URL('index.html',self.registration.scope).href))));return;}
event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(request);if(cached)return cached;return fetch(request);}));});`});}}]});
