import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from './engine';
import {validateState,loadState,saveState} from './storage';

const db=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>db.get(k)??null,setItem:(k:string,v:string)=>db.set(k,v),removeItem:(k:string)=>db.delete(k)}});
test('saved state survives a new load',()=>{const s=freshState();s.onboarded=true;s.xp.body=21;saveState(s);const loaded=loadState();assert.equal(loaded.xp.body,21);assert.equal(loaded.onboarded,true)});
test('damaged and malformed backups are rejected',()=>{const valid=freshState();assert.equal(validateState(valid),true);assert.equal(validateState({...valid,chapter:99}),false);assert.equal(validateState({...valid,real:{}}),false);db.set('life-rebuild-state-v1','{broken');assert.equal(loadState().onboarded,false)});
test('opening after several days keeps progress and offers a gentle return',()=>{const s=freshState();s.onboarded=true;s.xp.career=43;s.lastSeen=new Date(Date.now()-4*86400000).toISOString();db.set('life-rebuild-state-v1',JSON.stringify(s));const loaded=loadState();assert.equal(loaded.returning,true);assert.equal(loaded.xp.career,43)});
