// 開発サーバーをヘッドレスブラウザで開き、スクリーンショットを撮る簡易スモークツール。
// コンソール/ページエラーを収集し、エラーがあれば終了コード2で報告する。
//
// 使い方: node scripts/screenshot.mjs [url] [outPath] [waitMs]
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const url = process.argv[2] || 'http://localhost:5173';
const out = process.argv[3] || 'tmp/screenshot.png';
const waitMs = Number(process.argv[4] || 1800);

await mkdir(dirname(out), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
});
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message ?? err}`));

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(waitMs);
await page.screenshot({ path: out });
await browser.close();

if (errors.length) {
  console.error(`PAGE ERRORS (${errors.length}):\n` + errors.join('\n'));
  process.exit(2);
}
console.log(`OK: screenshot saved to ${out}`);
