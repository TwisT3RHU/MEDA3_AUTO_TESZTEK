import { test, expect } from '@playwright/test';
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from 'globalis';

const testname = testfunc.randomname("PWLEKCSOP");
const testtitle = testname + " lekérdezés csoport";
const testtitledit = testtitle + " edited";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await testfunc.navigateToAdminPage(page, "►Segédtáblák", "Lekérdezés csoportok", "#!qeryCategories");
});

test.describe.serial("egy lekérdezés csoportot érintő tesztek", () => {
  test("lekérdezés csoport hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új', exact: true }).click();
    await testfunc.textboxcheck(page, "Név", testname);
    await testfunc.textboxcheck(page, "Cím", testtitle);
    await testfunc.pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    const cellshort = page.getByRole("cell", { name: testtitle, exact: true });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testtitle);
    console.log(testname + " létrehozva");
  });

  test("lekérdezés csoport cím szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    const cellshort = page.getByRole("cell", { name: testtitledit, exact: true });
    await cellname.click();
    await testfunc.textboxcheck(page, "Cím", testtitledit);
    await testfunc.pressbutton(page, " Mentés", 0);
    await expect(cellshort).toHaveText(testtitledit);
    console.log(testtitle + " szerkesztve, új cím: " + testtitledit);
  });

  test("lekérdezés csoport törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await testfunc.removeitem(page, " Törlés");
    console.log(testname + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});