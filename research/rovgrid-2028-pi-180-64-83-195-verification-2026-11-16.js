"use strict";
const assert = require("node:assert/strict");

const simple = input => [...input.toUpperCase()].filter(c => c >= "A" && c <= "Z").reduce((a,c) => a+c.charCodeAt(0)-64,0);
function primeAt(n) {
  let count=0;
  for(let x=2;;x++) {
    let prime=true;
    for(let j=2;j*j<=x;j++) if(x%j===0) {prime=false;break}
    if(prime && ++count===n)return x;
  }
}
function diffDays(a,b) {
  return (Date.parse(b+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/86400000;
}
const tests=[
 ["YAHUAH English Simple",simple("YAHUAH"),64],
 ["YAHUSHA English Simple",simple("YAHUSHA"),83],
 ["YHWH English Simple",simple("YHWH"),64],
 ["FOUNDATION OF HEAVEN English Simple",simple("FOUNDATION OF HEAVEN"),195],
 ["ROV English Simple",simple("ROV"),55],
 ["YAHUSHA - YAHUAH",simple("YAHUSHA")-simple("YAHUAH"),19],
 ["YAHUSHA - ROV",simple("YAHUSHA")-simple("ROV"),28],
 ["195 - 64",195-64,131],
 ["prime 8",primeAt(8),19],
 ["prime 23",primeAt(23),83],
 ["prime 32",primeAt(32),131],
 ["prime 42",primeAt(42),181],
 ["prime 212",primeAt(212),1301],
 ["177 + 18",177+18,195],
 ["177 + 19",177+19,196],
 ["14²-1",14**2-1,195],
 ["14²",14**2,196],
 ["13×15",13*15,195],
 ["360/2",360/2,180],
 ["180° radians",180*Math.PI/180,Math.PI],
 ["2028-04-16 to Oct 12 days",diffDays("2028-04-16","2028-10-12"),179],
 ["2028-04-16 to Oct 13 days",diffDays("2028-04-16","2028-10-13"),180],
 ["2028-04-16 to Oct 9 days",diffDays("2028-04-16","2028-10-09"),176],
 ["Oct 9 + 7 days = Oct 16",diffDays("2028-10-09","2028-10-16"),7],
];
tests.forEach(([name,actual,expected])=>{assert.equal(actual,expected,name);console.log("PASS",name,actual)});
console.log("PASS",tests.length,"checks. Calendar assertions are arithmetic only, not Karaite observatory verification.");
