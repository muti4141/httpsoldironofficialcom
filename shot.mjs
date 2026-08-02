import { chromium } from 'playwright-core';
const D = '/tmp/claude-0/-home-user-httpsoldironofficialcom/086de16c-1d6f-502b-be97-978b146fdd05/scratchpad';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const B = 'http://127.0.0.1:8790';

async function shot(url, name, w, h, scrollY) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => errs.push('NAV ' + e.message));
  await p.waitForTimeout(2500);
  if (scrollY) {
    await p.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
    await p.waitForTimeout(2000);
  }
  await p.screenshot({ path: `${D}/${name}.png` });
  // raw ligature text kontrolü
  const raw = await p.evaluate(() => {
    const names = ['shopping_bag','arrow_forward','chevron_left','local_shipping','expand_more','search'];
    return names.filter(n => document.body.innerText.includes(n));
  });
  console.log(`${name}: ${errs.length ? errs[0] : 'ok'}${raw.length ? ' | HAM İKON: ' + raw.join(',') : ''}`);
  await p.close();
}

await shot(B + '/', 'n1-home-logo', 1440, 900, 0);
await shot(B + '/', 'n2-home-text', 1440, 900, 2200);
await shot(B + '/', 'n3-home-cta', 1440, 900, 5900);
await shot(B + '/shop', 'n4-shop', 1440, 900, 0);
await b.close();
