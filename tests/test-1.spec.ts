import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  await page.locator('button:has-text("settings")').click();

  await page.locator('#mat-slide-toggle-2 > .mat-slide-toggle-label > .mat-slide-toggle-bar').click();

  await page.getByRole('menuitem', { name: 'Névjegy' }).click();

  await page.getByRole('button', { name: 'close dialog' }).click();

});