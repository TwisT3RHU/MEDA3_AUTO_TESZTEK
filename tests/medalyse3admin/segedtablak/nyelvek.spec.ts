import { test, expect } from '@playwright/test';
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from 'globalis';

const testname = testfunc.randomname("Playwright");
const testshort = "PW";
const testshortedit = testshort + "E";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Nyelvek').click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!langs"));
});

test.describe.serial("egy nyelvet érintő tesztek", () => {
  test("nyelv hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új', exact: true }).click();
    await testfunc.textboxcheck(page, "Név", testname);
    await testfunc.textboxcheck(page, "Rövid név", testshort);
    await testfunc.pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    const cellshort = page.getByRole("cell", { name: testshort, exact: true });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testshort);
    console.log(testname + " létrehozva");
  });

  test("nyelv rövid név szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    const cellshort = page.getByRole("cell", { name: testshortedit, exact: true });
    await cellname.click();
    await testfunc.textboxcheck(page, "Rövid név", testshortedit);
    await testfunc.pressbutton(page, " Mentés", 0);
    await expect(cellshort).toHaveText(testshortedit);
    console.log(testshort + " szerkesztve, új rövid név: " + testshortedit);
  });

  test("nyelv törlés", async ({ page }) => {
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