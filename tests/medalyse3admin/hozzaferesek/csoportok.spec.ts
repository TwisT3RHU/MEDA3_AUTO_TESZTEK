import { test, expect } from "@playwright/test";

import { branch, datum, logger, login, logout, medaurl, pressbutton, randomname, removeitem } from "globalis";
import { misc, user } from "core.json";

const testname = randomname("geriautcsp");

logger.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve

  await login(page);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Csoportok").click();
  await expect(page).toHaveURL(medaurl(false, "#!grps"));
});

test.describe.serial("egy csoportot érintő tesztek", () => {
  test("csoport létrehozása", async ({ page }) => {
    await pressbutton(page, " Új" , 0);
    await page.getByRole("textbox", { name: "Név" }).click();
    await page.getByRole("textbox", { name: "Név" }).fill(testname);
    await page.getByRole("textbox", { name: "Név" }).press("Tab");
    await page.getByRole("textbox", { name: "Információ" }).click();
    await page
      .getByRole("textbox", { name: "Információ" })
      .fill(datum() + " playwright teszt " + testname);
    await pressbutton(page, " Mentés", 0);
    logger.log(testname + " csoport létrehozva");
  });

  test("csoport jogosultságainak beállítása", async ({ page }) => {
    if (branch() == "gamma") {
      await page.getByRole("cell", { name: testname }).click();
      await page.getByRole("combobox").locator("div").click();
      await page.getByText("General.Admin").click();
      await pressbutton(page, " Hozzáad", 1);
      await page.getByRole("combobox").locator("div").click();
      await page.getByText("Client.Menu").click();
      await page
        .getByRole("row", { name: "Alkalmazás" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Alkalmazás" })
        .fill("medalyse3app");
      await page.getByRole("textbox", { name: "Alkalmazás" }).press(" ");
      await page
        .getByRole("textbox", { name: "Alkalmazás" })
        .press("Backspace");
      await page.getByText("medalyse3app").click();
      await page.getByText("Főmenü").click();
      await page
        .getByRole("cell", { name: " Főmenü" })
        .locator("span")
        .click();
      //for (let i = 0; i < 5; i++) await page.getByText('Menü címe').press('PageDown');
      await page.getByText("Tesztriportok").click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .locator('td[role="listitem"]:has-text("Client.ExportRows")')
        .click();
      await page.getByRole("textbox", { name: "Sorok száma" }).click();
      await page.getByRole("textbox", { name: "Sorok száma" }).fill("10");
      await page
        .getByRole("row", { name: "Riport" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Riport" })
        .fill("KGERIC_EXPORT_TESZT_2020");
      await page.getByRole("textbox", { name: "Riport" }).press(" ");
      await page.getByRole("textbox", { name: "Riport" }).press("Backspace");
      await page.getByText("KGERIC_EXPORT_TESZT_2020").click();
      await page
        .getByRole("row", { name: "Lekérdezés" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("QUERY_FOR_ROWS_EXPORT").click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .locator('td[role="listitem"]:has-text("Client.ExportTable")')
        .click();
      await page
        .getByRole("row", { name: "Lekérdezés" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("QUERY_FOR_TABLE_EXPORT").click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.ExportDiagram").click();
      await page
        .getByRole("row", { name: "Riport" })
        .getByRole("combobox")
        .locator("div")
        .click();
      //await page.getByRole('textbox', { name: 'Riport' }).dblclick();
      await page
        .getByRole("textbox", { name: "Riport" })
        .fill("KGERIC_ROUT_MEGJELENESEK");
      await page.getByRole("textbox", { name: "Riport" }).press(" ");
      await page.getByRole("textbox", { name: "Riport" }).press("Backspace");
      await page
        .locator('td[role="listitem"]:has-text("KGERIC_ROUT_MEGJELENESEK")')
        .click();
      await page.getByRole("textbox", { name: "Lekérdezés" }).click();
      await page
        .getByRole("row", { name: "Lekérdezés" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Lekérdezés" })
        .fill("DIAGRAM_BOXPLOT");
      await page.getByRole("textbox", { name: "Lekérdezés" }).press(" ");
      await page
        .getByRole("textbox", { name: "Lekérdezés" })
        .press("Backspace");
      await page.getByText("DIAGRAM_BOXPLOT").click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.DisableFld").click();
      await page
        .getByRole("row", { name: "Mező" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.locator('td[role="listitem"]:has-text("ID")').click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Riport" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("KGERIC_ROUT_SZINKRON_TESZT").click();
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.DisableButton").click();
      //await page.getByRole('textbox', { name: 'Riport' }).dblclick();
      await page
        .getByRole("textbox", { name: "Riport" })
        .fill("KGERIC_GOMBOK_TESZT");
      await page.getByRole("textbox", { name: "Riport" }).press(" ");
      await page.getByRole("textbox", { name: "Riport" }).press("Backspace");
      await page.getByText("KGERIC_GOMBOK_TESZT").click();
      //await page.getByRole('row', { name: 'Dinamikus gomb' }).getByRole('combobox').locator('div').click();
      await page
        .getByRole("row", { name: "Lekérdezés" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByRole("textbox", { name: "Lekérdezés" }).fill("JARMUVEK");
      await page.getByRole("textbox", { name: "Lekérdezés" }).press(" ");
      await page
        .getByRole("textbox", { name: "Lekérdezés" })
        .press("Backspace");
      await page.getByText("JARMUVEK").click();
      await page
        .getByRole("row", { name: "Dinamikus gomb" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Dinamikus gomb" })
        .fill("docupdesc");
      await page.getByRole("textbox", { name: "Dinamikus gomb" }).press(" ");
      await page
        .getByRole("textbox", { name: "Dinamikus gomb" })
        .press("Backspace");
      await page.getByText("docupdesc").click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .locator('td[role="listitem"]:has-text("Client.DisableSaves")')
        .click();
      await page
        .getByRole("row", { name: "Alkalmazás" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Alkalmazás" })
        .fill("medalyse3app");
      await page.getByRole("textbox", { name: "Alkalmazás" }).press(" ");
      await page
        .getByRole("textbox", { name: "Alkalmazás" })
        .press("Backspace");
      await page.locator('span:has-text("medalyse3app")').click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Client.DisableExternalControls").click();
      await page
        .getByRole("row", { name: "Riport" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Riport" })
        .fill("KGERIC_GOMBOK_TESZT");
      await page.getByRole("textbox", { name: "Riport" }).press(" ");
      await page.getByRole("textbox", { name: "Riport" }).press("Backspace");
      await page
        .locator('td[role="listitem"]:has-text("KGERIC_GOMBOK_TESZT")')
        .click();
      await page
        .getByRole("row", { name: "Lekérdezés" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByRole("textbox", { name: "Lekérdezés" }).fill("EVDARAB");
      await page.getByRole("textbox", { name: "Lekérdezés" }).press(" ");
      await page
        .getByRole("textbox", { name: "Lekérdezés" })
        .press("Backspace");
      await page.getByText("EVDARAB").click();
      await page
        .getByRole("row", { name: "Dinamikus gomb" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("textbox", { name: "Dinamikus gomb" })
        .fill("floatingchart");
      await page.getByRole("textbox", { name: "Dinamikus gomb" }).press(" ");
      await page
        .getByRole("textbox", { name: "Dinamikus gomb" })
        .press("Backspace");
      await page.getByText("floatingchart").click();
      await pressbutton(page, " Hozzáad", 1);
      await page
        .getByRole("row", { name: "Jogosultság" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("Survey.EnableKampany").click();
      await page
        .getByRole("row", { name: "Kérdőív" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page
        .getByRole("row", { name: "COVID-19" })
        .locator('td[role="listitem"]:has-text("COVID-19")')
        .click();
      await page
        .getByRole("row", { name: "Kampány" })
        .getByRole("combobox")
        .locator("div")
        .click();
      await page.getByText("2020.04.28").click();
    } else test.skip();
  });

  test("csoport módosítása", async ({ page }) => {
    await page.getByRole("cell", { name: testname }).click();
    await page.getByRole("textbox", { name: "Információ" }).click();
    await page
      .getByRole("textbox", { name: "Információ" })
      .fill(datum() + " playwright teszt_edited");
    await pressbutton(page, " Mentés", 0);
    logger.log(testname + " leírás módosítva");
  });

  test("felhasználó hozzáadása a csoporthoz", async ({ page }) => {
    await page.getByRole("cell", { name: testname }).click();
    await page.locator("#gwt-uid-91").click();
    await page.locator("#gwt-uid-91").fill(user.name);
    await page.check("input[type=checkbox]:nth-child(1)");
    expect(
      await page.isChecked("input[type=checkbox]:nth-child(1)")
    ).toBeTruthy();
    await pressbutton(page, " Hozzáad", 0);
    logger.log(
      user.name + " felhasználó hozzáadva a " + testname + " csoporthoz"
    );
  });

  test("felhasználó eltávolítása a csoportból", async ({ page, }) => {
    await page.getByRole("cell", { name: testname }).click();
    await page.locator("#gwt-uid-91").click();
    await page.locator("#gwt-uid-91").fill(user.name);
    await page.check("input[type=checkbox]:nth-child(1)");
    expect(
      await page.isChecked("input[type=checkbox]:nth-child(1)")
    ).toBeTruthy();
    await removeitem(page, " Eltávolít");
    logger.log(user.name + " eltávolítva a " + testname + " csoportból");
  });

  test("csoport jogosultságainak törlése", async ({
    page,
  }) => {
    if (branch() == "gamma") {
      await page.getByRole("cell", { name: testname }).click();
      await page
        .locator(
          ".v-splitpanel-second-container > .v-splitpanel-horizontal > div > .v-splitpanel-second-container > div > div > div > .v-panel > .v-panel-content > .v-verticallayout > div > div > .v-grid > .v-grid-tablewrapper > table > .v-grid-header > .v-grid-row > th"
        )
        .first()
        .click();
      await removeitem(page, " Eltávolít", 1);
      logger.log(testname + " csoport jogosultságai törölve");
    } else test.skip();
  });

  test("csoport törlése", async ({ page }) => {
    await page.getByRole("cell", { name: testname }).click();
    await removeitem(page, " Törlés");
    logger.log(testname + " csoport törölve");
  });
  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});

test.describe.serial(misc.bulkcount + " csoportot érintő tesztek", () => {
  test(misc.bulkcount + " csoport létrehozása", async ({ page }) => {
    for (let index = 1; index < misc.bulkcount + 1; index++) {
      const randomname2 = testname + "_" + index;
      await pressbutton(page, " Új" , 0);
      await page.getByRole("textbox", { name: "Név" }).click();
      await page.getByRole("textbox", { name: "Név" }).fill(randomname2);
      await page.getByRole("textbox", { name: "Név" }).press("Tab");
      await page.getByRole("textbox", { name: "Információ" }).click();
      await page
        .getByRole("textbox", { name: "Információ" })
        .fill(datum() + " playwright teszt " + randomname2);
      await pressbutton(page, " Mentés", 0);
      logger.log(randomname2 + " csoport létrehozva");
      await page.getByRole("cell", { name: randomname2 }).click();
    }
  });

  test(misc.bulkcount + " csoport törlése", async ({ page }) => {
    for (let index = 1; index < misc.bulkcount + 1; index++) {
      const randomname2 = testname + "_" + index;
      await page.getByRole("cell", { name: randomname2 }).click();
      await removeitem(page, " Törlés");
      logger.log(randomname2 + " csoport törölve");
    }
  });
  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});
