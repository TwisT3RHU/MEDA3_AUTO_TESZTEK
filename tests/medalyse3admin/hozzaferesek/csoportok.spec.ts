import { test, expect } from "@playwright/test";
import *  as testfunc from 'globalis';
//import { branch, datum, logger, login, logout, medaurl, pressbutton, randomname, removeitem } from "globalis";
import * as core from "core.json";

const testname = testfunc.randomname("geriautcsp");

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve

  await testfunc.login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Csoportok").click();
  await expect(page).toHaveURL(testfunc.medaurl(false, "#!grps"));
});

test.describe.serial("egy csoportot érintő tesztek", () => {
  test("csoport létrehozása", async ({ page }) => {
    await testfunc.pressbutton(page, " Új" , 0);
    await page.getByRole("textbox", { name: "Név", exact: true }).click();
    await page.getByRole("textbox", { name: "Név", exact: true }).fill(testname);
    await page.getByRole("textbox", { name: "Név", exact: true }).press("Tab");
    await page.getByRole("textbox", { name: "Információ", exact: true }).click();
    await page
      .getByRole("textbox", { name: "Információ", exact: true })
      .fill(testfunc.datum() + " playwright teszt " + testname);
    await testfunc.pressbutton(page, " Mentés", 0);
    console.log(testname + " csoport létrehozva");
  });

  test("csoport jogosultságainak beállítása", async ({ page }) => {
    if (testfunc.branch() == "gamma") {
      await page.getByRole("cell", { name: testname, exact: true }).click();
      await page.getByRole("combobox").locator("div").click();
      await page.getByText("General.Admin").click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page.getByRole("combobox").locator("div").click();
      await page.getByText("Client.Menu").click();
      await page
        .getByRole("row", { name: "Alkalmazás", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Alkalmazás", exact: true })
        .fill("medalyse3app");
      await page.getByRole("textbox", { name: "Alkalmazás", exact: true }).press(" ");
      await page
        .getByRole("textbox", { name: "Alkalmazás", exact: true })
        .press("Backspace");
      await page.getByText("medalyse3app").click();
      await page.getByText("Főmenü").click();
      await page
        .getByRole("cell", { name: " Főmenü" })
        .locator("span")
        .click();
      //for (let i = 0; i < 5; i++) await page.getByText('Menü címe').press('PageDown');
      await page.getByText("Tesztriportok").click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .locator('td[role="listitem"]:has-text("Client.ExportRows")')
        .click();
      await page.getByRole("textbox", { name: "Sorok száma", exact: true }).click();
      await page.getByRole("textbox", { name: "Sorok száma", exact: true }).fill("10");
      await page
        .getByRole("row", { name: "Riport", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Riport", exact: true })
        .fill("KGERIC_EXPORT_TESZT_2020");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press(" ");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press("Backspace");
      await page.getByText("KGERIC_EXPORT_TESZT_2020").click();
      await page
        .getByRole("row", { name: "Lekérdezés", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("QUERY_FOR_ROWS_EXPORT").click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .locator('td[role="listitem"]:has-text("Client.ExportTable")')
        .click();
      await page
        .getByRole("row", { name: "Lekérdezés", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("QUERY_FOR_TABLE_EXPORT").click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.ExportDiagram").click();
      await page
        .getByRole("row", { name: "Riport", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      //await page.getByRole('textbox', { name: 'Riport' }).dblclick();
      await page
        .getByRole("textbox", { name: "Riport", exact: true })
        .fill("KGERIC_ROUT_MEGJELENESEK");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press(" ");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press("Backspace");
      await page
        .locator('td[role="listitem"]:has-text("KGERIC_ROUT_MEGJELENESEK")')
        .click();
      await page.getByRole("textbox", { name: "Lekérdezés", exact: true }).click();
      await page
        .getByRole("row", { name: "Lekérdezés", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Lekérdezés", exact: true })
        .fill("DIAGRAM_BOXPLOT");
      await page.getByRole("textbox", { name: "Lekérdezés", exact: true }).press(" ");
      await page
        .getByRole("textbox", { name: "Lekérdezés", exact: true })
        .press("Backspace");
      await page.getByText("DIAGRAM_BOXPLOT").click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.DisableFld").click();
      await page
        .getByRole("row", { name: "Mező", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.locator('td[role="listitem"]:has-text("ID")').click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Riport", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("KGERIC_ROUT_SZINKRON_TESZT").click();
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.DisableButton").click();
      //await page.getByRole('textbox', { name: 'Riport' }).dblclick();
      await page
        .getByRole("textbox", { name: "Riport", exact: true })
        .fill("KGERIC_GOMBOK_TESZT");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press(" ");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press("Backspace");
      await page.getByText("KGERIC_GOMBOK_TESZT").click();
      //await page.getByRole('row', { name: 'Dinamikus gomb' }).getByRole('combobox').locator('div').click();
      await page
        .getByRole("row", { name: "Lekérdezés", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByRole("textbox", { name: "Lekérdezés", exact: true }).fill("JARMUVEK");
      await page.getByRole("textbox", { name: "Lekérdezés", exact: true }).press(" ");
      await page
        .getByRole("textbox", { name: "Lekérdezés", exact: true })
        .press("Backspace");
      await page.getByText("JARMUVEK").click();
      await page
        .getByRole("row", { name: "Dinamikus gomb", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Dinamikus gomb", exact: true })
        .fill("docupdesc");
      await page.getByRole("textbox", { name: "Dinamikus gomb", exact: true }).press(" ");
      await page
        .getByRole("textbox", { name: "Dinamikus gomb", exact: true })
        .press("Backspace");
      await page.getByText("docupdesc").click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .locator('td[role="listitem"]:has-text("Client.DisableSaves")')
        .click();
      await page
        .getByRole("row", { name: "Alkalmazás", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Alkalmazás", exact: true })
        .fill("medalyse3app");
      await page.getByRole("textbox", { name: "Alkalmazás", exact: true }).press(" ");
      await page
        .getByRole("textbox", { name: "Alkalmazás", exact: true })
        .press("Backspace");
      await page.locator('span:has-text("medalyse3app")').click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.DisableExternalControls").click();
      await page
        .getByRole("row", { name: "Riport", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Riport", exact: true })
        .fill("KGERIC_GOMBOK_TESZT");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press(" ");
      await page.getByRole("textbox", { name: "Riport", exact: true }).press("Backspace");
      await page
        .locator('td[role="listitem"]:has-text("KGERIC_GOMBOK_TESZT")')
        .click();
      await page
        .getByRole("row", { name: "Lekérdezés", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByRole("textbox", { name: "Lekérdezés", exact: true }).fill("EVDARAB");
      await page.getByRole("textbox", { name: "Lekérdezés", exact: true }).press(" ");
      await page
        .getByRole("textbox", { name: "Lekérdezés", exact: true })
        .press("Backspace");
      await page.getByText("EVDARAB").click();
      await page
        .getByRole("row", { name: "Dinamikus gomb", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Dinamikus gomb", exact: true })
        .fill("floatingchart");
      await page.getByRole("textbox", { name: "Dinamikus gomb", exact: true }).press(" ");
      await page
        .getByRole("textbox", { name: "Dinamikus gomb", exact: true })
        .press("Backspace");
      await page.getByText("floatingchart").click();
      await testfunc.pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Survey.EnableKampany").click();
      await page
        .getByRole("row", { name: "Kérdőív", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("row", { name: "COVID-19", exact: true })
        .locator('td[role="listitem"]:has-text("COVID-19")')
        .click();
      await page
        .getByRole("row", { name: "Kampány", exact: true })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("2020.04.28").click();
    } else test.skip();
  });

  test("csoport módosítása", async ({ page }) => {
    await page.getByRole("cell", { name: testname, exact: true }).click();
    await page.getByRole("textbox", { name: "Információ", exact: true }).click();
    await page
      .getByRole("textbox", { name: "Információ", exact: true })
      .fill(testfunc.datum() + " playwright teszt_edited");
    await testfunc.pressbutton(page, " Mentés", 0);
    console.log(testname + " leírás módosítva");
  });

  test("felhasználó hozzáadása a csoporthoz", async ({ page }) => {
    await page.getByRole("cell", { name: testname, exact: true }).click();
    await page.locator("#gwt-uid-91").click();
    await page.locator("#gwt-uid-91").fill(core.user.name);
    await page.check("input[type=checkbox]:nth-child(1)");
    expect(
      await page.isChecked("input[type=checkbox]:nth-child(1)")
    ).toBeTruthy();
    await testfunc.pressbutton(page, " Hozzáad", 0);
    console.log(
      core.user.name + " felhasználó hozzáadva a " + testname + " csoporthoz"
    );
  });

  test("felhasználó eltávolítása a csoportból", async ({ page, }) => {
    await page.getByRole("cell", { name: testname, exact: true }).click();
    await page.locator("#gwt-uid-91").click();
    await page.locator("#gwt-uid-91").fill(core.user.name);
    await page.check("input[type=checkbox]:nth-child(1)");
    expect(
      await page.isChecked("input[type=checkbox]:nth-child(1)")
    ).toBeTruthy();
    await testfunc.removeitem(page, " Eltávolít");
    console.log(core.user.name + " eltávolítva a " + testname + " csoportból");
  });

  test("csoport jogosultságainak törlése", async ({
    page,
  }) => {
    if (testfunc.branch() == "gamma") {
      await page.getByRole("cell", { name: testname, exact: true }).click();
      await page
        .locator(
          ".v-splitpanel-second-container > .v-splitpanel-horizontal > div > .v-splitpanel-second-container > div > div > div > .v-panel > .v-panel-content > .v-verticallayout > div > div > .v-grid > .v-grid-tablewrapper > table > .v-grid-header > .v-grid-row > th"
        )
        .first()
        .click();
      await testfunc.removeitem(page, " Eltávolít", 1);
      console.log(testname + " csoport jogosultságai törölve");
    } else test.skip();
  });

  test("csoport törlése", async ({ page }) => {
    await page.getByRole("cell", { name: testname, exact: true }).click();
    await testfunc.removeitem(page, " Törlés");
    console.log(testname + " csoport törölve");
  });
  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});

test.describe.serial(core.misc.bulkcount + " csoportot érintő tesztek", () => {
  test(core.misc.bulkcount + " csoport létrehozása", async ({ page }) => {
    for (let index = 1; index < core.misc.bulkcount + 1; index++) {
      const randomname2 = testname + "_" + index;
      await testfunc.pressbutton(page, " Új" , 0);
      await page.getByRole("textbox", { name: "Név", exact: true }).click();
      await page.getByRole("textbox", { name: "Név", exact: true }).fill(randomname2);
      await page.getByRole("textbox", { name: "Név", exact: true }).press("Tab");
      await page.getByRole("textbox", { name: "Információ", exact: true }).click();
      await page
        .getByRole("textbox", { name: "Információ", exact: true })
        .fill(testfunc.datum() + " playwright teszt " + randomname2);
      await testfunc.pressbutton(page, " Mentés", 0);
      console.log(randomname2 + " csoport létrehozva");
      await page.getByRole("cell", { name: randomname2, exact: true }).click();
    }
  });

  test(core.misc.bulkcount + " csoport törlése", async ({ page }) => {
    for (let index = 1; index < core.misc.bulkcount + 1; index++) {
      const randomname2 = testname + "_" + index;
      await page.getByRole("cell", { name: randomname2, exact: true }).click();
      await testfunc.removeitem(page, " Törlés");
      console.log(randomname2 + " csoport törölve");
    }
  });
  test.afterEach(async ({ page }) => {
    await testfunc.logout(page);
  });
});
