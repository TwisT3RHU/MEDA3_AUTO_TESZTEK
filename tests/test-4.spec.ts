import { test, expect } from '@playwright/test';

import { branch, login, medaurl } from './globalis';
import { misc, user } from './core.json';

const remotename = branch(true) + '_autoteszt';
const servername = branch(false) + '_autoteszt';

test.beforeEach(async ({ page }) => { // gyakorlatilag ez a precondition; legyen bejelentkezve

  login(page);
  await page.getByText('►Hozzáférések').click();
  await page.getByText('Szerverek').click();
  await expect(page).toHaveURL(medaurl(false, '#!servers'));

});

//test.afterEach(async ({ page }) => { await page.locator('span:has-text("kilépés")').first().click(); });

test('új távoli szerver hozzáadása', async ({ page }) => {

  await page.getByRole('button', { name: ' Új' }).click();
  await page.getByRole('textbox', { name: 'Név' }).click();
  await page.getByRole('textbox', { name: 'Név' }).fill(remotename);
  await page.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).click();
  await page.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).fill(medaurl(true, 'remote'));
  let kimenokod = await page.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).inputValue();

  const context = page.context();
  const page2 = await context.newPage();
  await login(page2, true);

  await page2.getByText('►Hozzáférések').click();
  await page2.getByText('Szerverek').click();
  await expect(page2).toHaveURL(medaurl(true, '#!servers'));

  await page2.getByRole('button', { name: ' Új' }).click();
  await page2.getByRole('textbox', { name: 'Név' }).click();
  await page2.getByRole('textbox', { name: 'Név' }).fill(servername);
  await page2.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).click();
  await page2.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).fill(medaurl(false, 'local'));
  await page2.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).fill(kimenokod);
  let bejovokod = await page2.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).inputValue();

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).fill(bejovokod);
  
  await page.getByRole('button', { name: ' Mentés' }).click();
  await page2.getByRole('button', { name: ' Mentés' }).click();

});

test.skip('test', async ({ page }) => {

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).click();

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).dblclick();

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).click();

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).click();

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).click({
    clickCount: 5
  });

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).press('Control+c');

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).fill('XgTtZugBs4JwnC32aSnxBYUueFcTZpet');

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).press('Control+a');

  await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).press('Control+c');

  await page1.goto('http://sso.beta.local/auth/realms/healthware/protocol/openid-connect/auth?response_type=code&client_id=medalyse3admin&redirect_uri=http%3A%2F%2Fmedalyse.beta.local%2Fapp%2Fmedalyse3admin%2F&state=64ba2134-49d1-408a-81d1-c734bc9548d7&login=true&scope=openid');

  await page1.getByText('Jelszó').click();

  await page1.getByLabel('Jelszó').click();

  await page1.getByLabel('Jelszó').fill('123456');

  await page1.goto('http://medalyse.beta.local/app/medalyse3admin/');

  await page1.getByText('►Hozzáférések').click();

  await page1.getByText('Szerverek').click();
  await expect(page1).toHaveURL('http://medalyse.beta.local/app/medalyse3admin/#!servers');

  await page1.getByRole('button', { name: ' Új' }).click();

  await page1.getByRole('textbox', { name: 'Név' }).click();

  await page1.getByRole('textbox', { name: 'Név' }).fill('gamma3');

  await page1.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).click();

  await page1.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).fill('http://medalyse.gamma.local/app/');

  await page1.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).press('Shift+ContextMenu');

  await page1.getByRole('textbox', { name: 'Kimenő kapcsolat URL' }).fill('http://medalyse.gamma.local/app/medalyse3app/call');

  await page1.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).click();

  await page1.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).press('Control+a');

  await page1.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).fill('XgTtZugBs4JwnC32aSnxBYUueFcTZpet');

  await page1.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).click();

  await page1.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).press('Control+a');

  await page1.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).press('Control+c');

  await page.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).click();

  await page.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).press('Control+a');

  await page.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).fill('GUMJQjQrVaLyLsPCmjwhsqE1jLaSVnC9');

  await page1.getByRole('button', { name: ' Mentés' }).click();

  await page.getByRole('button', { name: ' Mentés' }).click();

  await page.getByRole('button', { name: ' Távoli felhasználók' }).click();
  await expect(page).toHaveURL('http://medalyse.gamma.local/app/medalyse3admin/#!serverUsers/1000000026');

  await page.getByRole('cell', { name: 'kotel.g_autotestuser' }).first().click();

  await page.getByRole('button', { name: ' Hozzáad' }).first().click();

  await page.getByRole('row', { name: 'beta kotel.g_autotestuser' }).getByRole('cell', { name: 'kotel.g_autotestuser' }).click();

  await page.getByRole('row', { name: 'geriautocsop' }).getByLabel('').check();

  await page.getByRole('button', { name: ' Hozzáad' }).nth(1).click();

  await page.locator('table:has-text("Névgeriautocsop")').getByRole('cell', { name: 'geriautocsop' }).click();

  await page.locator('table:has-text("Névgeriautocsop")').getByRole('cell').nth(2).click();

  await page.getByRole('button', { name: ' Eltávolít' }).nth(1).click();

  await page.getByRole('button', { name: ' Eltávolít' }).first().click();

  await page1.getByRole('button', { name: ' Távoli felhasználók' }).click();

  await page1.goto('http://medalyse.beta.local/app/medalyse3admin/#!serverUsers/123');

  await page1.getByRole('combobox').locator('div').click();

  await page1.locator('td[role="listitem"]:has-text("gamma3")').click();

  await page1.getByRole('combobox').locator('div').click();

  await page1.locator('td[role="listitem"]:has-text("betavesszo")').click();

  await page1.getByRole('combobox').locator('div').click();

  await page1.getByText('gamma3').click();

  await page1.getByRole('cell', { name: 'kotel.g_autotestuser' }).first().click();

  await page1.getByRole('button', { name: ' Hozzáad' }).first().click();

  await page1.getByRole('row', { name: 'gamma3 kotel.g_autotestuser' }).getByRole('cell', { name: 'kotel.g_autotestuser' }).click();

  await page1.getByRole('row', { name: 'geriautocsop' }).getByRole('cell').first().click();

  await page1.getByRole('button', { name: ' Hozzáad' }).nth(1).click();

  await page1.locator('.v-splitpanel-second-container > .v-splitpanel-horizontal > div > .v-splitpanel-second-container > .v-panel > .v-panel-content > .v-verticallayout > .v-expand > div > .v-grid > .v-grid-tablewrapper > table > .v-grid-body > .v-grid-row > td').first().click();

  await page1.getByRole('cell', { name: 'geriautocsop' }).nth(1).click();

  await page1.getByRole('cell', { name: 'geriautocsop' }).nth(1).click();

  await page1.getByRole('button', { name: ' Eltávolít' }).nth(1).click();

  await page1.getByRole('button', { name: ' Eltávolít' }).first().click();

  await page1.goto('http://medalyse.beta.local/app/medalyse3admin/#!servers');

  await page1.getByRole('button', { name: ' Törlés' }).click();

  await page1.getByRole('button', { name: 'Nem' }).click();

  await page1.getByRole('button', { name: ' Törlés' }).click();

  await page1.getByRole('button', { name: 'Igen' }).click();
  await expect(page1).toHaveURL('http://medalyse.gamma.local/app/medalyse3admin/#!servers');

  await page.getByRole('button', { name: ' Törlés' }).click();

  await page.getByRole('button', { name: 'Nem' }).click();

  await page.getByRole('button', { name: ' Törlés' }).click();

  await page.getByRole('button', { name: 'Nem' }).click();

  await page.getByRole('button', { name: ' Távoli felhasználók' }).click();
  await expect(page).toHaveURL('http://medalyse.gamma.local/app/medalyse3admin/#!serverUsers/1000000026');

  await page.getByRole('button', { name: ' Hozzáad' }).first().click();

  await page.getByRole('row', { name: 'beta kotel.g_autotestuser' }).getByRole('cell', { name: 'beta' }).click();

  await page.getByRole('button', { name: ' Eltávolít' }).first().click();
  await expect(page).toHaveURL('http://medalyse.gamma.local/app/medalyse3admin/#!servers');

  await page.getByRole('button', { name: ' Törlés' }).click();

  await page.getByRole('button', { name: 'Igen' }).click();

});

test.skip('kapcsolatok', async ({ page }) => {

  const bejovokod = await page.getByRole('textbox', { name: 'Bejövő kapcsolat kód' }).inputValue();
  console.log(bejovokod + " BEJÖVŐ KÓD HELÓ VAN ITT VALAMI?");
  const kimenokod = await page.getByRole('textbox', { name: 'Kimenő kapcsolat kód' }).inputValue();
  console.log(kimenokod + " KIMENŐ KÓD HELÓ VAN ITT VALAMI?");

});