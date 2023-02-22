import { test, expect } from "@playwright/test";
import *  as testfunc from 'globalis';
//import { branch, hoptoserverusers, logger, login, logout, medaurl, pressbutton, randomname, removeitem, scrollUntilVisible, textboxcheck } from "globalis";
import { misc, user } from "core.json";

const randname = testfunc.randomname("_autoteszt");
const remotename = testfunc.branch(true) + randname;
const servername = testfunc.branch(false) + randname;
let jumpbranch: boolean = false;

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  if (jumpbranch) await testfunc.login(page, true);
  else await testfunc.login(page, false);
  //testfunc.login(page, jumpbranch);
  await page.getByText("►Hozzáférések").click();
  await page.getByText("Szerverek").click();
  await expect(page).toHaveURL(testfunc.medaurl(jumpbranch, "#!servers"));
});

test.describe.serial("szerverek összekötése", () => {
  test("új távoli szerver hozzáadása", async ({ page }) => {
    await testfunc.pressbutton(page, " Új" , 0);
    const textboxes: string[][] = [
      ["Név", "Kimenő kapcsolat URL"],
      [remotename, testfunc.medaurl(true, "remote")]
    ];
    for (let i= 0; i < textboxes[0].length; i++) {
      await testfunc.textboxcheck(page, textboxes[0][i], textboxes[1][i]);
    };
    const kimenokod = await page.getByRole("textbox", { name: "Kimenő kapcsolat kód" }).inputValue();
    testfunc.logger.log(kimenokod + " kimenő kapcsolat kód tárolva")

    const context = page.context();
    const page2 = await context.newPage();
    await testfunc.login(page2, true);

    await page2.getByText("►Hozzáférések").click();
    await page2.getByText("Szerverek").click();
    await expect(page2).toHaveURL(testfunc.medaurl(true, "#!servers"));

    await page2.getByRole("button", { name: " Új" }).click();
    const textboxes2: string[][] = [
      ["Név", "Kimenő kapcsolat URL", "Bejövő kapcsolat kód"],
      [servername, testfunc.medaurl(false, "local"), kimenokod]
    ];
    for (let i= 0; i < textboxes2[0].length; i++) {
      await testfunc.textboxcheck(page2, textboxes2[0][i], textboxes2[1][i]);
    };
    const bejovokod = await page2.getByRole("textbox", { name: "Kimenő kapcsolat kód" }).inputValue();
    testfunc.logger.log(bejovokod + " bejövő kapcsolat kód tárolva")

    await testfunc.textboxcheck(page, "Bejövő kapcsolat kód", bejovokod);

    await testfunc.pressbutton(page, " Mentés", 0);
    await testfunc.pressbutton(page2, " Mentés", 0);
  });
  test.describe.serial("szerverek felhasználói", () => {
    test.describe.serial(misc.branch + " szerver felhasználója", () => {
      test(misc.branch + " új távoli felhasználó hozzáadása", async ({ page }) => {
        testfunc.hoptoserverusers(page, remotename);
        await page.getByRole('row', { name: 'Név Teljes név' }).getByRole('cell', { name: 'Név' }).getByText('Név').click({ delay: 1000 }); 
        await page.getByRole("cell", { name: user.name }).first().click(); //??? miért nem klikkelsz?
        await testfunc.pressbutton(page,  " Hozzáad", 0);
      });
      test(misc.branch + " felhasználó hozzáadása a " + user.usergroup + " csoporthoz", async ({ page }) => {
        testfunc.hoptoserverusers(page, remotename);
        await page
          .getByRole("row", { name: remotename + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        const autocsop = page.getByRole("row", { name: user.usergroup }).getByLabel("");
        await testfunc.scrollUntilVisible(page, "Név", 3, autocsop);
        await autocsop.check(); // scrolluntilvisible
        await testfunc.pressbutton(page,  " Hozzáad", 1);
      });
      test(misc.branch + " távoli felhasználó és csoportjának törlése", async ({ page }) => {
        testfunc.hoptoserverusers(page, remotename);
        await page
          .getByRole("row", { name: remotename + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        await page
          .locator('table:has-text("Név' + user.usergroup + '")')
          .getByRole("cell")
          .nth(2)
          .click();
        await testfunc.pressbutton(page,  " Eltávolít", 1);
        await testfunc.pressbutton(page,  " Eltávolít", 0);
        jumpbranch = true;
      });
    });
    test.describe.serial(misc.branch_remote + " szerver felhasználója", () => {
      test(misc.branch_remote + " új távoli felhasználó hozzáadása", async ({ page }) => {
        testfunc.hoptoserverusers(page, servername);
        await page.getByRole('row', { name: 'Név Teljes név' }).getByRole('cell', { name: 'Név' }).getByText('Név').click({ delay: 1000 }); 
        await page.getByRole("cell", { name: user.name }).first().click();
        await testfunc.pressbutton(page,  " Hozzáad", 0);
      });
      test(misc.branch_remote + " felhasználó hozzáadása a " + user.usergroup + " csoporthoz", async ({ page }) => {
        testfunc.hoptoserverusers(page, servername);
        await page
          .getByRole("row", { name: servername + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        const autocsop = page.getByRole("row", { name: user.usergroup }).getByLabel("");
        await testfunc.scrollUntilVisible(page, "Név", 3, autocsop);
        await autocsop.check(); // scrolluntilvisible
        await testfunc.pressbutton(page,  " Hozzáad", 1);
      });
      test(misc.branch_remote + " távoli felhasználó és csoportjának törlése", async ({ page }) => {
        testfunc.hoptoserverusers(page, servername);
        await page
          .getByRole("row", { name: servername + " " + user.name })
          .getByRole("cell", { name: user.name })
          .click();
        await page
          .locator('table:has-text("Név' + user.usergroup + '")')
          .getByRole("cell")
          .nth(2)
          .click();
        await testfunc.pressbutton(page,  " Eltávolít", 1);
        await testfunc.pressbutton(page,  " Eltávolít", 0);
        jumpbranch = false;
      });
    });
    test.describe.serial("szerverek törlése", () => {
      test(misc.branch + " távoli szerver törlése", async ({ page }) => {
        await page.getByRole("cell", { name: remotename }).click();
        await testfunc.removeitem(page, " Törlés");
        jumpbranch = true;
      });
      test(misc.branch_remote + " távoli szerver törlése", async ({ page }) => {
        await page.getByRole("cell", { name: servername }).click();
        await testfunc.removeitem(page, " Törlés");
        jumpbranch = false;
        await testfunc.logout(page);
      });
    });
  });
});
