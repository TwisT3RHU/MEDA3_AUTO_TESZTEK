import { test } from "@playwright/test";

import { login, logout } from "globalis";

test("szimpla login/logout", async ({ page }) => {
    await login(page);
    //await expect(page).toHaveURL(medaurl(false));
    await logout(page);
});