import { test, expect } from "@playwright/test";

import { login, logout, medaurl, randomname } from "globalis";

const testname = randomname("geriautpart");

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve

  await login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Partnerek").click();
  await expect(page).toHaveURL(medaurl(false, "#!partners"));
});

test.describe.serial("egy partnert érintő tesztek", () => {
  test("partner hozzáadás", async ({ page }) => {
    const textboxname = page.getByRole("textbox", { name: "Név" });
    const cellname = page.getByRole("cell", { name: testname });
    await expect(textboxname).toBeEditable();
    await textboxname.click();
    await expect(textboxname).toBeFocused();
    await textboxname.fill(testname);
    await page.getByRole("button", { name: " Mentés" }).click();
    await expect(cellname).toHaveText(testname);
    console.log(testname + " létrehozva");
  });

  test("partner törlés + megerősítő ablak", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await page.getByRole("button", { name: " Törlés" }).click();
    await page.getByRole("button", { name: "Nem" }).click();
    await page.getByRole("button", { name: " Törlés" }).click();
    await page.getByRole("button", { name: "Igen" }).click();
    console.log(testname + " törölve");
  });

  test("partner visszaállítás", async ({ page }) => {
    await page.getByText("Töröltek").click();
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await page.getByRole("button", { name: " Visszaállítás" }).click();
    await page.getByText("Töröltek").click();
    console.log(testname + " visszaállítva");
  });

  test.fixme("partner egyediség megsértése", async ({ page }) => {
    // ezt még nem tudom hogy kéne normálisan

    await page.getByRole("textbox", { name: "Név" }).click();
    await page.getByRole("textbox", { name: "Név" }).fill(testname);
    await page.getByRole("button", { name: " Mentés" }).click();
    //await expect(page).toContain('Hiba');
  });

  test("partner ismételt törlése", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testname });
    await expect(cellname).toHaveText(testname);
    await cellname.click();
    await page.getByRole("button", { name: " Törlés" }).click();
    await page.getByRole("button", { name: "Igen" }).click(); // EZEKBŐL FUNKCIÓT CSINÁLNI, MERT LEHET! HOLNAP! 
    console.log(testname + " ismételten törölve");
  });
  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});
