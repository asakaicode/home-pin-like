// ドラッグ操作の検証ツール。
// 使い方: node scripts/drag-test.mjs <url> <out.png> "sx,sy>ex,ey" [waitMs]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const url = process.argv[2] || 'http://localhost:5173';
const out = process.argv[3] || 'tmp/drag.png';
const [from, to] = (process.argv[4] || '0,0>0,0').split('>');
const [sx, sy] = from.split(',').map(Number);
const [ex, ey] = to.split(',').map(Number);
const wait = Number(process.argv[5] || 3000);

await mkdir(dirname(out), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 720, height: 1344 } });
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message ?? e}`));

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1500);

await page.mouse.move(sx, sy);
await page.mouse.down();
const steps = 12;
for (let i = 1; i <= steps; i++) {
  await page.mouse.move(sx + ((ex - sx) * i) / steps, sy + ((ey - sy) * i) / steps);
  await page.waitForTimeout(20);
}
await page.mouse.up();
await page.waitForTimeout(wait);

await page.screenshot({ path: out });
await browser.close();
if (errors.length) {
  console.error(`PAGE ERRORS (${errors.length}):\n` + errors.join('\n'));
  process.exit(2);
}
console.log(`OK: screenshot saved to ${out}`);
