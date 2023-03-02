import { test, expect } from "@playwright/test";
import *  as testfunc from 'globalis';
//import { logger, login, logout, medaurl, pressbutton, randomname, removeitem, rowcheck, scrollUntilVisible, textboxcheck } from "globalis";
import * as core from "core.json";
//import { smoothscroll } from "smoothscroll-polyfill";

//smoothscroll.polyfill();

const testname = testfunc.randomname("geriautusr");
const testnamedit = testname + "_edited";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await testfunc.login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Felhasználók").click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!usrs"));
});

test.describe.serial("egy felhasználót érintő tesztek", () => {
  test("felhasználó létrehozása", async ({ page }) => {
    const textboxes: string[][] = [
      ["Név", "Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
      [testname, testname, testname, "autoteszt user", "autoteszt@example.com", testname]
    ];
    for (let i= 0; i < textboxes[0].length; i++) {
      await testfunc.textboxcheck(page, textboxes[0][i], textboxes[1][i]);
    };
    //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
    //await page.getByRole('button', { name: '»' }).click();
    //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
    await testfunc.rowcheck(page, "Partner", core.user.partner);
    await testfunc.rowcheck(page, "Alapértelmezett nyelv", "Magyar");
    await testfunc.pressbutton(page, " Mentés", 0);
    console.log(testname + " létrehozva");
  });

  test("felhasználó hozzáadása egy csoporthoz", async ({ page }) => {
    await page.getByRole("cell", { name: testname, exact: true }).click();
    const autocsop = page.getByRole("row", { name: new RegExp(core.user.usergroup), exact: true }).locator("span");
    await testfunc.scrollUntilVisible(page, "Azonosító", 1, autocsop); // fenomenális...
    await autocsop.click();
    await testfunc.pressbutton(page, " Hozzáad", 0);
    console.log(testname + " hozzáadva egy csoporthoz");
  });

  test("felhasználó eltávolítása egy csoportból", async ({
    page,
  }) => {
    await page.getByRole("cell", { name: testname, exact: true }).click();
    await page
      .locator(
        ".v-splitpanel-second-container > .v-panel > .v-panel-content > .v-verticallayout > .v-expand > div > .v-grid > .v-grid-tablewrapper > table > .v-grid-body > tr > td")
      .first()
      .click();
    await testfunc.removeitem(page, " Eltávolít");
    console.log(testname + " eltávolítva egy csoportból");
  });

  test("felhasználó adatainak módosítása", async ({ page }) => {
    await page.getByRole("cell", { name: testname, exact: true }).click();
    const textboxes: string[][] = [
      ["Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
      [testnamedit, testnamedit, testnamedit, "autoteszt_edited@example.com", testnamedit]
    ];
    for (let i= 0; i < textboxes[0].length; i++) {
      await testfunc.textboxcheck(page, textboxes[0][i], textboxes[1][i]);
    };
    //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
    //await page.getByRole('button', { name: '»' }).click();
    //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
    //await page.getByRole('row', { name: 'Partner' }).getByRole('combobox').locator('div').click();
    //await page.getByText(user.usergroup).click();
    await testfunc.rowcheck(page, "Alapértelmezett nyelv", "English");
    await testfunc.pressbutton(page, " Mentés", 0);
    console.log(testname + " módosítva: " + testnamedit);
  });

  test("felhasználó törlése", async ({ page }) => {
    await page.getByRole("cell", { name: testnamedit, exact: true }).click();
    await testfunc.removeitem(page, " Törlés");
    console.log(testnamedit + " törölve");
  });

  test("felhasználó visszaállítása", async ({ page }) => {
    await page.getByText("Töröltek").click();
    await page.getByRole("cell", { name: testnamedit, exact: true }).click();
    await testfunc.pressbutton(page,  " Visszaállítás", 0);
    await page.getByText("Töröltek").click();
    console.log(testnamedit + " visszaállítva");
  });

  test("felhasználó ismételt törlése", async ({ page }) => {
    await page.getByRole("cell", { name: testnamedit, exact: true }).click();
    await testfunc.removeitem(page, " Törlés");
    console.log(testnamedit + " ismét törölve");
  });
  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});

test.describe.serial(core.misc.bulkcount + " felhasználót érintő tesztek", () => {
  test(core.misc.bulkcount + " felhasználó létrehozása", async ({ page }) => {
    for (let index = 1; index < core.misc.bulkcount + 1; index++) {
      const randomname2 = testname + "_" + index;
      const textboxes: string[][] = [
        ["Név", "Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
        [randomname2, randomname2, randomname2, "autoteszt user", "autoteszt" + index + "@example.com", randomname2]
      ];
      for (let i= 0; i < textboxes[0].length; i++) {
        await testfunc.textboxcheck(page, textboxes[0][i], textboxes[1][i]);
      };
      //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
      //await page.getByRole('button', { name: '»' }).click();
      //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
      await testfunc.rowcheck(page, "Partner", core.user.partner);
      await testfunc.rowcheck(page, "Alapértelmezett nyelv", "Magyar");
      await testfunc.pressbutton(page, " Mentés", 0);
      console.log(randomname2 + " létrehozva");
      await page.getByRole("cell", { name: randomname2, exact: true }).click();
    };
  });

  test(core.misc.bulkcount + " felhasználó adatainak módosítása", async ({ page }) => {
      for (let index = 1; index < core.misc.bulkcount + 1; index++) {
        const randomname2 = testname + "_" + index;
        await page.getByRole("cell", { name: randomname2, exact: true }).click();
        const randomname2edit = randomname2 + "_edited";
        const textboxes: string[][] = [
          ["Jelszó", "Jelszó mégegyszer", "Teljes név", "Email cím", "Bejelentkező kód"],
          [randomname2edit, randomname2edit, randomname2edit, "autoteszt" + index + "_edited@example.com", randomname2edit]
        ];
        for (let i= 0; i < textboxes[0].length; i++) {
          await testfunc.textboxcheck(page, textboxes[0][i], textboxes[1][i]);
        };
        await testfunc.rowcheck(page, "Alapértelmezett nyelv", "English");
        await testfunc.pressbutton(page, " Mentés", 0);
        console.log(randomname2edit + " módosítva");
        await page.getByRole("cell", { name: randomname2, exact: true }).click();
      };
  });

  test(core.misc.bulkcount + " felhasználó törlése", async ({ page }) => {
    for (let index = 1; index < core.misc.bulkcount + 1; index++) {
      const randomname2edit = testname + "_" + index;
      +"_edited";
      await page.getByRole("cell", { name: randomname2edit, exact: true }).click();
      await testfunc.removeitem(page, " Törlés");
      console.log(randomname2edit + " törölve");
    };
  });

  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});