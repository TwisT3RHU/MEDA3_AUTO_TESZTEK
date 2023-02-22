import { test, expect } from "@playwright/test";

import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, textboxcheck } from "globalis";

const testname = randomname("geriautpart");

logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Partnerek").click();
  await expect(page).toHaveURL(medaurl(false, "#!partners"));
});

test.describe.serial("egy partnert érintő tesztek", () => {
  test("partner hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await textboxcheck(page, "Név", testname);
    await pressbutton(page, " Mentés", 0);
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    logger.log(testname + " létrehozva");
  });

  test("partner törlés", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await removeitem(page, " Törlés");
    logger.log(testname + " törölve");
  });

  test("partner visszaállítás", async ({ page }) => {
    await page.getByText("Töröltek").click();
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await pressbutton(page,  " Visszaállítás", 0);
    await page.getByText("Töröltek").click();
    logger.log(testname + " visszaállítva");
  });

  test.fixme("partner egyediség megsértése", async ({ page }) => {
    // ezt még nem tudom hogy kéne normálisan

    await page.getByRole("textbox", { name: "Név" }).click();
    await page.getByRole("textbox", { name: "Név" }).fill(testname);
    await pressbutton(page, " Mentés", 0);
    //await expect(page).toContain('Hiba');
  });

  test("partner ismételt törlése", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await removeitem(page, " Törlés");    
    logger.log(testname + " ismételten törölve");
  });
  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});
