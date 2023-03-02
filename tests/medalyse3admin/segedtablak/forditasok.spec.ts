import { test, expect } from '@playwright/test';

//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, rowcheck, textboxcheck } from 'globalis';
import *  as testfunc from 'globalis';

const origname = "adatmódosítás";
const testname = testfunc.randomname("fordítás");
const testnamedit = testname + "_edited";

testfunc.logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Fordítások').click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!trans"));
});

test.describe.serial("egy fordítást érintő tesztek", () => {
  test("fordítás hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új', exact: true }).click();
    await testfunc.rowcheck(page, "Nyelv", "Playwright");
    await testfunc.textboxcheck(page, "Eredeti", origname);
    await testfunc.textboxcheck(page, "Fordítás", testname);
    await testfunc.pressbutton(page, " Mentés", 0);
    const celltest = page.getByRole("cell", { name: testname, exact: true });
    await expect(celltest).toHaveText(testname);
    testfunc.logger.log(celltest + " fordítás létrehozva");
  });

  test("fordítás szerkesztés", async ({ page }) => {
    const cellorig = page.getByRole("cell", { name: origname, exact: true });
    const celltest = page.getByRole("cell", { name: testnamedit, exact: true });
    await cellorig.nth(0).click();
    await testfunc.textboxcheck(page, "Fordítás", testnamedit);
    await testfunc.pressbutton(page, " Mentés", 0);
    await expect(celltest).toHaveText(testnamedit);
    testfunc.logger.log(cellorig + " szerkesztve, új fordítás: " + celltest);
  });

  test("fordítás törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testnamedit, exact: true });
    await expect(cellname).toHaveText(testnamedit);
    await cellname.click();
    await testfunc.removeitem(page, " Törlés");
    testfunc.logger.log(cellname + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});