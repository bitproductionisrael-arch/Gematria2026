function audit(){
const R=[913,203,86,401,395,407,296],S=[13,5,14,5,17,11,17],F=[4,5,7,5,1,2,8],L=[6,3,5,2,5,3,4],dr=x=>1+(x-1)%9,sum=x=>x.reduce((a,b)=>a+b,0);
let n=0,counts={integerPositiveCuboid:0,faceSum888:0,exactFaces:0,exactFacesAndPrefixRatio:0,full:0},examples=[];
function go(p,left){if(left.length){for(const i of left)go([...p,i],left.filter(j=>j!==i));return}n++;let w=sum(R.map(dr)),f=sum(F),len=sum(L),s=sum(p.slice(0,5).map(i=>S[i])),r=sum(p.slice(0,5).map(i=>R[i])),a=R[p[6]]/w,b=len-a,c=s-len,faces=[b*c,a*b,a*c],positive=[a,b,c].every(x=>Number.isInteger(x)&&x>0);let exact=positive&&faces.join(",")==="520,160,208";if(positive)counts.integerPositiveCuboid++;if(positive&&sum(faces)===888)counts.faceSum888++;if(exact)counts.exactFaces++;if(exact&&r===w*s)counts.exactFacesAndPrefixRatio++;if(exact&&r===w*s&&f*f===1024&&(f/2)*(f/2+1)/2===136){counts.full++;if(examples.length<3)examples.push(p)}}
go([],R.map((_,i)=>i));const inverse=[Math.sqrt(160*208/520),Math.sqrt(160*520/208),Math.sqrt(208*520/160)];return {n,counts,examples,inverse,scope:"exact enumeration of labeled word orders of the known verse; retrospective, not natural text probability"}
}
console.log(JSON.stringify(audit(),null,2));
