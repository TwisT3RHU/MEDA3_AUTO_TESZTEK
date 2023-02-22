import { test } from "@playwright/test";
import *  as testfunc from 'globalis';
//import { login, logout } from "globalis";

test("szimpla login/logout", async ({ page }) => {
    await testfunc.login(page);
    //await expect(page).toHaveURL(testfunc.medaurl(false));
    await testfunc.logout(page);
});