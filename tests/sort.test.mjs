import test from 'node:test';
import assert from 'node:assert/strict';
import {algorithms,createData} from '../src/algorithms.js';
const cases=[
  [],[7],[2,1],[1,1,1],[5,2,5,1,3,0],
  Array.from({length:50},(_,i)=>50-i),
  Array.from({length:50},(_,i)=>i),
  Array.from({length:80},(_,i)=>(i*37)%13)
];
for(const [name,algorithm] of Object.entries(algorithms)){
  test(name+' sorts common, reversed, sorted and duplicate inputs',()=>{
    for(const input of cases){
      const a=[...input],expected=[...input].sort((x,y)=>x-y);
      const events=[...algorithm(a)];
      assert.deepEqual(a,expected);
      for(const event of events){
        assert.ok(['compare','write'].includes(event.kind));
        assert.ok(event.indices.every(i=>i>=0&&i<input.length));
        if(event.kind==='write')assert.equal(event.count,event.indices.length);
      }
    }
  });
  test(name+' sorts seeded pseudo-random inputs',()=>{
    let state=123456;
    for(let t=0;t<35;t++){
      const a=Array.from({length:t*3},()=>{
        state=(Math.imul(state,1664525)+1013904223)>>>0;
        return state%101;
      });
      const expected=[...a].sort((x,y)=>x-y);
      [...algorithm(a)];
      assert.deepEqual(a,expected);
    }
  });
}
test('data generator returns values in supported range',()=>{
  for(const mode of ['random','nearly','reversed','duplicates']){
    const a=createData(40,mode,()=>0.5);
    assert.equal(a.length,40);
    assert.ok(a.every(x=>x>=10&&x<=100));
  }
});
test('reversed dataset is descending',()=>{
  const a=createData(25,'reversed',Math.random);
  assert.deepEqual(a,[...a].sort((x,y)=>y-x));
});

test('duplicate bars stay within range at maximum input',()=>{
  assert.ok(createData(8,'duplicates',()=>0.99999).every(value=>value<=100));
});
test('empty nearly sorted data stays empty',()=>{
  assert.deepEqual(createData(0,'nearly'),[]);
});
