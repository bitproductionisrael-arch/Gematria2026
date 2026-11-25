function audit(){
const rows=[];
for(let n=1;n<=32;n++){const m=2*n, seen=new Set(), sizes={};for(let x=0;x<m;x++)for(let y=0;y<m;y++){if(seen.has(x+','+y))continue;const a=x,b=y,c=m-1-x,d=m-1-y;const orbit=new Set([[a,b],[a,d],[c,b],[c,d],[b,a],[b,c],[d,a],[d,c]].map(p=>p.join(',')));for(const p of orbit)seen.add(p);sizes[orbit.size]=(sizes[orbit.size]||0)+1;}if(sizes[4]!==n||(sizes[8]||0)!==n*(n-1)/2)throw Error('orbit '+n);if(n%2===0&&n*n*n/4===4*n*n)rows.push(n);}
const factors=[];for(let v=1;v*v<888;v++)if(888%v===0)factors.push([888/v+v,888/v-v]);if(factors.length!==8)throw Error('factor count');
const letters='אבגדהוזחטיכלמנסעפצקרשת', vals=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];const sum=(s,ord=false)=>[...s.replace(/ /g,'').replace(/ם/g,'מ').replace(/ן/g,'נ').replace(/ך/g,'כ').replace(/ף/g,'פ').replace(/ץ/g,'צ')].reduce((a,c)=>a+(ord?letters.indexOf(c)+1:vals[letters.indexOf(c)]),0);const checks=[sum('שלום'),sum('קול'),sum('הכל'),sum('בכל'),sum('אבן'),sum('מוחלט'),sum('מוחלט',true),sum('עד עולם'),sum('עד עולם',true)];if(JSON.stringify(checks)!==JSON.stringify([376,136,55,52,53,93,48,220,67]))throw Error('gematria');
const A=8,B=128,V=A+B,E=A*B,g=(A-2)*(B-2)/4,F=E-V+2-2*g;return {orbitGrids:32,uniqueEvenN:rows,factors,checks,V,E,g,F,cycle:E-V+1,treeExponent:3*127+7*7,quotientCounterexample:{n:2,orbitCount:3,gridEdges:24,completeBipartiteEdges:2},note:'quotient adjacency is not K(A,B): at n=16 orbit count 136, grid edges 1984; K has 1024 edges, construction is separate; no lexical population tested'};
}

console.log(JSON.stringify(audit(),null,2));
