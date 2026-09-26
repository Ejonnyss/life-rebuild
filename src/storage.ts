import {freshState,daysAway,type State} from './engine';
const KEY='life-rebuild-state-v1';
function plain(value:unknown):value is Record<string,unknown>{return Boolean(value)&&typeof value==='object'&&!Array.isArray(value)}
export function validateState(value:unknown):value is State{
 if(!plain(value)||value.schemaVersion!==1||typeof value.onboarded!=='boolean'||typeof value.name!=='string'||value.name.length>200||typeof value.lastSeen!=='string'||Number.isNaN(Date.parse(value.lastSeen))||!plain(value.xp)||!plain(value.directions)||!plain(value.money)||!plain(value.real)||!plain(value.smallSteps)||!Array.isArray(value.history)||!Array.isArray(value.achievements)||!Array.isArray(value.notes))return false;
 if(value.history.length>20000||value.notes.length>5000||value.achievements.length>100)return false;
 const areas=['base','career','contracts','body','studio','life'];const xp=value.xp as Record<string,unknown>;const directions=value.directions as Record<string,unknown>;
 if(!areas.every(a=>typeof xp[a]==='number'&&Number.isFinite(xp[a])&&Number(xp[a])>=0&&typeof directions[a]==='boolean'))return false;
 if(!['low','medium','high'].includes(String(value.energy))||!['hard','usual','easy'].includes(String(value.focus))||![15,30,60,120].includes(Number(value.minutes))||![0,1,2].includes(Number(value.chapter))||typeof value.returning!=='boolean'||(value.started!==null&&typeof value.started!=='string')||typeof value.projectReady!=='boolean'||typeof value.reviewDismissed!=='boolean')return false;
 if(value.startedAt!==undefined&&(typeof value.startedAt!=='string'||Number.isNaN(Date.parse(value.startedAt))))return false;
 if(value.review14!==undefined){if(!plain(value.review14))return false;const review=value.review14;if(!['start','finish','pressure','time','return'].every(k=>typeof review[k]==='string'&&(review[k] as string).length<100))return false}
 if(!['received','expenses','expected'].every(k=>typeof (value.money as Record<string,unknown>)[k]==='number'&&Number.isFinite((value.money as Record<string,unknown>)[k])&&Number((value.money as Record<string,unknown>)[k])>=0)||!['contacts','interviews','releases','movement'].every(k=>typeof (value.real as Record<string,unknown>)[k]==='number'&&Number.isFinite((value.real as Record<string,unknown>)[k])&&Number((value.real as Record<string,unknown>)[k])>=0))return false;
 if(!value.history.every((h:unknown)=>plain(h)&&typeof h.id==='string'&&h.id.length<100&&typeof h.at==='string'&&!Number.isNaN(Date.parse(h.at))&&['done','missed','obsolete'].includes(String(h.status))))return false;
 if(!value.achievements.every((a:unknown)=>typeof a==='string'&&a.length<100)||!value.notes.every((n:unknown)=>plain(n)&&['event','thought','feeling','action','balanced','next','at'].every(k=>typeof n[k]==='string'&&(n[k] as string).length<10000)))return false;
 return true;
}
export function loadState():State{try{const raw=localStorage.getItem(KEY);if(!raw)return freshState();const parsed:unknown=JSON.parse(raw);if(!validateState(parsed))return freshState();const state=parsed as State;return {...state,returning:daysAway(state.lastSeen)>=3||state.returning}}catch{return freshState()}}
export function saveState(state:State){localStorage.setItem(KEY,JSON.stringify({...state,lastSeen:new Date().toISOString()}))}
export function exportState(state:State){const blob=new Blob([JSON.stringify({...state,lastSeen:new Date().toISOString()},null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`life-rebuild-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000)}
export async function importState(file:File):Promise<State>{if(file.size>3_000_000)throw new Error('Файл слишком большой.');let value:unknown;try{value=JSON.parse(await file.text())}catch{throw new Error('Не удалось прочитать файл. Проверь, что это резервная копия приложения.')}if(!validateState(value))throw new Error('Файл не похож на резервную копию LIFE: REBUILD.');return value}
export function clearState(){localStorage.removeItem(KEY)}
