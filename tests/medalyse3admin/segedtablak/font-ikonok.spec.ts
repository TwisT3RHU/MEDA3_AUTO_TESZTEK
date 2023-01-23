import { test, expect } from '@playwright/test';

import { login, logout, medaurl, scrollUntilVisible, textboxcheck } from 'globalis';

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Font ikonok').click();
  await expect(page).toHaveURL(medaurl(false, "#!buttonIcons"));
});

test.describe.serial("font ikonokat érintő tesztek", () => {
  test("font ikon hozzáadás a készlethez", async ({ page }) => {
    const font = page.getByRole('row', { name: 'BEHANCE f1b4 ' }).getByRole('cell').first();
    await scrollUntilVisible(page, "Név", 0, font);
    await font.click();
    const gomb = page.getByRole('button', { name: '' });
    await expect(gomb).toBeEnabled();
    await gomb.click();
    console.log(font + " hozzáadva a készlethez");
  });

  test("font ikon törlése a készletből", async ({ page }) => {
    const font = page.getByRole('row', { name: 'BEHANCE f1b4 ' }).getByRole('cell').first();
    await scrollUntilVisible(page, "Név", 1, font);
    await font.click();
    const gomb = page.getByRole('button', { name: '' }).nth(1);
    await expect(gomb).toBeEnabled();
    await gomb.click();
    console.log(font + " törölve a készletből");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});