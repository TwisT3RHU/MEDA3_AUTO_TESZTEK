import { test, expect } from "@playwright/test";

import { branch, hoptoserverusers, login, logout, medaurl, pressbutton, randomname, removeitem, scrollUntilVisible, textboxcheck } from "globalis";
import { misc, user } from "core.json";

const randname = randomname("_autoteszt");
const remotename = branch(true) + randname;
const servername = branch(false) + randname;
let jumpbranch: boolean = false;

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  if (jumpbranch) await login(page, true);
  else await login(page, false);
  //login(page, jumpbranch);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Szerverek").click();
  await expect(page).toHaveURL(medaurl(jumpbranch, "#!servers"));
});

test.describe.serial("szerverek összekötése", () => {
  test("új távoli szerver hozzáadása", async ({ page }) => {
    await pressbutton(page, " Új" , 0);
    const textboxes: string[][] = [
      ["Név", "Kimenő kapcsolat URL"],
      [remotename, medaurl(true, "remote")]
    ];
    for (let i= 0; i < textboxes[0].length; i++) {
      await textboxcheck(page, textboxes[0][i], textboxes[1][i]);
    };
    const kimenokod = await page.getByRole("textbox", { name: "Kimenő kapcsolat kód" }).inputValue();
    console.log(kimenokod + " kimenő kapcsolat kód tárolva")

    const context = page.context();
    const page2 = await context.newPage();
    await login(page2, true);

    await page2.getByText("►Hozzáférések").click();
    await page2.getByText("Szerverek").click();
    await expect(page2).toHaveURL(medaurl(true, "#!servers"));

    await page2.getByRole("button", { name: " Új" }).click();
    const textboxes2: string[][] = [
      ["Név", "Kimenő kapcsolat URL", "Bejövő kapcsolat kód"],
      [servername, medaurl(false, "local"), kimenokod]
    ];
    for (let i= 0; i < textboxes2[0].length; i++) {
      await textboxcheck(page2, textboxes2[0][i], textboxes2[1][i]);
    };
    const bejovokod = await page2.getByRole("textbox", { name: "Kimenő kapcsolat kód" }).inputValue();
    console.log(bejovokod + " bejövő kapcsolat kód tárolva")

    await textboxcheck(page, "Bejövő kapcsolat kód", bejovokod);

    await pressbutton(page, " Mentés", 0);
    await pressbutton(page2, " Mentés", 0);
  });
  test.describe.serial("szerverek felhasználói", () => {
    test.describe.serial(misc.branch + " szerver felhasználója", () => {
      test(misc.branch + " új távoli felhasználó hozzáadása", async ({ page }) => {
        hoptoserverusers(page, remotename);
        await page.getByRole('row', { name: 'Név Teljes név' }).getByRole('cell', { name: 'Név' }).getByText('Név').click({ delay: 1000 }); 
        await page.getByRole("cell", { name: user.name }).first().click(); //??? miért nem klikkelsz?
        await pressbutton(page,  " Hozzáad", 0);
      });
      test(misc.branch + " felhasználó hozzáadása a " + user.usergroup + " csoporthoz", async ({ page }) => {
        hoptoserverusers(page, remotename);
        await page
          .getByRole("row", { name: remotename + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        const autocsop = page.getByRole("row", { name: user.usergroup }).getByLabel("");
        await scrollUntilVisible(page, "Név", 3, autocsop);
        await autocsop.check(); // scrolluntilvisible
        await pressbutton(page,  " Hozzáad", 1);
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
        await pressbutton(page,  " Eltávolít", 1);
        await pressbutton(page,  " Eltávolít", 0);
        jumpbranch = true;
      });
    });
    test.describe.serial(misc.branch_remote + " szerver felhasználója", () => {
      test(misc.branch_remote + " új távoli felhasználó hozzáadása", async ({ page }) => {
        hoptoserverusers(page, servername);
        await page.getByRole('row', { name: 'Név Teljes név' }).getByRole('cell', { name: 'Név' }).getByText('Név').click({ delay: 1000 }); 
        await page.getByRole("cell", { name: user.name }).first().click();
        await pressbutton(page,  " Hozzáad", 0);
      });
      test(misc.branch_remote + " felhasználó hozzáadása a " + user.usergroup + " csoporthoz", async ({ page }) => {
        hoptoserverusers(page, servername);
        await page
          .getByRole("row", { name: servername + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        const autocsop = page.getByRole("row", { name: user.usergroup }).getByLabel("");
        await scrollUntilVisible(page, "Név", 3, autocsop);
        await autocsop.check(); // scrolluntilvisible
        await pressbutton(page,  " Hozzáad", 1);
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
        await pressbutton(page,  " Eltávolít", 1);
        await pressbutton(page,  " Eltávolít", 0);
        jumpbranch = false;
      });
    });
    test.describe.serial("szerverek törlése", () => {
      test(misc.branch + " távoli szerver törlése + megerősítő ablak", async ({ page }) => {
        await page.getByRole("cell", { name: remotename }).click();
        await removeitem(page, " Törlés");
        jumpbranch = true;
      });
      test(misc.branch_remote + " távoli szerver törlése + megerősítő ablak", async ({ page }) => {
        await page.getByRole("cell", { name: servername }).click();
        await removeitem(page, " Törlés");
        jumpbranch = false;
        await logout(page);
      });
    });
  });
});
