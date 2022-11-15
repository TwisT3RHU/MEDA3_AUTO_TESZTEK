import { test, expect } from '@playwright/test';

import { loginout, medaurl, randomname } from './globalis';

const testname = randomname("geriautpart");

console.log(testname) // tudjuk már, hogy mit adott meg a script :D

test.beforeEach(async ({ page }) => { // gyakorlatilag ez a precondition; legyen bejelentkezve

  loginout(page, true);
  await page.getByText('►Hozzáférések').click();
  await page.getByText('Partnerek').click();
  await expect(page).toHaveURL(medaurl('#!partners'));

});

test.afterEach(async ({ page }) => { loginout(page, false); });

test.describe.serial('egy partnert érintő tesztek', () => {

  test('partner hozzáadás', async ({ page }) => {

    await page.getByRole('textbox', { name: 'Név' }).click();
    await page.getByRole('textbox', { name: 'Név' }).fill(testname);
    await page.getByRole('button', { name: ' Mentés' }).click();
    console.log(testname + " létrehozva")

  });

  test('partner törlés + megerősítő ablak', async ({ page }) => {

    await page.getByRole('cell', { name: testname }).click();
    await page.getByRole('button', { name: ' Törlés' }).click();
    await page.getByRole('button', { name: 'Nem' }).click();
    await page.getByRole('button', { name: ' Törlés' }).click();
    await page.getByRole('button', { name: 'Igen' }).click();
    console.log(testname + " törölve");

  });

  test('partner visszaállítás', async ({ page }) => {

    await page.getByText('Töröltek').click();
    await page.getByRole('cell', { name: testname }).click();
    await page.getByRole('button', { name: ' Visszaállítás' }).click();
    await page.getByText('Töröltek').click();
    console.log(testname + " visszaállítva");

  });

  test.skip('partner egyediség megsértése', async ({ page }) => {  // ezt még nem tudom hogy kéne normálisan

    await page.getByRole('textbox', { name: 'Név' }).click();
    await page.getByRole('textbox', { name: 'Név' }).fill(testname);
    await page.getByRole('button', { name: ' Mentés' }).click();
    //await expect(page).toContain('Hiba');

  });

  test('partner ismételt törlése', async ({ page }) => {

    await page.getByRole('cell', { name: testname }).click();
    await page.getByRole('button', { name: ' Törlés' }).click();
    await page.getByRole('button', { name: 'Igen' }).click();
    console.log(testname + " ismételten törölve");

  });
  
});