import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseMissions,complete,freshState,miss,missions,recommendedSmall} from './engine';
import {goalOptions,goalProgress,nextStep,stepStatus} from './journey';

test('every planned stage points to a distinct real mission in its area',()=>{
 const known=new Map(missions.map(m=>[m.id,m]));
 for(const goal of goalOptions){
  assert.ok(goal.steps.length>=3);
  assert.equal(new Set(goal.steps.map(step=>step.mission)).size,goal.steps.length);
  for(const step of goal.steps)assert.equal(known.get(step.mission)?.area,goal.area,`${goal.id}: ${step.mission}`);
 }
});

test('only selected goals can supply the next mission',()=>{
 const state=freshState();state.journey={goals:['finish','movement'],reason:'',barrier:'unclear',createdAt:new Date(Date.now()-1000).toISOString()};
 const chosen=chooseMissions(state);
 assert.equal(chosen.primary?.id,'studio_select');
 assert.deepEqual(chosen.sides.map(m=>m.id),['body_prepare']);
});

test('a skipped stage advances without inflating completed progress',()=>{
 const state=freshState();state.journey={goals:['role'],reason:'',barrier:'unclear',createdAt:new Date(Date.now()-1000).toISOString()};
 const skipped=miss(state,missions.find(m=>m.id==='career_direction')!,'obsolete');
 assert.equal(stepStatus(skipped.history,skipped.journey!,'career_direction'),'skipped');
 assert.equal(nextStep(skipped,'role')?.mission,'career_vacancy');
 assert.deepEqual(goalProgress(skipped,'role'),{done:0,total:4,skipped:1});
});

test('low energy reduces a demanding planned step without claiming full completion',()=>{
 const state=freshState();state.journey={goals:['role'],reason:'',barrier:'energy',createdAt:new Date(Date.now()-1000).toISOString()};
 state.energy='low';state.minutes=15;
 const direction=missions.find(m=>m.id==='career_direction')!;
 const afterDirection=complete(state,direction);
 const vacancy=missions.find(m=>m.id==='career_vacancy')!;
 const afterVacancy=complete(afterDirection,vacancy);
 const demanding=chooseMissions(afterVacancy).primary!;
 assert.equal(demanding.id,'career_case');
 assert.equal(recommendedSmall(afterVacancy,demanding),1);
 const prepared=complete({...afterVacancy,smallSteps:{...afterVacancy.smallSteps,[demanding.id]:1}},demanding);
 assert.equal(goalProgress(prepared,'role').done,2);
});
