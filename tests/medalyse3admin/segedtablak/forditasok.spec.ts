import { test, expect } from '@playwright/test';

import { login, logout, medaurl, randomname, removeitem, rowcheck, textboxcheck } from 'globalis';

const origname = "adatmódosítás";
const testname = randomname("fordítás");
const testnamedit = testname + "_edited";

console.log(testname); // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => {
  // gyakorlatilag ez a precondition; legyen bejelentkezve
  await login(page);
  await page.getByText('►Segédtáblák').click();
  await page.getByText('Fordítások').click();
  await expect(page).toHaveURL(medaurl(false, "#!trans"));
});

test.describe.serial("egy fordítást érintő tesztek", () => {
  test("fordítás hozzáadás", async ({ page }) => {
    await page.getByRole('button', { name: ' Új' }).click();
    await rowcheck(page, "Nyelv", "Playwright");
    await textboxcheck(page, "Eredeti", origname);
    await textboxcheck(page, "Fordítás", testname);
    await page.getByRole("button", { name: " Mentés" }).click();
    const celltest = page.getByRole("cell", { name: testname });
    await expect(celltest).toHaveText(testname);
    console.log(celltest + " fordítás létrehozva");
  });

  test("fordítás szerkesztés", async ({ page }) => {
    const cellorig = page.getByRole("cell", { name: origname });
    const celltest = page.getByRole("cell", { name: testnamedit });
    await cellorig.nth(0).click();
    await textboxcheck(page, "Fordítás", testnamedit);
    await page.getByRole("button", { name: " Mentés" }).click();
    await expect(celltest).toHaveText(testnamedit);
    console.log(cellorig + " szerkesztve, új fordítás: " + celltest);
  });

  test("fordítás törlés + megerősítő ablak", async ({ page }) => {
    const cellname = page.getByRole("cell", { name: testnamedit });
    await expect(cellname).toHaveText(testnamedit);
    await cellname.click();
    await removeitem(page, " Törlés");
    console.log(cellname + " törölve");
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });
});

test.skip('test', async ({ page }) => {

  await page.goto('http://medalyse.gamma.local/auth/realms/healthware/protocol/openid-connect/auth?response_type=code&client_id=medalyse3admin&redirect_uri=http%3A%2F%2Fmedalyse.gamma.local%2Fadmin&state=cb6946ff-2725-439f-bf15-6aa4be33f45e&login=true&scope=openid');

  await page.getByLabel('Jelszó').click();

  await page.getByLabel('Jelszó').fill('123456');

  await page.getByText('►Segédtáblák').click();

  await page.locator('span:has-text("Fordítások")').first().click();
  await expect(page).toHaveURL('http://medalyse.gamma.local/admin/#!trans');

  await page.getByRole('button', { name: ' Új' }).click();

  await page.getByRole('combobox').locator('div').click();

  await page.locator('td[role="listitem"]:has-text("Magyar")').click();

  await page.getByRole('textbox', { name: 'Eredeti' }).click();

  await page.getByRole('textbox', { name: 'Eredeti' }).fill('adatmódosítás');

  await page.getByRole('textbox', { name: 'Fordítás' }).click();

  await page.getByRole('textbox', { name: 'Fordítás' }).fill('sddasadldakadklwkdwaadkladwlkalawlkalawdladwl');

  await page.getByRole('button', { name: ' Mentés' }).click();

  await page.getByRole('combobox').locator('div').click();

  await page.getByRole('textbox', { name: 'Nyelv' }).click();

  await page.getByRole('cell', { name: 'перезагрузить переводы' }).click();

  await page.getByRole('button', { name: ' Törlés' }).click();

  await page.getByRole('button', { name: 'Nem' }).click();

  await page.getByRole('textbox', { name: 'Eredeti' }).click();

  await page.getByRole('textbox', { name: 'Fordítás' }).click();

});