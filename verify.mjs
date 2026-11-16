import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import './serve.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173');
await page.locator('.product').last().waitFor();
await page.evaluate(()=>document.fonts.ready);
for(const [name,width,height] of [['laptop',1440,1000],['ipad',768,1024],['mobile',390,844],['small-mobile',320,740]]){
 await page.setViewportSize({width,height});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' horizontal overflow');
 assert.equal(await page.locator('.product').count(),8);
 await page.screenshot({path:`qa-${name}.png`,fullPage:true});
}
await page.setViewportSize({width:1440,height:1000});
await page.locator('[data-filter="Dresses"]').click();assert.equal(await page.locator('.product').count(),2);
await page.locator('[data-quick-add="3"]').click();
await page.locator('#product-size').selectOption('L');await page.locator('#detail-add').click();
await page.locator('#product-dialog .close-dialog').click();assert.equal(await page.locator('#bag-count').textContent(),'1');
await page.locator('[data-filter="All"]').click();await page.locator('[data-quick-add="1"]').click();
await page.locator('#bag-toggle').click();assert.equal(await page.locator('.bag-item').count(),2);
await page.locator('[data-qty="1"][data-delta="1"]').click();assert.equal(await page.locator('#bag-count').textContent(),'3');
await page.evaluate(()=>{window.__order=null;window.open=(url)=>{window.__order=url}});
await page.locator('#checkout').click();const url=await page.evaluate(()=>window.__order);
assert(url.startsWith('https://wa.me/918341676998?text='));
const message=decodeURIComponent(url.split('text=')[1]);assert(message.includes('Meher Ivory Dress'));assert(message.includes('Qty: 2'));assert(message.includes('L'));
await page.locator('[data-remove="0"]').click();assert.equal(await page.locator('.bag-item').count(),1);
await page.locator('#bag-dialog .close-dialog').click();
await page.locator('#search-toggle').click();await page.locator('#search').fill('Meher');assert.equal(await page.locator('.product').count(),1);
await page.locator('#search').fill('no-match-here');assert(await page.locator('#no-results').isVisible());
await page.locator('#clear-search').click();assert.equal(await page.locator('.product').count(),8);
await page.locator('#sort').selectOption('low');assert((await page.locator('.product-name').first().textContent()).includes('Tara'));
assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
await page.reload();assert.equal(await page.locator('#bag-count').textContent(),'0');
const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));assert.deepEqual(broken,[]);
await page.setViewportSize({width:390,height:844});await page.locator('#menu-toggle').click();assert(await page.locator('nav').isVisible());await page.locator('nav a').first().click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
assert.deepEqual(errors,[]);console.log('PASS: 4 responsive sizes, product filters, dress sizes, bag add/update/remove, WhatsApp order contents, search, sorting, image loading, mobile navigation, no persistent storage, refresh resets bag.');
}finally{await browser.close();process.exit()}
