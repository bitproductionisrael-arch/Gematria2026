'use strict';
// Execute the pinned calculator's original computational code, without rewriting its ciphers.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const repo=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(repo,'calculator.html'),'utf8');
const expectedBlob='9c6d579b63c9d98ac66e7823ea6d1c961ea7b43e';
const bytes=Buffer.from(html),actual=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
if(actual!==expectedBlob)throw Error('Calculator differs from pinned engine: '+actual);
const between=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);if(i<0||j<0)throw Error('Extraction marker missing');return s.slice(i,j)};
let code=between(html,"'use strict';",'function materializeDeferredOperators');
code+=between(html,'let permutationSelected=false','function hasPermutationInput');
code+=between(html,'function openFinals(t)','const FINAL_SENSITIVE_METHODS');
const ext=fs.readFileSync(path.join(repo,'yhvh-milui.js'),'utf8');
code+=between(ext,"'use strict';",'function yhvhComparisonDetail');
code+='\nglobalThis.engine={METHODS,calculate,calculateMilui,computePermutationData,openFinals,boundaryless,reductionLadderData,HE_VAL,HE_ORD,HE_KATAN,HOMEPOWER_CONSTANTS,YHVH_MILUI_GALLERY,yhvhComputeMilui,setDistinctFinals:v=>{permutationDistinctFinals=v}};';
const sandbox={console};vm.createContext(sandbox);vm.runInContext(code,sandbox,{timeout:10000});
module.exports={...sandbox.engine,blob:expectedBlob,commit:'c5522e1d67551821682b4d1b1359985d53c094cf',extractedCode:code};
