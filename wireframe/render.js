// Gera os PNGs do wireframe: NODE_PATH=$(npm root -g) node wireframe/render.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1.5 });
  for (const name of ['login', 'notas']) {
    await page.goto('file://' + path.join(__dirname, name + '.html'));
    await page.locator('.wrap').screenshot({ path: path.join(__dirname, `wireframe-${name}.png`) });
  }
  await browser.close();
})();
