import { chromium } from 'playwright';
import assert from 'node:assert/strict';
process.env.PORT = '4174';
process.env.HOST = '127.0.0.1';
const { server } = await import('./serve.mjs');
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4174');
  await page.locator('.product').last().waitFor();
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    await document.fonts.ready;
  });
  assert(await page.evaluate(() => document.fonts.check('600 20px Outfit') && document.fonts.check('400 14px Jakarta')), 'Local fonts loaded');
  for (const [name, width, height] of [['laptop',1440,1000],['ipad',820,1180],['tablet',768,1024],['mobile',390,844],['large-mobile',430,932],['medium-mobile',360,800],['small-mobile',320,740]]) {
    await page.setViewportSize({ width, height });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name + ' horizontal overflow');
    assert.equal(await page.locator('.product').count(), 8);
    await page.screenshot({ path: 'qa-' + name + '.png', fullPage: true });
    if(width<=430){await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'qa-'+name+'-home.png'});}
  }
  await page.setViewportSize({ width:1440, height:1000 });
  await page.locator('[data-filter="Dresses"]').click();
  assert.equal(await page.locator('.product').count(), 2);
  await page.locator('[data-quick-add="3"]').click();
  await page.locator('#product-size').selectOption('L');
  await page.locator('#detail-add').click();
  await page.locator('#product-dialog .close-dialog').click();
  assert.equal(await page.locator('#bag-count').textContent(), '1');
  await page.locator('[data-filter="All"]').click();
  await page.locator('[data-quick-add="1"]').click();
  await page.locator('#bag-toggle').click();
  assert.equal(await page.locator('.bag-item').count(), 2);
  await page.locator('[data-qty="1"][data-delta="1"]').click();
  assert.equal(await page.locator('#bag-count').textContent(), '3');
  assert.equal(await page.locator('#mobile-bag-count').textContent(), '3');
  await page.evaluate(() => { window.__order = null; window.open = url => { window.__order = url; }; });
  await page.locator('#checkout').click();
  const url = await page.evaluate(() => window.__order);
  assert(url.startsWith('https://wa.me/918341676998?text='));
  const message = decodeURIComponent(url.split('text=')[1]);
  assert(message.includes('Meher Ivory Dress') && message.includes('Qty: 2') && message.includes('L'));
  await page.locator('[data-remove="0"]').click();
  assert.equal(await page.locator('.bag-item').count(), 1);
  await page.locator('#bag-dialog .close-dialog').click();
  await page.locator('#search-toggle').click();
  await page.locator('#search').fill('Meher');
  assert.equal(await page.locator('.product').count(), 1);
  assert.equal(await page.locator('#results-count').textContent(), '1 beautiful find');
  await page.locator('#search').fill('no-match-here');
  assert(await page.locator('#no-results').isVisible());
  await page.locator('#reset-filters').click();
  assert.equal(await page.locator('.product').count(), 8);
  await page.locator('#sort').selectOption('low');
  assert((await page.locator('.product-name').first().textContent()).includes('Tara'));
  await page.locator('.category-card[data-occasion="Cotton Sarees"]').click();
  assert.equal(await page.locator('.product').count(), 2);
  await page.locator('[data-filter="All"]').click();
  await page.setViewportSize({ width:390, height:844 });
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    assert(await page.locator('.hero').evaluate(el=>el.getBoundingClientRect().height<=400), 'Compact mobile hero');
    assert(await page.locator('.category-card h3').last().evaluate(el=>el.getBoundingClientRect().bottom<innerHeight-69), 'Category labels accessible on first phone screen');
    await page.locator('#mobile-search').fill('Meher');
    assert.equal(await page.locator('.product').count(),1);
    await page.locator('#mobile-search').press('Enter');
    await page.locator('#mobile-search-clear').click();
    assert.equal(await page.locator('.product').count(),8);
    await page.locator('#collection').scrollIntoViewIfNeeded();
    await page.screenshot({path:'qa-mobile-shop.png'});
    await page.locator('#mobile-bag-toggle').click();
  assert(await page.locator('#bag-dialog').isVisible());
  assert(await page.locator('#bag-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), 'Mobile bag fits viewport');
  await page.screenshot({ path:'qa-mobile-bag.png' });
  await page.keyboard.press('Escape');
  assert(!(await page.locator('#bag-dialog').isVisible()));
  await page.locator('[data-detail="3"]').first().click();
  assert(await page.locator('#product-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), 'Mobile product fits viewport');
  await page.screenshot({ path:'qa-mobile-product.png' });
  await page.keyboard.press('Escape');
  await page.locator('#menu-toggle').click();
  assert(await page.locator('nav').isVisible());
  await page.locator('nav a').first().click();
  assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.locator('summary').first().click();
  assert(await page.locator('details').first().getAttribute('open') !== null);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  await page.reload();
  await page.locator('.product').last().waitFor();
  assert.equal(await page.locator('#bag-count').textContent(), '0');
  const broken = await page.locator('img').evaluateAll(imgs => imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src));
  assert.deepEqual(broken, []);
  assert.deepEqual(errors, []);
  function luminance(hex) {
    const values=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
    return .2126*values[0]+.7152*values[1]+.0722*values[2];
  }
  for(const [text,bg] of [['625650','fffdf9'],['625650','f5ede3'],['591c30','f5ede3'],['ffffff','591c30'],['ffffff','174f3e'],['783b2e','f5ede3']]) {
    const a=luminance(text),b=luminance(bg);
    assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5, 'Text contrast '+text+'/'+bg);
  }
  console.log('PASS: 7 screen sizes; compact mobile discovery; mobile search and clear; local fonts; normal text contrast >=4.5:1; categories, filters, search and sort; size selection; bag add/update/remove; mobile bag and product dialogs; WhatsApp message; mobile navigation; FAQs; no persistent storage.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
