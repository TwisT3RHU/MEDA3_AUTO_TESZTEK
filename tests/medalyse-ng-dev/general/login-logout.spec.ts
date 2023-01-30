import { test } from "@playwright/test";

import { login, logout, selectApp } from "globalis";

test("szimpla login/logout", async ({ page }) => {
    await login(page);
    await selectApp(page, "Medalyse3 App", "medalyse3app");
    await logout(page);
});