/**
 * Script to capture PNG screenshots of specific HTML elements
 *
 * Usage: npx ts-node scripts/screenshot-elements.ts
 *
 * Make sure your dev server is running: npm run startFrontend
 */

import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

async function captureElementScreenshots() {
  // Ensure screenshots directory exists
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to journal page
  await page.goto('http://localhost:4200/journal');

  // Wait for the page to load
  await page.waitForTimeout(2000);

  // Click on the Productivity tab
  await page.click('button.nav-tab:has-text("Productivity")');
  await page.waitForTimeout(500);

  // Capture the entire journal page content (productivity view)
  const screenshotPath = path.join(screenshotsDir, 'journal-productivity.png');
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  console.log(`✓ Captured: journal-productivity.png -> ${screenshotPath}`);

  await browser.close();
}

captureElementScreenshots().catch(console.error);
