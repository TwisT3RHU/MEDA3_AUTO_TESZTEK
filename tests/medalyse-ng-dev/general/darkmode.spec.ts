import { expect, test } from "@playwright/test";

import { logger, login, logout, selectApp } from "globalis";
import { setTimeout } from "timers/promises";

test.beforeEach(async ({ page }) => {
    await login(page);
    await selectApp(page, "Medalyse3 App", "medalyse3app");
});
  
test.describe.serial("témát érintő teszt", () => {
    test('sötét téma', async ({ page }) => {
        await page.locator('button:has-text("settings")').click();
        const sidebar = page.locator('#mat-slide-toggle-2 > .mat-slide-toggle-label > .mat-slide-toggle-bar');

        await expect(sidebar).toBeEnabled();
        await sidebar.click();
        await setTimeout(1000);
        const menuszin = page.locator('.mat-slide-toggle-bar').first();
        let color = await menuszin.evaluate((e) => { return window.getComputedStyle(e).getPropertyValue("background-color") });
        expect(color).toBe("rgb(27, 106, 61)");
        logger.log(color); // dark szín

        await expect(sidebar).toBeEnabled();
        await sidebar.click();
        await setTimeout(1000);
        color = await menuszin.evaluate((e) => { return window.getComputedStyle(e).getPropertyValue("background-color") });
        expect(color).toBe("rgb(37, 85, 133)");
        logger.log(color); // világos szín

        await page.keyboard.press("Escape");
    });
    test.afterEach(async ({ page }) => {
        await logout(page);
    });
});