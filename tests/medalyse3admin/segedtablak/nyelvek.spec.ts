import { test, expect } from '@playwright/test';

import { login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from 'globalis';

const testname = randomname("Playwright");
const testshort = "PW";
const testshortedit = testshort + "E";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Nyelvek').click();
  await expect(page).toHaveURL(medaurl(false, "#!langs"));
});

test.describe.serial("egy nyelvet érintő tesztek", () => {
  test("nyelv hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await textboxcheck(page, "Név", testname);
    await textboxcheck(page, "Rövid név", testshort);
    await pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testshort });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testshort);
    console.log(testname + " létrehozva");
  });

  test("nyelv rövid név szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testshortedit });
    await cellname.click();
    await textboxcheck(page, "Rövid név", testshortedit);
    await pressbutton(page, " Mentés", 0);
    await expect(cellshort).toHaveText(testshortedit);
    console.log(testshort + " szerkesztve, új rövid név: " + testshortedit);
  });

  test("nyelv törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await removeitem(page, " Törlés");
    console.log(testname + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});