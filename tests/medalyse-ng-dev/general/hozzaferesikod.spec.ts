import { test } from "@playwright/test";
import * as core from "core.json";
import * as testfunc from 'globalis';

const formatter = new Intl.DateTimeFormat('en-us', { month: 'long' });
let datum = new Date();
//let datum = new Date("March 29 2023 13:37:11");
let kovihonap = new Date(datum.getFullYear(), datum.getMonth() + 1, 1);
let ev = datum.getFullYear();
let honap = formatter.format(datum);
let honapszam = datum.getMonth() + 1; //zero-based érték
let day = datum.getDate();
let day2 = day + 2;

let nextmonthswitch: boolean = false;

if (honapszam == 2)
{
    if (ev % 4 == 0)
    {
        if (day2 > 29)
        {
            if (day2 == 30) day2 = 1;
            else if (day2 == 31) day2 = 2;
            nextmonthswitch = true;
        }
    }
    else if (day2 > 28)
    {
        if (day2 == 29) day2 = 1;
        else if (day2 == 30) day2 = 2;
        nextmonthswitch = true;
    }
}
else if (honapszam == 4 || honapszam == 6 || honapszam == 9 || honapszam == 11)
{
    if (day2 > 30)
        {
            if (day2 == 31) day2 = 1;
            else if (day2 == 32) day2 = 2;
            nextmonthswitch = true;
        }
}
else
{
    if (day2 > 31)
        {
            if (day2 == 32) day2 = 1;
            else if (day2 == 33) day2 = 2;
            nextmonthswitch = true;
        }
}

let napelenulla = day.toString();
let napelenulla2 = day2.toString();
if (napelenulla.length < 2) napelenulla = "0" + day;
if (napelenulla2.length < 2) napelenulla2 = "0" + day2;
let honapnulla = honapszam.toString();
if (honapnulla.length < 2) honapnulla = "0" + honapszam;
/*const elsodatum = ev + "-" + honapnulla + "-" + napelenulla2 + " 23:59";
const masodikdatum = ev + "-" + honapnulla + "-" + napelenulla + " 00:00";
console.log(elsodatum + " - " + masodikdatum);
console.log(datum + " év " + ev + " hónap " + honap + " napok " + day + " - " + day2); // dátum formázása, nem a legjobb megoldás, DE egyelőre jó lesz*/

const accessrole = "healthware-medalyse3app-user"
let hozzaferes: string = undefined; // lentebb töltve lesz
const firstname: string = testfunc.randomname("first");
const lastname: string = testfunc.randomname("last");
const email: string = testfunc.randomname("access") + "@co.de";
const user: string = testfunc.randomname("accesscode");
const pass: string = "accesspw";

/*test.beforeEach(async ({ page }) => {
});*/
  
test.describe.serial("hozzáférési kódot érintő teszt", () => {
    test('hozzáférési kód generálása', async ({ page }) => {
        await testfunc.login(page);
        await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");

        await testfunc.pressbutton(page, 'button:has-text("security")', 0, "locator");
        await testfunc.pressbutton(page, "Hozzáférési kódok", 0, "menuitem");
        await testfunc.pressbutton(page, "Felhasználói csoportok", 0, "combobox");
        await testfunc.pressbutton(page, accessrole, 0, "text");
        await testfunc.pressbutton(page, '.cdk-overlay-backdrop', 0, "locator");
        await testfunc.pressbutton(page, "Open calendar");
        await testfunc.pressbutton(page, honap + " " + day + ", " + ev);
        if (nextmonthswitch)
        {
            await testfunc.pressbutton(page, "Next month");
            honap = formatter.format(kovihonap);
            if (formatter.format(kovihonap) == "January") ev = ev + 1;
        }
        await testfunc.pressbutton(page, honap + " " + day2 + ", " + ev);
        await testfunc.pressbutton(page, "Hozzáférési kód generálása");
        await testfunc.pressbutton(page, accessrole, 0, "cell");
        hozzaferes = await page.getByRole('cell', { name: /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/g, exact: true }).innerText();
    });
    test('új felhasználó regisztrálása a megadott kóddal', async ({ page }) => {
        await testfunc.register(page, false, firstname, lastname, email, user, pass, hozzaferes);
    });
    test('hozzáférési kód törlése', async ({ page }) => {
        await testfunc.login(page);
        await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");

        await testfunc.pressbutton(page, 'button:has-text("security")', 0, "locator");
        await testfunc.pressbutton(page, "Hozzáférési kódok", 0, "menuitem");
        await testfunc.removeitem(page, "", 0, 2);
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page);
    });
});