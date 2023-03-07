import { test } from "@playwright/test";
import * as testfunc from 'globalis';
import * as core from 'core.json';

const username = core.user.testname;
let email = core.user.testemail;
let password = core.user.testpass;

test.beforeEach(async ({ page }) => {
    await testfunc.login(page, username, password);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
    await testfunc.pressbutton(page, "avatar" + username);
    await testfunc.pressbutton(page, "Adatváltoztatás", 0, "menuitem");
});
  
test.describe.serial("adatmódosítást érintő tesztek", () => {
    test('e-mail módosítása', async ({ page }) => {
        await page.getByLabel('Email *').click();
        email = email + "a";
        await page.getByLabel('Email *').fill(email);
        await testfunc.pressbutton(page, "Mentés");
        console.log("e-mail módosítva");
    });
    test('nyelv módosítása', async ({ page }) => {
        await testfunc.pressbutton(page, "country", 0, "combobox");
        await page.getByText('English').click();
        await testfunc.pressbutton(page, "Mentés");
        console.log("nyelv módosítva");
    });
    test('jelszó ellenőrzése, módosítása', async ({ page }) => {
        await page.getByLabel('Régi jelszó *').fill(password + "b");
        await page.locator('div').filter({ hasText: 'Új jelszó *' }).nth(4).click();
        await page.getByLabel('Új jelszó *').fill(password);
        await page.getByLabel('Új jelszó mégegyszer *').fill(password);

        await testfunc.pressbutton(page, "Jelszó változtatás");
        await page.getByText('Could not modify user ['+ username +'] password! Current password is invalid!').click();
        await testfunc.pressbutton(page, "Rendben");
       
        await page.getByLabel('Régi jelszó *').fill(password);
        password = password + "a"; // újabb loginnál is ezt fogja bemásolni a teszt közben!
        await page.getByLabel('Új jelszó *').fill(password);
        await page.getByLabel('Új jelszó mégegyszer *').fill(password);
        await testfunc.pressbutton(page, "Jelszó változtatás");
        await page.getByText('Jelszó módosítva').click();

        await testfunc.pressbutton(page, "Rendben");
        console.log("jelszó módosítva");
    });
    test('jelszó visszaállítása', async ({ page }) => {
        await page.getByLabel('Régi jelszó *').fill(password);
        password = core.user.testpass; // itt áll vissza az eredeti jelszó!
        await page.locator('div').filter({ hasText: 'Új jelszó *' }).nth(4).click();
        await page.getByLabel('Új jelszó *').fill(password);
        await page.getByLabel('Új jelszó mégegyszer *').fill(password);
        await testfunc.pressbutton(page, "Jelszó változtatás");
        await page.getByText('Jelszó módosítva').click();
        await testfunc.pressbutton(page, "Rendben");
        console.log("jelszó visszaállítva");
    });
    test('e-mail visszaállítása', async ({ page }) => {
        email = core.user.testemail;
        await page.getByLabel('Email *').click();
        await page.getByLabel('Email *').fill(email);
        await testfunc.pressbutton(page, "Mentés");
        console.log("e-mail visszaállítva");
    });
    test('nyelv visszaállítása', async ({ page }) => {
        await testfunc.pressbutton(page, "country", 0, "combobox");
        //await page.getByRole('combobox', { name: 'country', exact: true }).click();
        await page.getByText('Magyar').click();
        await testfunc.pressbutton(page, "Mentés");
        console.log("nyelv visszaállítva");
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page, username);
    });
});