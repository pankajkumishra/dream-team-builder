import { test, expect } from '@playwright/test';

test('analysis page requires auth', async ({ page }) => {
  await page.goto('/analysis');
  await expect(page).toHaveURL(/login/);
});
