import { expect, test } from '@playwright/test';

const viewerPath = '/splat-viewer';

const ensureLocalSample = async (pageUrl: string) => {
  const url = new URL(pageUrl);
  return `${url.origin}/samples/sogs-test-1753999934/`;
};

test('renders the supersplat bundle and exposes stats', async ({ page }) => {
  page.on('console', (message) => {
    console.log('viewer console:', message.text());
  });
  await page.goto(viewerPath);
  console.log('navigated to', page.url());
  const localBundle = await ensureLocalSample(page.url());
  await page.getByTestId('bundle-input').fill(localBundle);
  await page.getByTestId('load-bundle').click();
  await expect(page.getByTestId('normalized-url')).toContainText('/samples/', { timeout: 10_000 });

  await expect(page.getByTestId('viewer-status')).toHaveText(/Rendering/i, { timeout: 60_000 });
  await expect(page.getByTestId('stat-splats')).toContainText('252,004');

  await page.getByRole('button', { name: 'Auto-fit' }).click();
  await page.getByRole('button', { name: 'Reset camera' }).click();

  const viewer = page.locator('.viewer-shell');
  const box = await viewer.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -200);
  }

  await viewer.screenshot({ path: 'logs/splat-viewer-preview.png' });
});
