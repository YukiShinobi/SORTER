import {algorithms,info,createData} from './algorithms.js';
const $=id=>document.getElementById(id);
const chart=$('chart'),algo=$('algorithm'),distribution=$('distribution'),size=$('size'),speed=$('speed');
const start=$('start'),pause=$('pause'),stop=$('stop'),generate=$('generate');
let values=[],running=false,paused=false,runId=0,comparisons=0,writes=0,elapsed=0,activeAt=0;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function updateInfo(){
 const item=info[algo.value];
 $('algoTitle').textContent=item.title;
 $('algoDesc').textContent=item.description;
 $('average').textContent='Average: '+item.average;
 $('worst').textContent='Worst: '+item.worst;
}
function updateStats(){
 $('comparisons').textContent=comparisons.toLocaleString();
 $('writes').textContent=writes.toLocaleString();
 const totalElapsed=elapsed+(running && !paused ? performance.now()-activeAt : 0);
 $('elapsed').textContent=(totalElapsed/1000).toFixed(2)+'s';
}
function render(indices=[],kind='',complete=false){
 const highlighted=new Set(indices);
 chart.replaceChildren();
 const frag=document.createDocumentFragment();
 for(let i=0;i<values.length;i++){
   const bar=document.createElement('div');
   bar.className='bar'+(complete?' sorted':highlighted.has(i)?(kind==='compare'?' active':' write'):'');
   bar.style.height=values[i]+'%';
   frag.append(bar);
 }
 chart.append(frag);
 chart.setAttribute('aria-label',values.length+' numbers visualized as bars. '+(complete?'Sorting completed.':$('status').textContent));
}
function setControls(){
 start.disabled=running;generate.disabled=running;algo.disabled=running;distribution.disabled=running;size.disabled=running;
 pause.disabled=!running;stop.disabled=!running;
 pause.textContent=paused?'▶ Resume':'⏸ Pause';
}
function reset(){
 runId++;running=false;paused=false;elapsed=0;comparisons=0;writes=0;activeAt=0;
 values=createData(Number(size.value),distribution.value);$('status').textContent='Ready to sort';
 updateStats();render();setControls();
}
function abort(){
 if(!running)return;
 if(!paused)elapsed+=performance.now()-activeAt;
 runId++;running=false;paused=false;activeAt=0;
 $('status').textContent='Stopped';render();updateStats();setControls();
}
function togglePause(){
 if(!running)return;
 if(paused){paused=false;activeAt=performance.now();$('status').textContent='Sorting…';}
 else{elapsed+=performance.now()-activeAt;paused=true;$('status').textContent='Paused';}
 updateStats();setControls();
}
async function run(){
 if(running)return;
 running=true;paused=false;comparisons=0;writes=0;elapsed=0;activeAt=performance.now();
 const id=++runId;
 $('status').textContent='Sorting…';setControls();updateStats();
 const working=[...values];
 try{
   for(const event of algorithms[algo.value](working)){
     if(id!==runId)return;
     while(paused && id===runId)await sleep(30);
     if(id!==runId)return;
     if(event.kind==='compare')comparisons++;
     else{writes+=event.count;event.indices.forEach((index,k)=>{values[index]=event.values[k];});}
     render(event.indices,event.kind);updateStats();
     const delay=Math.max(1,Math.round(210*Math.pow((101-Number(speed.value))/100,2)));
     await sleep(delay);
   }
   if(id!==runId)return;
   while(paused && id===runId)await sleep(30);
   if(id!==runId)return;
   elapsed+=performance.now()-activeAt;running=false;paused=false;activeAt=0;
   $('status').textContent='Sorted successfully ✓';render([], '',true);updateStats();setControls();
 }catch(error){
   if(id!==runId)return;
   running=false;paused=false;$('status').textContent='An error occurred';
   setControls();console.error(error);
 }
}
size.addEventListener('input',()=>{$('sizeOut').textContent=size.value;reset();});
speed.addEventListener('input',()=>{$('speedOut').textContent=speed.value+'%';});
distribution.addEventListener('change',reset);
algo.addEventListener('change',()=>{updateInfo();reset();});
generate.addEventListener('click',reset);
start.addEventListener('click',run);
pause.addEventListener('click',togglePause);
stop.addEventListener('click',abort);
updateInfo();reset();
