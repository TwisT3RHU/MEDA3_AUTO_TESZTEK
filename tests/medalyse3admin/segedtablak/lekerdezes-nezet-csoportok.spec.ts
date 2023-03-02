import { test, expect } from '@playwright/test';
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from 'globalis';

const testname = testfunc.randomname("PWLEKNEZCSOP");
const testnamedit = testname + "_edited";
const testtitle = testname + " lekérdezés nézet csoport";
const testtitledit = testtitle + " edited";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Lekérdezés nézet csoportok').click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!qeryViewGrps"));
});

test.describe.serial("egy lekérdezés nézet csoportot érintő tesztek", () => {
  test("lekérdezés nézet csoport hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új', exact: true }).click();
    await testfunc.textboxcheck(page, "Név", testname);
    await testfunc.textboxcheck(page, "Leírás", testtitle);
    await testfunc.pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    const cellshort = page.getByRole("cell", { name: testtitle, exact: true });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testtitle);
    console.log(testname + " létrehozva");
  });

  test("lekérdezés nézet csoport szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    const cellshort = page.getByRole("cell", { name: testtitledit, exact: true });
    await cellname.click();
    await testfunc.textboxcheck(page, "Név", testnamedit);
    await testfunc.textboxcheck(page, "Leírás", testtitledit);
    await testfunc.pressbutton(page, " Mentés", 0);
    const cellnamedit = page.getByRole("cell", { name: testnamedit, exact: true });
    await expect(cellnamedit).toHaveText(testnamedit);
    await expect(cellshort).toHaveText(testtitledit);
    console.log(testname + ", " + testtitle + " szerkesztve, új név, leírás: " + testnamedit + ", " + testtitledit);
  });

  test("lekérdezés nézet csoport törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testnamedit, exact: true });
    await expect(cellname).toHaveText(testnamedit);
    await cellname.click();
    await testfunc.removeitem(page, " Törlés", 0, 1);
    console.log(testnamedit + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});