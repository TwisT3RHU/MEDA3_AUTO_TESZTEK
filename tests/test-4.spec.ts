import { test, expect } from '@playwright/test';
import { login, logout, medaurl } from './globalis';

test.beforeEach(async ({ page }) => { // gyakorlatilag ez a precondition; legyen bejelentkezve

  login(page);
  await page.getByText('►Hozzáférések').click();
  await page.getByText('Szerverek').click();
  await expect(page).toHaveURL(medaurl('#!servers'));

});

test.afterEach(async ({ page }) => { logout(page); });

test.skip('kapcsolatok', async ({ page }) => {

  const bejovokod = await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).inputValue();
  console.log(bejovokod + " BEJÖVŐ KÓD HELÓ VAN ITT VALAMI?");
  const kimenokod = await page.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).inputValue();
  console.log(kimenokod + " KIMENŐ KÓD HELÓ VAN ITT VALAMI?");

});