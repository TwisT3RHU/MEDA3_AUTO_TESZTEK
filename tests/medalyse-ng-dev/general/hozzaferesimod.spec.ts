import { expect, test } from "@playwright/test";
//import { logger, login, logout, selectApp } from "globalis";
import *  as testfunc from 'globalis';

const verziok: string[][] = [
    ["Alapértelmezett mód", "Tudományos mód", "Haladó mód", "Info mód"],
    ["MENUVERZIO2", "MENUTUDOMANYOSVERZIO", "MENUADVANCEDVERZIO", "MENUINFOVERZIO"]
];

test.beforeEach(async ({ page }) => {
    await testfunc.login(page);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
});
  
test.describe.serial("hozzáférési módokat érintő tesztek", () => {
    test('hozzáférési módok', async ({ page }) => {
        await page.getByText('double_arrowFőmenü expand_more').click();
        await page.getByRole('link', { name: 'riportverziok' }).click();
        for (let i= 0; i < verziok[0].length; i++) {
            await testfunc.chooseAccessibilityMode(page, verziok[0][i]);
            await page.getByRole('link', { name: 'riportverziok', exact: true }).click();
            await testfunc.textcheck(page, verziok[1][i], 2);
        };
    });
    test('riport verziók', async ({ page }) => {
        await page.getByText('double_arrowFőmenü expand_more').click();
        await page.getByRole('link', { name: 'riportverziok', exact: true }).click();
        for (let i= 0; i < verziok[0].length; i++) {
            await testfunc.chooseReportVersion(page, verziok[0][i]);
            await testfunc.textcheck(page, verziok[1][i], 2);
        };
    });
    test.afterEach(async ({ page }) => {
        await testfunc.logout(page);
    });
});