import { expect, test } from "@playwright/test";

import { login, logout, selectApp } from "globalis";
import { setTimeout } from "timers/promises";

test.beforeEach(async ({ page }) => {
    await login(page);
    await selectApp(page, "Medalyse3 App", "medalyse3app");
});
  
test.describe.serial("témát érintő teszt", () => {
    test('sötét téma', async ({ page }) => {
        await page.locator('button:has-text("settings")').click();
        const menuszin = page.locator('#mat-slide-toggle-2 > .mat-slide-toggle-label > .mat-slide-toggle-bar');

        await menuszin.click();
        await setTimeout(1000);
        const sidebar = page.locator('.mat-slide-toggle-bar').first();
        let color = await sidebar.evaluate((e) => { return window.getComputedStyle(e).getPropertyValue("background-color") });
        expect(color).toBe("rgb(27, 106, 61)");
        console.log(color); // dark szín

        await menuszin.click();
        await setTimeout(1000);
        color = await sidebar.evaluate((e) => { return window.getComputedStyle(e).getPropertyValue("background-color") });
        expect(color).toBe("rgb(37, 85, 133)");
        console.log(color); // világos szín

        await page.keyboard.press("Escape");
    });
    test.afterEach(async ({ page }) => {
        await logout(page);
    });
});