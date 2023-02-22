import { test } from "@playwright/test";
import *  as testfunc from 'globalis';
//import { login, logout, selectApp } from "globalis";

test("szimpla login/logout", async ({ page }) => {
    await testfunc.login(page);
    await testfunc.selectApp(page, "Medalyse3 App", "medalyse3app");
    await testfunc.logout(page);
});