const { chromium } = require('playwright');
const OUT = require('path').join(__dirname, '../public/shots');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 412, height: 892 }, deviceScaleFactor: 3, locale: 'he-IL', isMobile: true, hasTouch: true, colorScheme: 'light' });
  // The demo-mode banner is hidden for the film; every screen is labelled as sample data in the video instead.
  await ctx.addInitScript(() => {
    const hide = () => document.querySelectorAll('div').forEach((d) => { if (d.childElementCount < 4 && /^מצב הדגמה/.test(d.innerText || '') && d.innerText.length < 120) d.style.display = 'none'; });
    new MutationObserver(hide).observe(document, { subtree: true, childList: true });
  });
  const p = await ctx.newPage();
  const shot = async (n, wait = 1600) => { await p.waitForTimeout(wait); await p.screenshot({ path: `${OUT}/${n}.png` }); console.log('ok', n); };
  const click = (t) => p.getByText(t, { exact: true }).first().click();
  await p.goto('http://localhost:8089/');
  await click('המשך'); await p.waitForTimeout(600); await click('המשך'); await p.waitForTimeout(600); await click('בואו נתחיל');
  await p.waitForTimeout(800); await p.locator('input').first().fill('noa@example.com'); await click('שליחת קוד');
  await p.waitForTimeout(800); await p.locator('input').first().fill('123456'); await p.waitForTimeout(2000);
  await p.goto('http://localhost:8089/scan'); await p.waitForTimeout(1200); await click('סריקת קוד לדוגמה'); await p.waitForTimeout(2200);
  await click('למימוש ההטבה'); await shot('redeem-a');
  await p.waitForTimeout(31000); await shot('redeem-b', 200);
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
