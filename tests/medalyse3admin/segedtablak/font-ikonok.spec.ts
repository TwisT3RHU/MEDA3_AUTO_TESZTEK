import { test, expect } from '@playwright/test';
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, scrollUntilVisible, textboxcheck } from 'globalis';

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Font ikonok').click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!buttonIcons"));
});

test.describe.serial("font ikonokat érintő tesztek", () => {
  test("font ikon hozzáadás a készlethez", async ({ page }) => {
    const font = page.getByRole('row', { name: 'BEHANCE f1b4 ', exact: true }).getByRole('cell').first();
    await testfunc.scrollUntilVisible(page, "Név", 0, font);
    await font.click();
    await testfunc.pressbutton(page, '', 0);
    testfunc.logger.log(font + " hozzáadva a készlethez");
  });

  test("font ikon törlése a készletből", async ({ page }) => {
    const font = page.getByRole('row', { name: 'BEHANCE f1b4 ', exact: true }).getByRole('cell').first();
    await testfunc.scrollUntilVisible(page, "Név", 1, font);
    await font.click();
    await testfunc.pressbutton(page, '', 1);
    testfunc.logger.log(font + " törölve a készletből");
  });

  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});