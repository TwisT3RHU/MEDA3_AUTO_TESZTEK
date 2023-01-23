import { test, expect } from '@playwright/test';

import { login, logout, medaurl, pressbutton, randomname, removeitemeng, textboxcheck } from 'globalis';

const testname = randomname("PWLEKNEZCSOP");
const testnamedit = testname + "_edited";
const testtitle = testname + " lekérdezés nézet csoport";
const testtitledit = testtitle + " edited";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Lekérdezés nézet csoportok').click();
  await expect(page).toHaveURL(medaurl(false, "#!qeryViewGrps"));
});

test.describe.serial("egy lekérdezés nézet csoportot érintő tesztek", () => {
  test("lekérdezés nézet csoport hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await textboxcheck(page, "Név", testname);
    await textboxcheck(page, "Leírás", testtitle);
    await pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testtitle });
    await expect(cellname).toHaveText(testname);
    await expect(cellshort).toHaveText(testtitle);
    console.log(testname + " létrehozva");
  });

  test("lekérdezés nézet csoport szerkesztés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    const cellshort = page.getByRole("cell", { name: testtitledit });
    await cellname.click();
    await textboxcheck(page, "Név", testnamedit);
    await textboxcheck(page, "Leírás", testtitledit);
    await pressbutton(page, " Mentés", 0);
    const cellnamedit = page.getByRole("cell", { name: testnamedit });
    await expect(cellnamedit).toHaveText(testnamedit);
    await expect(cellshort).toHaveText(testtitledit);
    console.log(testname + ", " + testtitle + " szerkesztve, új név, leírás: " + testnamedit + ", " + testtitledit);
  });

  test("lekérdezés nézet csoport törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testnamedit });
    await expect(cellname).toHaveText(testnamedit);
    await cellname.click();
    await removeitemeng(page, " Törlés");
    console.log(testnamedit + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});