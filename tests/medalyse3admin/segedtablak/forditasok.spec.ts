import { test, expect } from '@playwright/test';

import { login, logout, medaurl, pressbutton, randomname, removeitem, rowcheck, textboxcheck } from 'globalis';

const origname = "adatmódosítás";
const testname = randomname("fordítás");
const testnamedit = testname + "_edited";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Fordítások').click();
  await expect(page).toHaveURL(medaurl(false, "#!trans"));
});

test.describe.serial("egy fordítást érintő tesztek", () => {
  test("fordítás hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await rowcheck(page, "Nyelv", "Playwright");
    await textboxcheck(page, "Eredeti", origname);
    await textboxcheck(page, "Fordítás", testname);
    await pressbutton(page, " Mentés", 0);
    const celltest = page.getByRole("cell", { name: testname });
    await expect(celltest).toHaveText(testname);
    console.log(celltest + " fordítás létrehozva");
  });

  test("fordítás szerkesztés", async ({ page }) => {
    const cellorig = page.getByRole("cell", { name: origname });
    const celltest = page.getByRole("cell", { name: testnamedit });
    await cellorig.nth(0).click();
    await textboxcheck(page, "Fordítás", testnamedit);
    await pressbutton(page, " Mentés", 0);
    await expect(celltest).toHaveText(testnamedit);
    console.log(cellorig + " szerkesztve, új fordítás: " + celltest);
  });

  test("fordítás törlés + megerősítő ablak", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testnamedit });
    await expect(cellname).toHaveText(testnamedit);
    await cellname.click();
    await removeitem(page, " Törlés");
    console.log(cellname + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});