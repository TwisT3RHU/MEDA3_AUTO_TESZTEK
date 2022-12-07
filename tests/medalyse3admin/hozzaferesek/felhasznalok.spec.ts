import { test, expect } from "@playwright/test";

import { login, medaurl, randomname, rowcheck, textboxcheck } from "globalis";
import { misc, user } from "core.json";

const testname = randomname("geriautusr");
const testnamedit = testname + "_edited";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve

  login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Felhasználók").click();
  await expect(page).toHaveURL(medaurl(false, "#!usrs"));
});

test.afterEach(async ({ page }) => {
  await page.locator('span:has-text("kilépés")').first().click();
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
    await page.getByRole("button", { name: " Mentés" }).click();
    console.log(testname + " létrehozva");
  });

  test.fixme("WIP felhasználó hozzáadása egy csoporthoz", async ({ page }) => {
    await page.getByRole("cell", { name: user.name }).click();
    //await page.getByRole("row", { name: /.*geriautocsop/ }).locator("span").click();
    //await page.getByRole("row", { name: /.*geriautocsop/ }).locator('v-grid-scroller').nth(2).evaluate(e => e.scrollIntoView());
    //await csoport.click() // EGYELŐRE NEM TUDOM FUTURE-PROOFOLNI :)
    //await page.getByRole("button", { name: " Hozzáad" }).click();
    console.log(testname + " hozzáadva egy csoporthoz");
  });

  test("felhasználó hozzáadása egy csoporthoz", async ({ page }) => {
    await page.getByRole("cell", { name: testname }).click();
    await page.getByRole("row", { name: /.*geriautocsop/ }).locator("span").click();
    //await page.getByRole("row", { name: /.*geriautocsop/ }).locator('v-grid-scroller').nth(2).evaluate(e => e.scrollIntoView());
    //await csoport.click() // EGYELŐRE NEM TUDOM FUTURE-PROOFOLNI :)
    await page.getByRole("button", { name: " Hozzáad" }).click();
    console.log(testname + " hozzáadva egy csoporthoz");
  });

  test("felhasználó eltávolítása egy csoportból + megerősítő ablak", async ({
    page,
  }) => {
    await page.getByRole("cell", { name: testname }).click();
    await page
      .locator(
        ".v-splitpanel-second-container > .v-panel > .v-panel-content > .v-verticallayout > .v-expand > div > .v-grid > .v-grid-tablewrapper > table > .v-grid-body > tr > td")
      .first()
      .click();
    await page.getByRole("button", { name: " Eltávolít" }).click();
    await page.getByRole("button", { name: "Nem" }).click();
    await page.getByRole("button", { name: " Eltávolít" }).click();
    await page.getByRole("button", { name: "Igen" }).click();
    console.log(testname + " eltávolítva egy csoportból");
  });

  test("felhasználó adatainak módosítása", async ({ page }) => {
    await page.getByRole("cell", { name: testname }).click();
    await page.getByRole("textbox", { name: "Jelszó" }).fill(testnamedit);
    await page.getByRole("textbox", { name: "Jelszó" }).press("Tab");
    await page
      .getByRole("textbox", { name: "Jelszó mégegyszer" })
      .fill(testnamedit);
    await page.getByRole("textbox", { name: "Teljes név" }).fill(testnamedit);
    await page.getByRole("textbox", { name: "Teljes név" }).press("Tab");
    await page
      .getByRole("textbox", { name: "Email cím" })
      .fill("autoteszt_edited@example.com");
    await page.getByRole("textbox", { name: "Email cím" }).press("Tab");
    await page
      .getByRole("textbox", { name: "Bejelentkező kód" })
      .fill(testnamedit);
    //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
    //await page.getByRole('button', { name: '»' }).click();
    //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
    //await page.getByRole('row', { name: 'Partner' }).getByRole('combobox').locator('div').click();
    //await page.getByText(user.usergroup).click();
    await page
      .getByRole("row", { name: "Alapértelmezett nyelv" })
      .getByRole("combobox")
      .locator("div")
      .click();
    await page.getByText("English").click();
    await page.getByRole("button", { name: " Mentés" }).click();
    console.log(testname + " módosítva: " + testnamedit);
  });

  test("felhasználó törlése + megerősítő ablak", async ({ page }) => {
    await page.getByRole("cell", { name: testnamedit }).click();
    await page.getByRole("button", { name: " Törlés" }).click();
    await page.getByRole("button", { name: "Nem" }).click();
    await page.getByRole("button", { name: " Törlés" }).click();
    await page.getByRole("button", { name: "Igen" }).click();
    console.log(testnamedit + " törölve");
  });

  test("felhasználó visszaállítása", async ({ page }) => {
    await page.getByText("Töröltek").click();
    await page.getByRole("cell", { name: testnamedit }).click();
    await page.getByRole("button", { name: " Visszaállítás" }).click();
    await page.getByText("Töröltek").click();
    console.log(testnamedit + " visszaállítva");
  });

  test("felhasználó ismételt törlése", async ({ page }) => {
    await page.getByRole("cell", { name: testnamedit }).click();
    await page.getByRole("button", { name: " Törlés" }).click();
    await page.getByRole("button", { name: "Igen" }).click();
    console.log(testnamedit + " ismét törölve");
  });
});

test.describe.serial(misc.bulkcount + " felhasználót érintő tesztek", () => {
  test(misc.bulkcount + " felhasználó létrehozása", async ({ page }) => {
    for (let index = 1; index < misc.bulkcount + 1; index++) {
      const randomname2 = testname + "_" + index;
      await page.getByRole("textbox", { name: "Név" }).fill(randomname2);
      await page.getByRole("textbox", { name: "Név" }).press("Tab");
      await page.getByRole("textbox", { name: "Jelszó" }).fill(randomname2);
      await page.getByRole("textbox", { name: "Jelszó" }).press("Tab");
      await page
        .getByRole("textbox", { name: "Jelszó mégegyszer" })
        .fill(randomname2);
      await page
        .getByRole("textbox", { name: "Teljes név" })
        .fill("autoteszt user " + index);
      await page.getByRole("textbox", { name: "Teljes név" }).press("Tab");
      await page
        .getByRole("textbox", { name: "Email cím" })
        .fill("autoteszt@" + index + "example.com");
      await page.getByRole("textbox", { name: "Email cím" }).press("Tab");
      await page
        .getByRole("textbox", { name: "Bejelentkező kód" })
        .fill(randomname2);
      //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
      //await page.getByRole('button', { name: '»' }).click();
      //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
      await page
        .getByRole("row", { name: "Partner" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText(user.partner).click();
      await page
        .getByRole("row", { name: "Alapértelmezett nyelv" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Magyar").click();
      await page.getByRole("button", { name: " Mentés" }).click();
      console.log(randomname2 + " létrehozva");
      await page.getByRole("cell", { name: randomname2 }).click();
    }
  });

  test(
    misc.bulkcount + " felhasználó adatainak módosítása",
    async ({ page }) => {
      for (let index = 1; index < misc.bulkcount + 1; index++) {
        const randomname2 = testname + "_" + index;
        await page.getByRole("cell", { name: randomname2 }).click();
        const randomname2edit = randomname2 + "_edited";
        await page
          .getByRole("textbox", { name: "Jelszó" })
          .fill(randomname2edit);
        await page.getByRole("textbox", { name: "Jelszó" }).press("Tab");
        await page
          .getByRole("textbox", { name: "Jelszó mégegyszer" })
          .fill(randomname2edit);
        await page
          .getByRole("textbox", { name: "Teljes név" })
          .fill("autoteszt user_edited" + index);
        await page.getByRole("textbox", { name: "Teljes név" }).press("Tab");
        await page
          .getByRole("textbox", { name: "Email cím" })
          .fill("autoteszt_edited@" + index + "example.com");
        await page.getByRole("textbox", { name: "Email cím" }).press("Tab");
        await page
          .getByRole("textbox", { name: "Bejelentkező kód" })
          .fill(randomname2edit);
        //await page.getByRole('row', { name: 'B. kód érvényesség' }).locator('button').click();
        //await page.getByRole('button', { name: '»' }).click();
        //await page.getByRole('row', { name: '23 24 25 26 27 28 29' }).getByText('29').click();
        //await page.getByRole('row', { name: 'Partner' }).getByRole('combobox').locator('div').click();
        //await page.getByText(user.usergroup).click();
        await page
          .getByRole("row", { name: "Alapértelmezett nyelv" })
          .getByRole("combobox")
          .locator("div")
          .click();
        await page.getByText("English").click();
        await page.getByRole("button", { name: " Mentés" }).click();
        console.log(randomname2edit + " módosítva");
        await page.getByRole("cell", { name: randomname2 }).click();
      }
    }
  );

  test(misc.bulkcount + " felhasználó törlése", async ({ page }) => {
    for (let index = 1; index < misc.bulkcount + 1; index++) {
      const randomname2edit = testname + "_" + index;
      +"_edited";
      await page.getByRole("cell", { name: randomname2edit }).click();
      await page.getByRole("button", { name: " Törlés" }).click();
      await page.getByRole("button", { name: "Igen" }).click();
      console.log(randomname2edit + " törölve");
    }
  });
});
