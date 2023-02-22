import { test, expect } from '@playwright/test';
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from 'globalis';

const testname = testfunc.randomname("Playwright");
const testshort = "PW";
const testshortedit = testshort + "E";

testfunc.logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Nyelvek').click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!langs"));
});

test.describe.serial("egy nyelvet érintő tesztek", () => {
  test("nyelv hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await testfunc.textboxcheck(page, "Név", testname);
    await testfunc.textboxcheck(page, "Rövid név", testshort);
    await testfunc.pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testshort });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testshort);
    testfunc.logger.log(testname + " létrehozva");
  });

  test("nyelv rövid név szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testshortedit });
    await cellname.click();
    await testfunc.textboxcheck(page, "Rövid név", testshortedit);
    await testfunc.pressbutton(page, " Mentés", 0);
    await expect(cellshort).toHaveText(testshortedit);
    testfunc.logger.log(testshort + " szerkesztve, új rövid név: " + testshortedit);
  });

  test("nyelv törlés", async ({ page }) => {
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