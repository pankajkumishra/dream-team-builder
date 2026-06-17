import { test, expect } from '@playwright/test';

test('discovery page redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/discovery');
  await expect(page).toHaveURL(/login/);
});
