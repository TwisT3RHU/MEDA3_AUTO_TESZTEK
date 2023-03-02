import { test, expect } from "@playwright/test";
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from "globalis";

const testname = testfunc.randomname("geriautpart");

testfunc.logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Partnerek").click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!partners"));
});

test.describe.serial("egy partnert érintő tesztek", () => {
  test("partner hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új', exact: true }).click();
    await testfunc.textboxcheck(page, "Név", testname);
    await testfunc.pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    await expect(cellname).toHaveText(testname);
    testfunc.logger.log(testname + " létrehozva");
  });

  test("partner törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await testfunc.removeitem(page, " Törlés");
    testfunc.logger.log(testname + " törölve");
  });

  test("partner visszaállítás", async ({ page }) => {
    await page.getByText("Töröltek").click();
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await testfunc.pressbutton(page,  " Visszaállítás", 0);
    await page.getByText("Töröltek").click();
    testfunc.logger.log(testname + " visszaállítva");
  });

  test.fixme("partner egyediség megsértése", async ({ page }) => {
    // ezt még nem tudom hogy kéne normálisan

    await page.getByRole("textbox", { name: "Név", exact: true }).click();
    await page.getByRole("textbox", { name: "Név", exact: true }).fill(testname);
    await testfunc.pressbutton(page, " Mentés", 0);
    //await expect(page).toContain('Hiba');
  });

  test("partner ismételt törlése", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname, exact: true });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await testfunc.removeitem(page, " Törlés");    
    testfunc.logger.log(testname + " ismételten törölve");
  });
  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});
