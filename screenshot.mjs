import { createRequire } from 'module';
const require = createRequire('/opt/homebrew/lib/node_modules/@playwright/mcp/');
const { chromium } = require('playwright');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1400, height: 700 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

// Load with purple primary + teal accent + neutral — shows off multi-scale
const url = 'http://localhost:3006/?scales=primary:8b5cf6:primary,accent:06b6d4:accent,neutral:737373:neutral&active=primary&mode=dark';
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

await page.screenshot({
  path: '/Users/sammii/development/sammii-hk.github.io/public/assets/images/gamut.png',
  type: 'png',
});

console.log('Screenshot saved!');
await browser.close();
