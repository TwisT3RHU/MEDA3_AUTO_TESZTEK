import { test, expect } from "@playwright/test";
import *  as testfunc from 'globalis';

const appok: string[] = ["Kérdőív", "Uj app 0805", "Medalyse3 App"];

test.beforeEach(async ({ page }) => {
    await testfunc.login(page);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
});
  
test.describe.serial("alkalmazás váltásokat érintő tesztek", () => {
    test('alkalmazások váltása', async ({ page }) => {
        for (let i= 0; i < appok.length; i++) {
            await testfunc.pressbutton(page, "apps", 0, "button", true);
            await testfunc.pressbutton(page, appok[i], 0, "menuitem");
            await expect(page).toHaveTitle(appok[i]);
        };
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page);
    });
});