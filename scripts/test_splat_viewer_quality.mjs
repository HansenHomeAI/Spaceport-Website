#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const baseUrl = (process.env.PREVIEW_URL || 'http://localhost:3000').replace(/\/$/, '');
const targetUrl = `${baseUrl}/splat-viewer`;
const screenshotPath = path.resolve('logs/splat-viewer-quality.png');

const ensureDir = async () => {
  await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
};

const waitForRendering = async (page) => {
  await page.getByTestId('viewer-status').waitFor({ state: 'visible', timeout: 60_000 });
  await page.waitForFunction(
    () => document.querySelector('[data-testid=\"viewer-status\"]')?.textContent?.includes('Rendering'),
    undefined,
    { timeout: 60_000 },
  );
};

const run = async () => {
  await ensureDir();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(targetUrl);
  const localBundle = `${new URL(targetUrl).origin}/samples/sogs-test-1753999934/`;
  await page.getByTestId('bundle-input').fill(localBundle);
  await page.getByTestId('load-bundle').click();
  await waitForRendering(page);
  const stats = {
    splats: await page.getByTestId('stat-splats').textContent(),
    fps: await page.getByTestId('stat-fps').textContent(),
    memory: await page.getByTestId('stat-memory').textContent(),
  };
  await page.locator('.viewer-shell').screenshot({ path: screenshotPath });
  await browser.close();
  console.log(JSON.stringify({ url: targetUrl, screenshot: screenshotPath, stats }, null, 2));
};

run().catch((error) => {
  console.error('Splat viewer quality check failed:', error);
  process.exitCode = 1;
});
