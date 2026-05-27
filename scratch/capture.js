import { chromium, devices } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/matthewpomeroy/.gemini/antigravity/brain/d8799d15-ad10-45bc-aee1-e736aab1f84e';

async function capture() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  
  const desktopViewport = { width: 1280, height: 800 };
  const mobileDevice = devices['iPhone 12'];

  // ---- V2 STANDALONE FLOW (dskb-v2.vercel.app) ----
  console.log('1. Capturing V2 Welcome Screen...');
  const pageDesktop = await browser.newPage({ viewport: desktopViewport });
  await pageDesktop.goto('https://dskb-v2.vercel.app/');
  await pageDesktop.waitForTimeout(1500);
  await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_welcome_desktop.png') });
  
  const pageMobile = await browser.newPage({ ...mobileDevice });
  await pageMobile.goto('https://dskb-v2.vercel.app/');
  await pageMobile.waitForTimeout(1500);
  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_welcome_mobile.png') });

  // Quiz Screen Mobile
  console.log('2. Navigating to V2 Quiz Screen (Mobile)...');
  await pageMobile.click('input[type="checkbox"]');
  await pageMobile.waitForTimeout(200);
  await pageMobile.click('button:has-text("Start Profile"), button:has-text("診断を開始")');
  await pageMobile.waitForTimeout(1000);
  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_quiz_mobile.png') });

  // Play through the quiz on Desktop to get results screen
  console.log('3. Completing V2 Quiz on Desktop...');
  await pageDesktop.click('input[type="checkbox"]');
  await pageDesktop.waitForTimeout(200);
  await pageDesktop.click('button:has-text("Start Profile"), button:has-text("診断を開始")');
  await pageDesktop.waitForTimeout(1000);

  // Neutral answers for 30 questions
  for (let i = 1; i <= 30; i++) {
    console.log(`  Answering question ${i}/30...`);
    await pageDesktop.waitForSelector('.likert-option.neutral');
    await pageDesktop.click('.likert-option.neutral');
    await pageDesktop.waitForTimeout(400); // Wait for auto-advance animation
  }

  console.log('4. Waiting for V2 Results Dashboard...');
  await pageDesktop.waitForSelector('.v2-results-container', { timeout: 15000 });
  await pageDesktop.waitForTimeout(3000); // Wait for radar chart loading/fade-in
  
  // Results Desktop
  await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_results_desktop.png'), fullPage: true });

  // Click tabs to verify layout and screenshot other tabs
  console.log('  Capturing V2 results strengths tab...');
  await pageDesktop.click('button:has-text("Strengths"), button:has-text("特徴・長所")');
  await pageDesktop.waitForTimeout(500);
  await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_results_strengths_tab_desktop.png') });

  // Results Mobile
  console.log('5. Navigating results in Mobile...');
  const resultsUrl = pageDesktop.url();
  await pageMobile.goto(resultsUrl);
  await pageMobile.waitForSelector('.v2-results-container', { timeout: 10000 });
  await pageMobile.waitForTimeout(3000);
  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_results_mobile.png'), fullPage: true });

  // Open Archetype Gallery modal on Desktop
  console.log('6. Opening V2 Archetype Gallery modal...');
  await pageDesktop.click('button:has-text("Explore archetypes"), button:has-text("アーキタイプ一覧")');
  await pageDesktop.waitForTimeout(1500);
  await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_gallery_page_desktop.png') });

  // Click first card to open details modal
  const cards = await pageDesktop.$$('.v2-archetype-card, .gallery-card');
  if (cards.length > 0) {
    console.log('  Clicking first archetype details card...');
    await cards[0].click();
    await pageDesktop.waitForTimeout(1500);
    await pageDesktop.screenshot({ path: path.join(ARTIFACT_DIR, 'v2_archetype_details_modal_desktop.png') });
  }

  // ---- V1 FLOW (dskb-types.vercel.app) ----
  console.log('7. Capturing V1 Welcome Screen...');
  const pageV1 = await browser.newPage({ viewport: desktopViewport });
  await pageV1.goto('https://dskb-types.vercel.app/');
  await pageV1.waitForTimeout(1500);
  await pageV1.screenshot({ path: path.join(ARTIFACT_DIR, 'v1_welcome_desktop.png') });

  await browser.close();
  console.log('All screenshots captured and saved successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
