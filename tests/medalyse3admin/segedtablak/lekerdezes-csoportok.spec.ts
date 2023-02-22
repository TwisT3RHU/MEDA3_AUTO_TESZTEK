import { test, expect } from '@playwright/test';

import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from 'globalis';

const testname = randomname("PWLEKCSOP");
const testtitle = testname + " lekérdezés csoport";
const testtitledit = testtitle + " edited";

logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Lekérdezés csoportok').click();
  await expect(page).toHaveURL(medaurl(false, "#!qeryCategories"));
});

test.describe.serial("egy lekérdezés csoportot érintő tesztek", () => {
  test("lekérdezés csoport hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await textboxcheck(page, "Név", testname);
    await textboxcheck(page, "Cím", testtitle);
    await pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testtitle });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testtitle);
    logger.log(testname + " létrehozva");
  });

  test("lekérdezés csoport cím szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testtitledit });
    await cellname.click();
    await textboxcheck(page, "Cím", testtitledit);
    await pressbutton(page, " Mentés", 0);
    await expect(cellshort).toHaveText(testtitledit);
    logger.log(testtitle + " szerkesztve, új cím: " + testtitledit);
  });

  test("lekérdezés csoport törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await removeitem(page, " Törlés");
    logger.log(testname + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});