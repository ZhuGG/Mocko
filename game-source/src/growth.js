// Progression persists across gardens; no calendar deadlines or streak penalties.
export const PATHS=[
 {id:'wild',name:'Sous-bois sauvage',icon:'leaf',color:'#8caf78',description:'Mousses et champignons produisent deux fois plus. Une forêt foisonnante.'},
 {id:'water',name:'Jardin des brumes',icon:'water',color:'#83b9bf',description:'La source produit trois fois plus. Réserve d’absence portée à 24 heures.'},
 {id:'stars',name:'Verger céleste',icon:'spark',color:'#be9fc8',description:'Les lanternes produisent trois fois plus. Toutes les autres pousses gagnent 15 %.'}
];
export const SEASONS=['La saison des bourgeons','Les jours de miel','La forêt cuivrée','Les rêves de givre'];
export const totalLevels=s=>Object.values(s.levels).reduce((a,b)=>a+b,0);
export const cycleGoal=s=>Math.min(1e12,10000*(1+(s.cycles||0)*.35));
export const rootReward=s=>Math.max(1,Math.floor(Math.sqrt(s.earned/cycleGoal(s))));
export const season=s=>Math.floor(totalLevels(s)/20+(s.cycles||0))%4;
export const offlineLimit=s=>s.path==='water'?24*3600:8*3600;
export function growthFactor(s,id){const path=s.path;return (path==='wild'&&['moss','mushrooms'].includes(id)?2:path==='water'&&id==='pond'?3:path==='stars'?(id==='lanterns'?3:1.15):1)*(s.specs?.[id]==='lush'?1.8:s.specs?.[id]==='patient'?1.25:1);}
export const permanentFactor=s=>1+Math.sqrt(s.roots||0)*.5;
export function wish(s){const n=s.wishes||0,type=n%3,goal=type===0?5+Math.floor(n/3)*3:type===1?500*(1+Math.floor(n/3)):4+Math.floor(n/3)*2;return{type,goal,value:type===1?s.earned-(s.wishStart?.earned||0):totalLevels(s)-(s.wishStart?.levels||0),title:['Des mains dans la mousse','La lumière prend son temps','Un jardin un peu plus grand'][type],hint:type===1?`Créer ${goal.toLocaleString('fr-FR')} lueurs depuis ce souhait.`:`Faire pousser ${goal} nouveaux niveaux depuis ce souhait.`};}
