const abc="אבגדהוזחטיכלמנסעפצקרשת";
const norm=s=>s.replace(/[ךםןףץ]/g,x=>({"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"}[x]));
const letters=s=>[...norm(s)].filter(x=>abc.includes(x));
const value=(s,ordinal=false)=>letters(s).reduce((a,x)=>{let i=abc.indexOf(x);return a+(ordinal?i+1:i<9?i+1:i<18?(i-8)*10:(i-17)*100)},0);
const verse="ויביא אותי שמה והנה איש מראהו כמראה נחשת ופתיל פשתים בידו וקנה המדה והוא עמד בשער";
const words=verse.split(" "), key="כמראה נחשת", k=letters(key), U=[...new Set(k)], F=U.filter(x=>"כמנפצ".includes(x)), C=n=>n*(n-1)/2,T=n=>n*(n+1)/2;
const output={words:words.map(w=>({w,n:letters(w).length,regular:value(w),ordinal:value(w,true)})),total:value(verse),wordCount:words.length,letterCount:letters(verse).length,key:{letters:U,values:k.map(x=>[x,value(x),value(x,true)]),regular:value(key),ordinal:value(key,true),within:C(5)+C(4),cross:5*4,gates:C(U.length),directed:U.length*(U.length-1),finalCapable:F,remainingGates:C(U.length)-C(F.length),complementLetters:22-U.length,complementGates:C(22-U.length),crossFull:U.length*(22-U.length)},abc:{sum:3+6+9,square:3**2+6**2+9**2,tri:T(3)+T(6)+T(9),comp:T(2)+T(5)+T(8),P1:2*4*7},phrases:["ארץ ישראל","כמראה נחשת","כמראה נחושת","כעין נחשת קלל","עץ אחד","מראהו","המדה","והוא","בידו","והנה","גלגל","עמית מייק רוב"].map(w=>[w,value(w),value(w,true)])};
console.log(JSON.stringify(output,null,2));