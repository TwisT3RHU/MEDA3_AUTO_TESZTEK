import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://medalyse.alfa.local/medalyse-ng-dev');
  await page.goto('http://medalyse.alfa.local/auth/realms/healthware/protocol/openid-connect/auth?client_id=medalyse-ng-dev&redirect_uri=http%3A%2F%2Fmedalyse.alfa.local%2Fmedalyse-ng-dev&state=7bcfc8d3-bbc4-4991-8888-84db2f6b7317&response_mode=fragment&response_type=code&scope=openid&nonce=eefed5f3-85ed-4685-80bd-90348a5dd442');
  await page.getByLabel('Jelszó').click();
  await page.getByLabel('Jelszó').fill('ABNNv8wg');
  await page.getByLabel('Jelszó').press('Enter');
  await page.getByRole('combobox', { name: 'Alkalmazás' }).locator('span').click();
  await page.getByText('Medalyse3 App').click();
  await page.getByRole('button', { name: 'BELÉPÉS' }).click();
  await page.getByText('double_arrowFőmenü expand_more').click();
  await page.getByRole('link', { name: 'riportverziok' }).click();
  await page.getByText('historyMENUVERZIO2').click();
  await page.getByRole('menuitem', { name: 'menuverzio1' }).click();
  await page.getByRole('cell', { name: 'menuverzio1' }).getByText('menuverzio1').click();
});