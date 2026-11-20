# שלד, פאות וקצות מקצוע כמיפוי סדרי
כלל מוצע לקריאת פאון: מספר קודקודים ומקצועות יחד, מספר פאות, מספר קצוות במקצוע אחד. בקריאת המספרים כמיקומים באלפבית העברי, קובייה נותנת 20,6,2 = ר,ו,ב. הכלל נבחר במחקר בדיעבד. המספרים הם ספירות כלליות ואינם מעידים בפני עצמם על מסלול ביקור בשלושה קודקודים מקומיים. חציית קווים בהיטל אינה מוסיפה קודקוד לשלד המקורי.
   
בגופים האפלטוניים המונים באותו סדר הם 10/4/2, 20/6/2, 18/8/2, 50/12/2 ו־42/20/2 (טטרהדרון, קובייה, אוקטהדרון, דודקהדרון ואיקוסהדרון).
   
[בדיקת כל המחרוזות](./rovgrid-skeleton-ordered-rov-2026-11-20-verify.js) · [בדיקת הכרח קודמת](./rovgrid-choice-two-states-three-supports-cube-necessity-audit-2026-11-20.md) · [MathWorld Skeleton](https://mathworld.wolfram.com/Skeleton.html)
   
ברגילה ובסדרית ובאורך קבוע נספרו 232/415/21 מועמדים לעמית/מייק/רוב. בסינון נוסף לפי סכום קידומות רגיל של מילת היעד נשארו 2/12/1. סינון אחרון זה בודק ייחודיות מותנית ואינו גזירה גאומטרית של ערכי הקידומות. הסריקה על 22 אותיות, חזרות מותרות, ללא מילון או אותיות סופיות נפרדות.

## המשך: רשת אחת, סביבה אחת, ענף אחד
מכניסים תחנת אמצע בכל מקצוע. על כל 8 השורשים המקוריים בקובייה נבדקו כלל הרשת (20), תחנות במרחק צעד או שניים ללא השורש (6), וגודל כל רכיב בסביבה זו (2). שלוש זרועות שוות, אמצע ושכן בכל זרוע. ר,ו,ב בקריאה מן הכלל לענף; בכיוון בנייה מהשורש המספרים מתקבלים בסדר אחר. בגרף פשוט עם שורש לא מבודד הנוסחה היא V+E, פעמיים דרגת השורש, 2. בסולם מביוס בעל 8 קודקודים אותה תוצאה; מחזור באורך חמש מבדיל אותו מהקובייה. אין הכרח לבחירת הכלל או הכתיב מתוך אי־הבחנה. [חלוקת מקצוע](https://mathworld.wolfram.com/GraphSubdivision.html).

```js
function readRoot(n, edges, root) {
  const graph = Array.from({length:n+edges.length}, () => []);
  edges.forEach(([a,b],i) => {
    const m=n+i;
    for (const v of [a,b]) { graph[v].push(m); graph[m].push(v); }
  });
  const layer1=graph[root];
  const layer2=new Set(layer1.flatMap(m=>graph[m]).filter(v=>v!==root));
  const around=new Set([...layer1,...layer2]);
  for(const v of around) {
    if(graph[v].filter(w=>around.has(w)).length!==1) throw Error("not disjoint pairs");
  }
  return [graph.length,around.size,2];
}
const cube=[], ladder=[];
for(let i=0;i<8;i++){
  for(const bit of [1,2,4]) if(i<(i^bit)) cube.push([i,i^bit]);
  ladder.push([i,(i+1)%8]);
  if(i<4) ladder.push([i,i+4]);
}
for(const edges of [cube,ladder]) for(let r=0;r<8;r++){
  if(String(readRoot(8,edges,r))!=="20,6,2") throw Error("root failed");
}
```
