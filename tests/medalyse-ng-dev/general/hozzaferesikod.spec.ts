import { test } from "@playwright/test";
import * as core from "core.json";
import * as testfunc from 'globalis';

const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });
let datum = new Date();
let ev = datum.getFullYear();
let honap = formatter.format(datum);
let honapszam = datum.getMonth() + 1; //zero-based érték
let day = datum.getDate();
let day2 = day + 2;
let napelenulla = day.toString();
let napelenulla2 = day2.toString();
if (napelenulla.length < 2) napelenulla = "0" + day;
if (napelenulla2.length < 2) napelenulla2 = "0" + day2;
let honapnulla = honapszam.toString();
if (honapnulla.length < 2) honapnulla = "0" + honapszam;
const elsodatum = ev + "-" + honapnulla + "-" + napelenulla2 + " 23:59";
const masodikdatum = ev + "-" + honapnulla + "-" + napelenulla + " 00:00";
console.log(datum + " év " + ev + " hónap " + honap + " napok " + day + " - " + day2); // dátum formázása, nem a legjobb megoldás, DE egyelőre jó lesz

test.beforeEach(async ({ page }) => {
    await testfunc.login(page);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
});
  
test.describe.serial("hozzáférési kódot érintő teszt", () => {
    test('hozzáférési kód generálása', async ({ page }) => {
        await page.locator('button:has-text("security")').click();
        await testfunc.pressbutton(page, "Hozzáférési kódok", 0, "menuitem");
        await testfunc.pressbutton(page, "Felhasználói csoportok", 0, "combobox");
        await page.getByText(core.user.usergroup).click();
        await page.locator('.cdk-overlay-backdrop').click();
        await testfunc.pressbutton(page, "Open calendar");
        await testfunc.pressbutton(page, honap + " " + day + ", " + ev);
        await testfunc.pressbutton(page, honap + " " + day2 + ", " + ev);
        await testfunc.pressbutton(page, "Hozzáférési kód generálása");
        await testfunc.pressbutton(page, core.user.usergroup, 0, "cell");
        //await page.getByRole('cell', { name: core.user.usergroup, exact: true }).click();
        await testfunc.pressbutton(page, elsodatum, 0, "cell");
        await testfunc.pressbutton(page, masodikdatum, 0, "cell");
        await testfunc.removeitem(page, "not needed...", 0, 2);
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page);
    });
});