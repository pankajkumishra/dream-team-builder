import { test, expect } from '@playwright/test';

test('composition page loads form', async ({ page }) => {
  await page.goto('/composition/new');
  await expect(page.getByRole('heading', { name: 'Team composition recommendations' })).toBeVisible();
});
