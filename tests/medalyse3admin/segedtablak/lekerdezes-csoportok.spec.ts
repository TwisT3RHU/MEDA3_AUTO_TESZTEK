import { test, expect } from '@playwright/test';
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from 'globalis';

const testname = testfunc.randomname("PWLEKCSOP");
const testtitle = testname + " lekérdezés csoport";
const testtitledit = testtitle + " edited";

testfunc.logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Lekérdezés csoportok').click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!qeryCategories"));
});

test.describe.serial("egy lekérdezés csoportot érintő tesztek", () => {
  test("lekérdezés csoport hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await testfunc.textboxcheck(page, "Név", testname);
    await testfunc.textboxcheck(page, "Cím", testtitle);
    await testfunc.pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testtitle });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testtitle);
    testfunc.logger.log(testname + " létrehozva");
  });

  test("lekérdezés csoport cím szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testtitledit });
    await cellname.click();
    await testfunc.textboxcheck(page, "Cím", testtitledit);
    await testfunc.pressbutton(page, " Mentés", 0);
    await expect(cellshort).toHaveText(testtitledit);
    testfunc.logger.log(testtitle + " szerkesztve, új cím: " + testtitledit);
  });

  test("lekérdezés csoport törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await testfunc.removeitem(page, " Törlés");
    testfunc.logger.log(testname + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});