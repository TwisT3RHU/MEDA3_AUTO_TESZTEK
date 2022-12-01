import { test, expect } from "@playwright/test";

import { login, medaurl } from "../globalis";

test("szimpla login/logout", async ({ page }) => {
    login(page);
    await expect(page).toHaveURL(medaurl(false));
    await page.locator('span:has-text("kilépés")').first().click();
});