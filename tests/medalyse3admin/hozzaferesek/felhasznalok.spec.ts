import { test, expect } from "@playwright/test";

import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, rowcheck, scrollUntilVisible, textboxcheck } from "globalis";
import { misc, user } from "core.json";
//import { smoothscroll } from "smoothscroll-polyfill";

//smoothscroll.polyfill();

const testname = randomname("geriautusr");
const testnamedit = testname + "_edited";

logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Felhasználók").click();
  await expect(page).toHaveURL(medaurl(false, "#!usrs"));
});

test.describe.serial("egy felhasználót érintő tesztek", () => {
  test("felhasználó létrehozása", async ({ page }) => {
    const textboxes: string[][] = [
      ["Név", "Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
      [testname, testname, testname, "autoteszt user", "autoteszt@example.com", testname]
    ];
    for (let i= 0; i < textboxes[0].length; i++) {
      await textboxcheck(page, textboxes[0][i], textboxes[1][i]);
    };
    //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
    //await page.getByRole('button', { name: '»' }).click();
    //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
    await rowcheck(page, "Partner", user.partner);
    await rowcheck(page, "Alapértelmezett nyelv", "Magyar");
    await pressbutton(page, " Mentés", 0);
    logger.log(testname + " létrehozva");
  });

  test("felhasználó hozzáadása egy csoporthoz", async ({ page }) => {
    await page.getByRole("cell", { name: testname }).click();
    const autocsop = page.getByRole("row", { name: new RegExp(user.usergroup) }).locator("span");
    await scrollUntilVisible(page, "Azonosító", 1, autocsop); // fenomenális...
    await autocsop.click();
    await pressbutton(page, " Hozzáad", 0);
    logger.log(testname + " hozzáadva egy csoporthoz");
  });

  test("felhasználó eltávolítása egy csoportból", async ({
    page,
  }) => {
    await page.getByRole("cell", { name: testname }).click();
    await page
      .locator(
        ".v-splitpanel-second-container > .v-panel > .v-panel-content > .v-verticallayout > .v-expand > div > .v-grid > .v-grid-tablewrapper > table > .v-grid-body > tr > td")
      .first()
      .click();
    await removeitem(page, " Eltávolít");
    logger.log(testname + " eltávolítva egy csoportból");
  });

  test("felhasználó adatainak módosítása", async ({ page }) => {
    await page.getByRole("cell", { name: testname }).click();
    const textboxes: string[][] = [
      ["Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
      [testnamedit, testnamedit, testnamedit, "autoteszt_edited@example.com", testnamedit]
    ];
    for (let i= 0; i < textboxes[0].length; i++) {
      await textboxcheck(page, textboxes[0][i], textboxes[1][i]);
    };
    //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
    //await page.getByRole('button', { name: '»' }).click();
    //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
    //await page.getByRole('row', { name: 'Partner' }).getByRole('combobox').locator('div').click();
    //await page.getByText(user.usergroup).click();
    await rowcheck(page, "Alapértelmezett nyelv", "English");
    await pressbutton(page, " Mentés", 0);
    logger.log(testname + " módosítva: " + testnamedit);
  });

  test("felhasználó törlése", async ({ page }) => {
    await page.getByRole("cell", { name: testnamedit }).click();
    await removeitem(page, " Törlés");
    logger.log(testnamedit + " törölve");
  });

  test("felhasználó visszaállítása", async ({ page }) => {
    await page.getByText("Töröltek").click();
    await page.getByRole("cell", { name: testnamedit }).click();
    await pressbutton(page,  " Visszaállítás", 0);
    await page.getByText("Töröltek").click();
    logger.log(testnamedit + " visszaállítva");
  });

  test("felhasználó ismételt törlése", async ({ page }) => {
    await page.getByRole("cell", { name: testnamedit }).click();
    await removeitem(page, " Törlés");
    logger.log(testnamedit + " ismét törölve");
  });
  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});

test.describe.serial(misc.bulkcount + " felhasználót érintő tesztek", () => {
  test(misc.bulkcount + " felhasználó létrehozása", async ({ page }) => {
    for (let index = 1; index < misc.bulkcount + 1; index++) {
      const randomname2 = testname + "_" + index;
      const textboxes: string[][] = [
        ["Név", "Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
        [randomname2, randomname2, randomname2, "autoteszt user", "autoteszt" + index + "@example.com", randomname2]
      ];
      for (let i= 0; i < textboxes[0].length; i++) {
        await textboxcheck(page, textboxes[0][i], textboxes[1][i]);
      };
      //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
      //await page.getByRole('button', { name: '»' }).click();
      //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
      await rowcheck(page, "Partner", user.partner);
      await rowcheck(page, "Alapértelmezett nyelv", "Magyar");
      await pressbutton(page, " Mentés", 0);
      logger.log(randomname2 + " létrehozva");
      await page.getByRole("cell", { name: randomname2 }).click();
    };
  });

  test(misc.bulkcount + " felhasználó adatainak módosítása", async ({ page }) => {
      for (let index = 1; index < misc.bulkcount + 1; index++) {
        const randomname2 = testname + "_" + index;
        await page.getByRole("cell", { name: randomname2 }).click();
        const randomname2edit = randomname2 + "_edited";
        const textboxes: string[][] = [
          ["Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
          [randomname2edit, randomname2edit, randomname2edit, "autoteszt" + index + "_edited@example.com", randomname2edit]
        ];
        for (let i= 0; i < textboxes[0].length; i++) {
          await textboxcheck(page, textboxes[0][i], textboxes[1][i]);
        };
        await rowcheck(page, "Alapértelmezett nyelv", "English");
        await pressbutton(page, " Mentés", 0);
        logger.log(randomname2edit + " módosítva");
        await page.getByRole("cell", { name: randomname2 }).click();
      };
  });

  test(misc.bulkcount + " felhasználó törlése", async ({ page }) => {
    for (let index = 1; index < misc.bulkcount + 1; index++) {
      const randomname2edit = testname + "_" + index;
      +"_edited";
      await page.getByRole("cell", { name: randomname2edit }).click();
      await removeitem(page, " Törlés");
      logger.log(randomname2edit + " törölve");
    };
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});