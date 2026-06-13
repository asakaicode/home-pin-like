// ヘッドレスブラウザで読み込み→指定座標を順にクリック→スクショ、というインタラクション検証ツール。
// 使い方: node scripts/click-test.mjs <url> <outPath> "x1,y1;x2,y2" [perClickWaitMs] [initialWaitMs]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const url = process.argv[2] || 'http://localhost:5173';
const out = process.argv[3] || 'tmp/click.png';
const clicks = (process.argv[4] || '')
  .split(';')
  .filter(Boolean)
  .map((s) => s.split(',').map(Number));
const perClickWait = Number(process.argv[5] || 1400);
const initialWait = Number(process.argv[6] || 1000);

await mkdir(dirname(out), { recursive: true });

const browser = await chromium.launch();
// 高さはゲーム1280＋下部バナー64を含めて1344にし、ゲーム面を1:1に保つ
const page = await browser.newPage({ viewport: { width: 720, height: 1344 } });

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message ?? e}`));

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(initialWait);

for (const [x, y] of clicks) {
  await page.mouse.click(x, y);
  await page.waitForTimeout(perClickWait);
}

await page.screenshot({ path: out });
await browser.close();

if (errors.length) {
  console.error(`PAGE ERRORS (${errors.length}):\n` + errors.join('\n'));
  process.exit(2);
}
console.log(`OK: screenshot saved to ${out}`);
