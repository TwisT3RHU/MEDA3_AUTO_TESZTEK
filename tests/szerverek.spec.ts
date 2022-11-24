import { test, expect } from "@playwright/test";

import { branch, hoptoserverusers, login, medaurl, randomname } from "./globalis";
import { misc, user } from "./core.json";

const randname = randomname("_autoteszt");
const remotename = branch(true) + randname;
const servername = branch(false) + randname;
let jumpbranch: boolean = false;

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  if (jumpbranch) login(page, true);
  else login(page, false);
  //login(page, jumpbranch);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Szerverek").click();
  await expect(page).toHaveURL(medaurl(jumpbranch, "#!servers"));
});

test.afterEach(async ({ page }) => {
  //await page.locator('span:has-text("kilépés")').first().click();
});
test.describe.serial("szerverek összekötése", () => {
  test("új távoli szerver hozzáadása", async ({ page }) => {
    await page.getByRole("button", { name: " Új" }).click();
    await page.getByRole("textbox", { name: "Név" }).click();
    await page.getByRole("textbox", { name: "Név" }).fill(remotename);
    await page.getByRole("textbox", { name: "Kimenő kapcsolat URL" }).click();
    await page
      .getByRole("textbox", { name: "Kimenő kapcsolat URL" })
      .fill(medaurl(true, "remote"));
    let kimenokod = await page
      .getByRole("textbox", { name: "Kimenő kapcsolat kód" })
      .inputValue();

    const context = page.context();
    const page2 = await context.newPage();
    await login(page2, true);

    await page2.getByText("►Hozzáférések").click();
    await page2.getByText("Szerverek").click();
    await expect(page2).toHaveURL(medaurl(true, "#!servers"));

    await page2.getByRole("button", { name: " Új" }).click();
    await page2.getByRole("textbox", { name: "Név" }).click();
    await page2.getByRole("textbox", { name: "Név" }).fill(servername);
    await page2.getByRole("textbox", { name: "Kimenő kapcsolat URL" }).click();
    await page2
      .getByRole("textbox", { name: "Kimenő kapcsolat URL" })
      .fill(medaurl(false, "local"));
    await page2
      .getByRole("textbox", { name: "Bejövő kapcsolat kód" })
      .fill(kimenokod);
    let bejovokod = await page2
      .getByRole("textbox", { name: "Kimenő kapcsolat kód" })
      .inputValue();

    await page
      .getByRole("textbox", { name: "Bejövő kapcsolat kód" })
      .fill(bejovokod);

    await page.getByRole("button", { name: " Mentés" }).click();
    await page2.getByRole("button", { name: " Mentés" }).click();
  });
  test.describe.serial("szerverek felhasználói", () => {
    test.describe.serial(misc.branch + " szerver felhasználója", () => {
      test(misc.branch + " új távoli felhasználó hozzáadása", async ({ page }) => {
        hoptoserverusers(page, remotename);
        await page.getByRole("cell", { name: user.name }).first().click();
        await page.getByRole("button", { name: " Hozzáad" }).first().click();
      });
      test(misc.branch + " felhasználó hozzáadása a " + user.usergroup + " csoporthoz", async ({ page }) => {
        hoptoserverusers(page, remotename);
        await page
          .getByRole("row", { name: remotename + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        await page
          .getByRole("row", { name: user.usergroup })
          .getByLabel("")
          .check();
        await page.getByRole("button", { name: " Hozzáad" }).nth(1).click();
      });
      test(misc.branch + " távoli felhasználó és csoportjának törlése", async ({ page }) => {
        hoptoserverusers(page, remotename);
        await page
          .getByRole("row", { name: remotename + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        await page
          .locator('table:has-text("Név' + user.usergroup + '")')
          .getByRole("cell")
          .nth(2)
          .click();
        await page
          .getByRole("button", { name: " Eltávolít" })
          .nth(1)
          .click();
        await page
          .getByRole("button", { name: " Eltávolít" })
          .first()
          .click();
        jumpbranch = true;
      });
    });
    test.describe.serial(misc.branch_remote + " szerver felhasználója", () => {
      test(misc.branch_remote + " új távoli felhasználó hozzáadása", async ({ page }) => {
        hoptoserverusers(page, servername);
        await page.getByRole("cell", { name: user.name }).first().click();
        await page.getByRole("button", { name: " Hozzáad" }).first().click();
      });
      test(misc.branch_remote + " felhasználó hozzáadása a " + user.usergroup + " csoporthoz", async ({ page }) => {
        hoptoserverusers(page, servername);
        await page
          .getByRole("row", { name: servername + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        await page
          .getByRole("row", { name: user.usergroup })
          .getByLabel("")
          .check();
        await page.getByRole("button", { name: " Hozzáad" }).nth(1).click();
      });
      test(misc.branch_remote + " távoli felhasználó és csoportjának törlése", async ({ page }) => {
        hoptoserverusers(page, servername);
        await page
          .getByRole("row", { name: servername + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        await page
          .locator('table:has-text("Név' + user.usergroup + '")')
          .getByRole("cell")
          .nth(2)
          .click();
        await page
          .getByRole("button", { name: " Eltávolít" })
          .nth(1)
          .click();
        await page
          .getByRole("button", { name: " Eltávolít" })
          .first()
          .click();
        jumpbranch = false;
      });
    });
    test.describe.serial("szerverek törlése", () => {
      test(misc.branch + " távoli szerver törlése + megerősítő ablak", async ({ page }) => {
        await page.getByRole("cell", { name: remotename }).click();
        await page.getByRole("button", { name: " Törlés" }).click();
        await page.getByRole("button", { name: "Nem" }).click();
        await page.getByRole("button", { name: " Törlés" }).click();
        await page.getByRole("button", { name: "Igen" }).click();
        jumpbranch = true;
      });
      test(misc.branch_remote + " távoli szerver törlése + megerősítő ablak", async ({ page }) => {
        await page.getByRole("cell", { name: servername }).click();
        await page.getByRole("button", { name: " Törlés" }).click();
        await page.getByRole("button", { name: "Nem" }).click();
        await page.getByRole("button", { name: " Törlés" }).click();
        await page.getByRole("button", { name: "Igen" }).click();
        jumpbranch = false;
      });
    });
  });
});