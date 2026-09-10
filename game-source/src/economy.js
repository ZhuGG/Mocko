import {PATHS,growthFactor,permanentFactor,offlineLimit,cycleGoal,rootReward,wish,totalLevels} from './growth.js';
export const SAVE_KEY='moko-pocket-save-v1';
export const MAX_OFFLINE=8*3600;
export const MAX_VALUE=1e15;
export const GARDEN=[
 {id:'moss',name:'Tapis de mousse',description:'De petites pousses, de grandes promesses.',baseCost:12,growth:1.55,income:.3,unlock:0,icon:'leaf',scene:'moss'},
 {id:'mushrooms',name:'Champignons-lanternes',description:'Ils gardent un peu de soleil pour la nuit.',baseCost:40,growth:1.6,income:1.2,unlock:50,icon:'mushroom',scene:'mushrooms'},
 {id:'pond',name:'Source des lucioles',description:'L’eau murmure. Les lumières se rassemblent.',baseCost:140,growth:1.65,income:4,unlock:220,icon:'water',scene:'pond'},
 {id:'lanterns',name:'Arbre à lanternes',description:'Un refuge qui brille jusque dans les rêves.',baseCost:480,growth:1.7,income:12,unlock:800,icon:'spark',scene:'lanterns'}
];
export const FRIENDS=[
 {id:'fox',name:'Noisette',species:'Le renard curieux',description:'Un voisin discret, toujours prêt à partager une sieste.',cost:75,bonus:.2,unlock:60,icon:'fox',model:'Fox'},
 {id:'deer',name:'Brume',species:'La biche des clairières',description:'Là où elle passe, les jeunes pousses se réveillent.',cost:400,bonus:.4,unlock:300,icon:'deer',model:'Deer'},
 {id:'stag',name:'Orme',species:'Le gardien des bois',description:'Il apporte au refuge la patience des vieux arbres.',cost:1500,bonus:.7,unlock:1000,icon:'deer',model:'Stag'}
];
export const MEMORIES=[
 {id:'first',title:'Un endroit à soi',text:'Moko n’avait besoin que d’un petit coin de mousse. Le reste pouvait attendre.',reward:5,goal:1,value:s=>Object.values(s.levels).reduce((a,b)=>a+b,0)},
 {id:'hundred',title:'Les petites choses',text:'Une lueur, puis une autre. Les jours tranquilles font aussi de grandes histoires.',reward:25,goal:100,value:s=>s.earned},
 {id:'friend',title:'Une place pour deux',text:'Le refuge est devenu une maison le jour où quelqu’un est venu y rester.',reward:40,goal:1,value:s=>s.friends.length},
 {id:'five',title:'Des gestes qui comptent',text:'Moko prend soin de ce qui pousse. Les bois lui rendent cette douceur.',reward:75,goal:5,value:s=>Object.values(s.levels).reduce((a,b)=>a+b,0)},
 {id:'thousand',title:'La patience des bois',text:'Mille lumières sont nées, sans qu’il soit nécessaire de les presser.',reward:150,goal:1000,value:s=>s.earned},
 {id:'garden',title:'Le jardin des jours heureux',text:'De la mousse à la cime, chaque chose a trouvé sa place. Moko aussi.',reward:250,goal:4,value:s=>Object.values(s.levels).filter(n=>n>0).length},
 {id:'family',title:'Toute une petite famille',text:'On dit qu’un veilleur garde la forêt. Moko sait maintenant que la forêt le garde aussi.',reward:600,goal:3,value:s=>s.friends.length}
];
const bounded=n=>Math.max(0,Math.min(MAX_VALUE,Number.isFinite(n)?n:0));
export function freshState(now=Date.now()){return{version:2,cycles:0,roots:0,path:null,specs:{},wishes:0,wishStart:{earned:0,levels:0},light:20,earned:0,levels:{moss:0,mushrooms:0,pond:0,lanterns:0},friends:[],claimed:[],createdAt:now,lastTick:now,visits:1};}
export function bonus(s){return 1+FRIENDS.filter(f=>s.friends.includes(f.id)).reduce((n,f)=>n+f.bonus,0);}
export function rate(s){return(.2+GARDEN.reduce((n,g)=>n+g.income*s.levels[g.id]*growthFactor(s,g.id)*(1+Math.floor(s.levels[g.id]/10)*.5),0))*bonus(s)*permanentFactor(s);}
export function price(s,id){const item=GARDEN.find(g=>g.id===id);if(!item)return Infinity;return Math.ceil(item.baseCost*item.growth**Math.min(100,s.levels[id])*(s.specs?.[id]==='patient'?.7:1));}
export function credit(s,amount){amount=bounded(amount);s.light=bounded(s.light+amount);s.earned=bounded(s.earned+amount);return amount;}
export function settle(s,now=Date.now()){if(!Number.isFinite(now))return{amount:0,seconds:0,capped:false};const elapsed=Math.max(0,(now-s.lastTick)/1000),seconds=Math.min(offlineLimit(s),elapsed);const amount=credit(s,seconds*rate(s));s.lastTick=Math.max(s.lastTick,now);return{amount,seconds,capped:elapsed>offlineLimit(s)};}
export function buyGarden(s,id,now=Date.now()){settle(s,now);const g=GARDEN.find(g=>g.id===id);if(!g)return{ok:false,reason:'Cette pousse n’existe pas.'};if(s.earned<g.unlock)return{ok:false,reason:'Laissez encore grandir votre refuge.'};const cost=price(s,id);if(s.light+1e-9<cost)return{ok:false,reason:'Encore quelques lueurs de patience.'};s.light=Math.max(0,s.light-cost);s.levels[id]++;return{ok:true,cost};}
export function invite(s,id,now=Date.now()){settle(s,now);const f=FRIENDS.find(f=>f.id===id);if(!f||s.friends.includes(id))return{ok:false,reason:'Ce compagnon est déjà chez lui.'};if(s.earned<f.unlock)return{ok:false,reason:'Votre refuge est encore un peu trop discret.'};if(s.light+1e-9<f.cost)return{ok:false,reason:'Encore quelques lueurs avant son arrivée.'};s.light=Math.max(0,s.light-f.cost);s.friends.push(id);return{ok:true};}
export function claim(s,id,now=Date.now()){settle(s,now);const m=MEMORIES.find(m=>m.id===id);if(!m||s.claimed.includes(id)||m.value(s)<m.goal)return{ok:false,reason:'Ce souvenir n’est pas encore prêt.'};s.claimed.push(id);credit(s,m.reward);return{ok:true,reward:m.reward};}
export function parseSave(raw,now=Date.now()){try{const o=JSON.parse(raw);if(!o||![1,2].includes(o.version)||!o.levels||!Number.isFinite(o.lastTick))return null;const s=freshState(now);s.light=bounded(o.light);s.earned=bounded(o.earned);for(const g of GARDEN)s.levels[g.id]=Math.min(1000000,Math.max(0,Math.floor(Number(o.levels[g.id])||0)));s.friends=FRIENDS.filter(f=>Array.isArray(o.friends)&&o.friends.includes(f.id)).map(f=>f.id);s.claimed=MEMORIES.filter(m=>Array.isArray(o.claimed)&&o.claimed.includes(m.id)).map(m=>m.id);s.cycles=Math.floor(bounded(o.cycles));s.roots=Math.floor(bounded(o.roots));s.wishes=Math.floor(bounded(o.wishes));s.path=PATHS.some(p=>p.id===o.path)?o.path:null;s.specs={};for(const g of GARDEN)if(['lush','patient'].includes(o.specs?.[g.id]))s.specs[g.id]=o.specs[g.id];s.wishStart={earned:Math.min(s.earned,bounded(o.wishStart?.earned)),levels:Math.min(totalLevels(s),bounded(o.wishStart?.levels))};s.createdAt=Number.isFinite(o.createdAt)?Math.min(o.createdAt,now):now;s.lastTick=Math.min(o.lastTick,now);s.visits=Math.max(1,Math.floor(Number(o.visits)||1));return s;}catch{return null;}}
const number=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});
export function format(n,decimals=false){if(n>=1e12)return number.format(n/1e12)+' T';if(n>=1e9)return number.format(n/1e9)+' Md';if(n>=1e6)return number.format(n/1e6)+' M';if(n>=1e4)return number.format(n/1e3)+' k';return number.format(decimals?n:Math.floor(n));}
export function duration(seconds){if(seconds<60)return`${Math.ceil(seconds)} s`;if(seconds<3600)return`${Math.floor(seconds/60)} min`;return`${Math.floor(seconds/3600)} h ${Math.floor(seconds%3600/60)} min`;}

export function choosePath(s,id,now=Date.now()){settle(s,now);if(s.path||!PATHS.some(p=>p.id===id))return{ok:false,reason:'Une voie est déjà choisie pour ce jardin.'};s.path=id;return{ok:true};}
export function specialize(s,id,kind,now=Date.now()){settle(s,now);if(!GARDEN.some(g=>g.id===id)||s.levels[id]<5||s.specs[id]||!['lush','patient'].includes(kind))return{ok:false,reason:'Cette pousse ne peut pas encore se spécialiser.'};s.specs[id]=kind;return{ok:true};}
export function buyMany(s,id,count=1,now=Date.now()){let bought=0;for(let i=0;i<Math.min(25,count);i++){const result=buyGarden(s,id,now);if(!result.ok)return bought?{ok:true,bought}:result;bought++;}return{ok:true,bought};}
export function claimWish(s,now=Date.now()){settle(s,now);const w=wish(s);if(w.value<w.goal)return{ok:false,reason:'Ce souhait grandit encore.'};s.roots++;s.wishes++;s.wishStart={earned:s.earned,levels:totalLevels(s)};return{ok:true};}
export function rebirth(s,now=Date.now()){settle(s,now);if(s.earned<cycleGoal(s))return{ok:false,reason:'Le jardin n’est pas encore prêt à essaimer.'};const roots=rootReward(s);s.roots=Math.min(MAX_VALUE,s.roots+roots);s.cycles++;s.light=20;s.earned=0;for(const g of GARDEN)s.levels[g.id]=0;s.path=null;s.specs={};s.wishStart={earned:0,levels:0};return{ok:true,roots};}
