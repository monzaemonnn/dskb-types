import { chromium } from 'playwright';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ARTIFACT_DIR = '/Users/matthewpomeroy/.gemini/antigravity/brain/d8799d15-ad10-45bc-aee1-e736aab1f84e';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Starting Vite dev server in background...');
  const devServer = exec('npm run dev', { cwd: '/Users/matthewpomeroy/DSKB types' });
  
  // Wait 2 seconds for server to boot
  await wait(2000);
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // 1. Desktop Welcome Page (1280x960)
    console.log('Capturing Desktop Welcome...');
    let context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
    let page = await context.newPage();
    await page.goto('http://localhost:5173/?v=2');
    await wait(1000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_welcome_desktop.png` });
    await page.close();
    await context.close();

    // 2. Mobile Welcome Page (375x812)
    console.log('Capturing Mobile Welcome...');
    context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    page = await context.newPage();
    await page.goto('http://localhost:5173/?v=2');
    await wait(1000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_welcome_mobile.png` });
    
    // 3. Mobile Quiz Page (375x812)
    console.log('Capturing Mobile Quiz...');
    // Click agreed checkbox
    await page.locator('input[type="checkbox"]').check();
    await wait(200);
    // Click start button
    await page.locator('button.btn-primary:has-text("Start Profile"), button.btn-primary:has-text("診断を開始")').click();
    await wait(1000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_quiz_mobile.png` });
    await page.close();
    await context.close();

    // 4. Desktop Results Page - Overview (1280x1200 - tall viewport to capture most content)
    console.log('Capturing Desktop Results (Overview)...');
    context = await browser.newContext({ viewport: { width: 1280, height: 1200 } });
    page = await context.newPage();
    await page.goto('http://localhost:5173/?v=2&fp=75&sb=35&bs=60&ay=40&dv=80');
    await wait(1500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_results_desktop.png` });
    
    // 5. Desktop Results Page - Strengths Tab (1280x1200)
    console.log('Capturing Desktop Results (Strengths Tab)...');
    // Click the Strengths tab button
    await page.locator('button.tab-btn:has-text("Strengths"), button.tab-btn:has-text("特徴・長所")').click();
    await wait(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_results_strengths_tab_desktop.png` });
    await page.close();
    await context.close();

    // 6. Mobile Results Page (375x1200)
    console.log('Capturing Mobile Results...');
    context = await browser.newContext({ viewport: { width: 375, height: 1200 } });
    page = await context.newPage();
    await page.goto('http://localhost:5173/?v=2&fp=75&sb=35&bs=60&ay=40&dv=80');
    await wait(1500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_results_mobile.png` });
    await page.close();
    await context.close();

    // 7. Desktop Gallery Page (1280x960)
    console.log('Capturing Desktop Archetype Gallery...');
    context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
    page = await context.newPage();
    await page.goto('http://localhost:5173/?v=2&view=v2-gallery');
    await wait(1000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_gallery_page_desktop.png` });
    
    // 8. Desktop Gallery Detail Modal (1280x960)
    console.log('Capturing Desktop Archetype Details Modal...');
    // Click on the first card to open modal details
    await page.locator('.gallery-card').first().click();
    await wait(800);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_archetype_details_modal_desktop.png` });
    await page.close();
    await context.close();

    // 9. Desktop Methodology Page (1280x1200)
    console.log('Capturing Desktop Methodology...');
    context = await browser.newContext({ viewport: { width: 1280, height: 1200 } });
    page = await context.newPage();
    await page.goto('http://localhost:5173/?v=2&view=v2-methodology');
    await wait(1000);
    await page.screenshot({ path: `${ARTIFACT_DIR}/v2_methodology_page_desktop.png` });
    await page.close();
    await context.close();

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error during screenshot capture:', error);
  } finally {
    await browser.close();
    console.log('Stopping dev server...');
    devServer.kill();
  }
}

run();
