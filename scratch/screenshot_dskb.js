import { chromium, devices } from 'playwright';
import path from 'path';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const iPhone = devices['iPhone 14 Pro Max'];
  console.log('Creating context with device emulation...');
  const context = await browser.newContext({
    ...iPhone,
    deviceScaleFactor: 2 // Keep file size reasonable
  });

  const page = await context.newPage();
  const testUrl = 'https://dskb-types.vercel.app/?v=2&fp=75&sb=30&bs=85&ay=20&dv=95&lang=en';
  console.log(`Navigating to: ${testUrl}`);
  await page.goto(testUrl, { waitUntil: 'networkidle' });

  // Sleep 1 second for animations
  await page.waitForTimeout(1000);

  // Take a full page screenshot
  const screenshotPath = '/Users/matthewpomeroy/.gemini/antigravity/browser_recordings/mobile_results.png';
  console.log(`Saving full page screenshot to: ${screenshotPath}`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log('Done!');
  await browser.close();
}

run().catch((err) => {
  console.error('Error occurred:', err);
  process.exit(1);
});
