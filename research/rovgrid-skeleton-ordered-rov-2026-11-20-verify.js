const assert = require('node:assert/strict');
const letters = [...'אבגדהוזחטיכלמנסעפצקרשת'];
const value = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
for (const [word, expected] of [['עמית',[466,232,2]],['מייק',[739,415,12]],['רוב',[24,21,1]]]) {
  const ids = [...word].map(c => letters.indexOf(c));
  function scores(xs) {
    return [xs.reduce((s,i)=>s+value[i],0), xs.reduce((s,i)=>s+i+1,0), xs.reduce((s,i,j)=>s+value[i]*(xs.length-j),0)];
  }
  const target = scores(ids);
  const counts = [0,0,0];
  function visit(xs) {
    if (xs.length < ids.length) {
      for (let i=0;i<letters.length;i++) visit([...xs,i]);
      return;
    }
    const values = scores(xs);
    for (let j=0;j<3 && values[j]===target[j];j++) counts[j]++;
  }
  visit([]);
  assert.deepEqual(counts,expected);
  console.log(word, target, counts);
}
