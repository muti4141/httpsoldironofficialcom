import { chromium } from 'playwright-core';
const D='/tmp/claude-0/-home-user-httpsoldironofficialcom/086de16c-1d6f-502b-be97-978b146fdd05/scratchpad';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
async function shot(path, name, w=1440, h=900) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://127.0.0.1:8815' + path, { waitUntil: 'domcontentloaded' }).catch(()=>{});
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `${D}/${name}.png` });
  console.log(name, 'ok');
  await p.close();
}
await shot('/shop', 'dk-shop');
await shot('/product/kolsuz-tee-burak', 'dk-pdp');
await b.close();
