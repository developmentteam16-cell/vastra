import fs from 'node:fs/promises';
const assets={
'pink.jpg':'https://img.tatacliq.com/images/i17/1348Wx2000H/MP000000022310828_1348Wx2000H_202405172103285.jpeg',
'cotton.jpg':'https://mysilklove.com/cdn/shop/files/200.jpg?v=1713265868&width=800',
'dress.jpg':'photo-1515372039744-b8f02a3ae446',
'festive.jpg':'photo-1610030469983-98e550d6193c',
'organza.jpg':'https://img.perniaspopupshop.com/catalog/product/z/o/ZONT082411_1.jpg?impolicy=detailimageprod',
'evening.jpg':'photo-1595777457583-95e059d581b8',
'heritage.jpg':'https://www.zilikaa.com/cdn/shop/files/I-1_37e1df3f-3241-42d6-b26f-c7b630b6d311_800x.jpg?v=1709978439',
'everyday.jpg':'https://mysilklove.com/cdn/shop/files/184.jpg?v=1713265776&width=800'};
const results=await Promise.allSettled(Object.entries(assets).map(async([name,id])=>{const r=await fetch(id.startsWith('https:')?id:`https://images.unsplash.com/${id}?w=900&q=85&fit=crop`);if(!r.ok)throw Error(name+': '+r.status);const data=Buffer.from(await r.arrayBuffer());if(data.length<1000)throw Error(name+': empty image');await fs.writeFile('dist/assets/'+name,data);console.log(name+' downloaded')}));
for(const r of results)if(r.status==='rejected'){console.error(r.reason.message);process.exitCode=1}
