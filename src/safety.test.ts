import test from 'node:test';
import assert from 'node:assert/strict';
import {hasImmediateRisk} from './safety';
test('explicit Russian crisis phrases trigger a human-help screen',()=>{for(const text of ['Хочу умереть прямо сейчас','Я сделаю себе больно','Думаю покончить с собой','Я причиню вред другим'])assert.equal(hasImmediateRisk(text),true)});
test('ordinary difficult feelings do not trigger crisis mode',()=>{assert.equal(hasImmediateRisk('Я тревожусь из-за завтрашнего разговора'),false)});
