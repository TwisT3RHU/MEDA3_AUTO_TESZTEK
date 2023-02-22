import { test } from "@playwright/test";
import { user } from "core.json";
import *  as testfunc from 'globalis';
//import { logger, login, logout, pressbutton, removeitem, selectApp } from "globalis";

test.beforeEach(async ({ page }) => {
    await testfunc.login(page);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
});
  
test.describe.serial("hozzáférési kódot érintő teszt", () => {
    test('hozzáférési kód generálása', async ({ page }) => {
        const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });
        let datum = new Date();
        let ev = datum.getFullYear();
        let honap = formatter.format(datum);
        let honapszam = datum.getMonth() + 1; //zero-based érték
        let day = datum.getDate();
        let day2 = day + 2;
        testfunc.logger.log(datum + " év " + ev + " hónap " + honap + " napok " + day + " - " + day2); // dátum formázása, future-proofing

        await page.locator('button:has-text("security")').click();
        await testfunc.pressbutton(page, "Hozzáférési kódok", 0, "menuitem");
        await page.getByRole('combobox', { name: 'Felhasználói csoportok' }).locator('div').nth(3).click();
        await page.getByText(user.usergroup).click();
        await page.locator('.cdk-overlay-backdrop').click();
        await testfunc.pressbutton(page, "Open calendar");
        await testfunc.pressbutton(page, honap + " " + day + ", " + ev);
        await testfunc.pressbutton(page, honap + " " + day2 + ", " + ev);
        await testfunc.pressbutton(page, "Hozzáférési kód generálása");
        await page.getByRole('cell', { name: user.usergroup }).click();
        let napelenulla = day.toString();
        let napelenulla2 = day2.toString();
        if (napelenulla.length < 2) napelenulla = "0" + day;
        if (napelenulla2.length < 2) napelenulla2 = "0" + day2;
        let honapnulla = honapszam.toString();
        if (honapnulla.length < 2) honapnulla = "0" + honapszam;
        await page.getByRole('cell', { name: ev + "-" + honapnulla + "-" + napelenulla2 + " 23:59" }).click();
        await page.getByRole('cell', { name: ev + "-" + honapnulla + "-" + napelenulla + " 00:00" }).click();
        //await page.getByRole('cell', { name: '47a1d84b-f9bd-491b-879d-d20aec94d351' }).click();
        await testfunc.removeitem(page, "not needed...", 0, 2);
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page);
    });
});