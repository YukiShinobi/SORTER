// Pure sorting generators: each event records a comparison or a write.
export function* bubble(a) {
  for(let end=a.length-1;end>0;end--){
    let changed=false;
    for(let i=0;i<end;i++){
      yield {kind:'compare',indices:[i,i+1]};
      if(a[i]>a[i+1]){
        [a[i],a[i+1]]=[a[i+1],a[i]];changed=true;
        yield {kind:'write',indices:[i,i+1],values:[a[i],a[i+1]],count:2};
      }
    }
    if(!changed)break;
  }
}
export function* selection(a){
  for(let i=0;i<a.length-1;i++){
    let min=i;
    for(let j=i+1;j<a.length;j++){
      yield {kind:'compare',indices:[min,j]};
      if(a[j]<a[min])min=j;
    }
    if(min!==i){
      [a[i],a[min]]=[a[min],a[i]];
      yield {kind:'write',indices:[i,min],values:[a[i],a[min]],count:2};
    }
  }
}
export function* insertion(a){
  for(let i=1;i<a.length;i++){
    const v=a[i];let j=i-1;
    while(j>=0){
      yield {kind:'compare',indices:[j,j+1]};
      if(a[j]<=v)break;
      a[j+1]=a[j];
      yield {kind:'write',indices:[j+1],values:[a[j+1]],count:1};
      j--;
    }
    a[j+1]=v;
    yield {kind:'write',indices:[j+1],values:[v],count:1};
  }
}
export function* merge(a){
  function* sort(l,r){
    if(r-l<2)return;
    const m=Math.floor((l+r)/2);
    yield* sort(l,m);yield* sort(m,r);
    const left=a.slice(l,m),right=a.slice(m,r);
    let i=0,j=0,k=l;
    while(i<left.length && j<right.length){
      yield {kind:'compare',indices:[l+i,m+j]};
      const value=left[i]<=right[j]?left[i++]:right[j++];
      a[k]=value;yield {kind:'write',indices:[k],values:[value],count:1};k++;
    }
    while(i<left.length){const value=left[i++];a[k]=value;yield {kind:'write',indices:[k],values:[value],count:1};k++;}
    while(j<right.length){const value=right[j++];a[k]=value;yield {kind:'write',indices:[k],values:[value],count:1};k++;}
  }
  yield* sort(0,a.length);
}
export function* quick(a){
  function* sort(low,high){
    if(low>=high)return;
    const pivot=a[high];let i=low;
    for(let j=low;j<high;j++){
      yield {kind:'compare',indices:[j,high]};
      if(a[j]<=pivot){
        if(i!==j){[a[i],a[j]]=[a[j],a[i]];yield {kind:'write',indices:[i,j],values:[a[i],a[j]],count:2};}
        i++;
      }
    }
    if(i!==high){[a[i],a[high]]=[a[high],a[i]];yield {kind:'write',indices:[i,high],values:[a[i],a[high]],count:2};}
    yield* sort(low,i-1);yield* sort(i+1,high);
  }
  yield* sort(0,a.length-1);
}
export const algorithms={bubble,selection,insertion,merge,quick};
export const info={
  bubble:{title:'Bubble sort',description:'Repeatedly compares adjacent values and swaps them if they are out of order. Simple to understand, but slow on large arrays.',average:'O(n²)',worst:'O(n²)'},
  selection:{title:'Selection sort',description:'Finds the minimum remaining value and moves it to the next sorted position. Uses few swaps, but scans much of the array every pass.',average:'O(n²)',worst:'O(n²)'},
  insertion:{title:'Insertion sort',description:'Builds a sorted prefix one item at a time. Often very efficient when the input is already nearly sorted.',average:'O(n²)',worst:'O(n²)'},
  merge:{title:'Merge sort',description:'Splits the input recursively, then combines sorted halves. Predictably fast and stable, with extra memory for merging.',average:'O(n log n)',worst:'O(n log n)'},
  quick:{title:'Quick sort',description:'Partitions elements around a pivot, then sorts the partitions. Fast on average, but a poor pivot may cause quadratic work.',average:'O(n log n)',worst:'O(n²)'}
};
export function createData(n,distribution='random',random=Math.random){
  let a=Array.from({length:n},()=>Math.floor(random()*91)+10);
  if(distribution==='duplicates')a=a.map(v=>10+Math.floor((v-10)/20)*20);
  if(distribution==='reversed')a.sort((x,y)=>y-x);
  if(distribution==='nearly' && n>1){
    a.sort((x,y)=>x-y);
    for(let k=0;k<Math.max(1,Math.floor(n/12));k++){
      const i=Math.floor(random()*n),j=Math.floor(random()*n);
      [a[i],a[j]]=[a[j],a[i]];
    }
  }
  return a;
}
