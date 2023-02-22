import { expect, test } from "@playwright/test";
import *  as testfunc from 'globalis';
//import { login, logout, pressbutton, selectApp } from "globalis";

test.beforeEach(async ({ page }) => {
    await testfunc.login(page);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
});
  
test.describe.serial("névjegyet érintő teszt", () => {
    test('névjegy megtekintése', async ({ page }) => {
        await page.locator('button:has-text("settings")').click();

        await testfunc.pressbutton(page, "Névjegy", 0, "menuitem");

        const header = page.getByRole('heading', { name: 'Névjegy' });
        await expect(header).toBeVisible();

        await page.keyboard.press("Escape");
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page);
    });
});