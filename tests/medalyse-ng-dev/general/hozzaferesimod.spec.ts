import { test, expect } from "@playwright/test";
import *  as testfunc from 'globalis';

const verziok: string[][] = [
    ["Alapértelmezett mód", "Tudományos mód", "Haladó mód", "Info mód"],
    ["MENUVERZIO2", "MENUTUDOMANYOSVERZIO", "MENUADVANCEDVERZIO", "MENUINFOVERZIO"],
    ["default", "scientific", "advanced", "info"]
];

test.beforeEach(async ({ page }) => {
    await testfunc.login(page);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
    await page.getByText('double_arrowFőmenü expand_more').click();
    await testfunc.pressbutton(page, "riportverziok", 0, "link");
});
  
test.describe.serial("hozzáférési módokat érintő tesztek", () => {
    test('hozzáférési módok', async ({ page }) => {
        for (let i= 0; i < verziok[0].length; i++) {
            await testfunc.chooseAccessibilityMode(page, verziok[0][i]);
            await testfunc.pressbutton(page, "riportverziok", 0, "link");
            await expect(page).toHaveURL(RegExp(verziok[2][i]));
            await testfunc.textcheck(page, verziok[1][i], 2);
        };
    });
    test('riport hozzáférési módok', async ({ page }) => {
        for (let i= 0; i < verziok[0].length; i++) {
            await testfunc.chooseReportAccMode(page, verziok[0][i]);
            await expect(page).toHaveURL(RegExp(verziok[2][i]));
            await testfunc.textcheck(page, verziok[1][i], 2);
        };
    });
    test('riport verzió', async ({ page }) => {
        await page.getByText('historyMENUVERZIO2').click();
        await testfunc.pressbutton(page, "menuverzio1", 0, "menuitem");
        const verzio1 = page.getByRole('cell', { name: 'menuverzio1' }).getByText('menuverzio1');
        await expect(verzio1).toBeVisible();
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page);
    });
});