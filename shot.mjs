import { chromium } from 'playwright-core';
const D = '/tmp/claude-0/-home-user-httpsoldironofficialcom/086de16c-1d6f-502b-be97-978b146fdd05/scratchpad';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

async function shot(url, name, w, h, scrollTo) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0,160)); });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => errs.push('NAV: ' + e.message));
  if (scrollTo) { await p.evaluate(y => window.scrollTo(0, y), scrollTo); await p.waitForTimeout(1200); }
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${D}/${name}.png` });
  console.log(`--- ${name} ---`);
  errs.slice(0,6).forEach(e => console.log('  ' + e));
  await p.close();
}

const B = 'http://127.0.0.1:8788';
await shot(B + '/', 'a-home-top', 1440, 900, 0);
await shot(B + '/', 'b-home-scroll', 1440, 900, 1400);
await shot(B + '/', 'c-home-mid', 1440, 900, 2600);
await shot(B + '/shop', 'd-shop', 1440, 900, 0);
await shot(B + '/product/kolsuz-tee-burak', 'e-pdp', 1440, 900, 0);
await shot(B + '/cart', 'f-cart', 1440, 900, 0);
await shot(B + '/', 'g-mobile', 390, 844, 0);
await b.close();
