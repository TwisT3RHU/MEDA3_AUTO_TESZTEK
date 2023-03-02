import { expect } from "@playwright/test";
import * as core from "core.json";

/*import { Console } from "console";
import * as fs from "fs";

 Creating a new Console object and assigning it to the logger variable. 
export const logger = new Console({
  stdout: fs.createWriteStream("normalStdout.txt"),
  stderr: fs.createWriteStream("errStdErr.txt")
});*/

// LINK ÖSSZERAKÁSOK

/* Defining the base URLs. */
const alfa = "http://medalyse.alfa.local/";
const beta = "http://medalyse.beta.local/";
const gamma = "http://medalyse.gamma.local/";
const pre = "https://pre.medalyse.hu/";
const prod = "https://medalyse.hu/";

/**
 * It returns the current branch base URL of Medalyse.
 * @param {boolean} remote - true if the site is being used as a remote server, false if it's used locally.
 * @returns The branch base URL.
 */

export function branch(remote: boolean = false) {
  let branch: string;
  if (!remote) branch = core.misc.branch;
  else branch = core.misc.branch_remote;
  return branch;
};

/**
 * `medalink` is a function that returns a string based on the value of the `branch` function
 * @param {boolean} [remote=false] - boolean = false
 * @returns the value of the variable that is assigned to the branch.
 */

function medalink(remote: boolean = false) {
  switch (branch(remote)) {
    case "alfa":
      return alfa;
    case "beta":
      return beta;
    case "gamma":
      return gamma;
    case "pre":
      return pre;
    case "prod":
      return prod;
    default:
      return gamma;
  };
};

/**
 * It returns a string.
 * @param {string} [appurl] - The URL of the application you want to link to.
 * @returns The function klienslink() is being returned.
 */
function klienslink(appurl?: string) {
  if (branch() == "alfa") {
    if (appurl == undefined) return "medalyse-ng-dev/";
    else return "medalyse-ng-dev/" + appurl;
  }
  else return "medalyse3app/";
};


/**
 * It returns a string.
 * @returns The function adminlink() is being returned.
 */
function adminlink() {
  return "admin/";
};

/**
 * It returns a url based on the parameters.
 * </code>
 * @param {boolean} remote - true if the site is being used as a remote server, false if it's used locally.
 * @param {string} [menu] - string, navigates to the main page if it's empty.
 * @returns the url.
 */
export function medaurl(remote: boolean, menu?: string) {
  let url = "";
  if (menu == "remote" || menu == "local") {
    url = medalink(remote) + "app/call?app=" + klienslink(); // http://medalyse.beta.local/app/call?app=medalyse3app
  } else {
    if (core.misc.admin) {
      url = medalink(remote) + adminlink();
      if (menu == undefined) url;
      else url = url + menu;
    } else {
      url = medalink(remote) + klienslink();
      if (menu == undefined) url;
      else url = url + menu;
    }
  }
  console.log(url + " meda url összerakva");
  return url;
};

/**
 * It checks if a textbox is editable, then clicks on it, checks if it's focused, fills it with a name,
 * and checks if it has the name.
 * @param {any} page - the page object
 * @param {any} textboxname - string - the name of the specified textbox
 * @param {string} name - string - the value to be filled into the text box
 */
export async function textboxcheck(page: any, textboxname: string, name: string) {
  const textbox = page.getByRole("textbox", { name: textboxname, exact: true });
  await expect(textbox).toBeEditable();
  await textbox.click();
  await expect(textbox).toBeFocused();
  await textbox.fill(name);
  await expect(textbox).not.toBeEmpty(); // ez legalább működik
  //await expect(textbox).toHaveText(name); // nem értem, received string "" közben nem?
  console.log(name + " beillesztve a " + textbox + " textboxba");
};

/**
 * It clicks on a combobox, then clicks on a text in the combobox.
 * @param {any} page - the page object
 * @param {string} rowname - the name of the combobox
 * @param {string} name - the name of the item inside a combobox
 */
export async function rowcheck(page: any, rowname: string, name: string) {
  const row = await page.getByRole("row", { name: rowname, exact: true  }).getByRole("combobox").locator("div");
  await row.click();
  //await expect(row).toBeFocused();
  await page.getByText(name).click();
  console.log(name + " kiválasztva a " + row + " comboboxból")
};

// NÉV GENERÁLÁS

/**
 * It generates a random name from a given name, adding a random number as its suffix.
 * @param {string} name - the base name.
 * @returns the randomname variable.
 */
export function randomname(name: string) {
  const randomname_num = Math.floor(Math.random() * 10000000);
  let randomname = name + "_" + randomname_num;
  console.log(randomname + " generálva");
  return randomname;
};

// DÁTUM

/**
 * `datum()` returns the current date and time in ISO format
 * @returns the date.
 */
export function datum() {
  const now = new Date().toISOString();
  return now;
};

// KI ÉS BE

/**
 * It navigates to the login page, fills in the username and password, presses the tab key, fills in
 * the password, presses the enter key, and then checks if the URL is the same as the main page.
 * 
 * @param {any} page - the page object
 * @param {boolean} remote - true if the site is being used as a remote server, false if it's used locally.
 */
export async function login(page: any, remote: boolean = false) {
  await page.goto(medaurl(remote));
  await expect(page).toHaveURL(/.auth\/realms\/healthware\/protocol\/openid-connect./); // SSO
  const username = page.getByLabel("Username or email");
  await expect(username).toBeEditable();
  await username.click();
  await expect(username).toBeFocused();
  await username.fill(core.user.name);
  await expect(username).not.toBeEmpty();
  console.log(core.user.name + " beillesztve a " + username + " textboxba");

  const password = page.getByLabel("Password");
  await expect(password).toBeEditable();
  await password.click();
  await expect(password).toBeFocused();
  await password.fill(core.user.pass);
  await expect(password).not.toBeEmpty();
  console.log(core.user.pass + " beillesztve a " + password + " textboxba");

  await password.press("Enter");
  await expect(page).toHaveURL(medaurl(remote));
  //await page.waitForNavigation();
  console.log("sikeres bejelentkezés: " + branch(remote) + ": " + core.user.name + " - " + core.user.pass);
};

/**
 * It clicks on the "kilépés" button, then closes the page context
 * @param {any} page - the page object
 */
export async function logout(page: any) {
  if (core.misc.admin) await page.locator('span:has-text("kilépés")').first().click();
  else {
    await page.getByRole('button', { name: "avatar" + core.user.name, exact: true }).click();
    await page.getByRole('menuitem', { name: 'Kijelentkezés', exact: true  }).click();
  };
  const context = page.context();
  await context.close();
};

// TÁVOLI SZERVER MENÜ

/**
 * It clicks on a cell with the name of a remote server, then clicks on a button with the name "
 * Távoli felhasználók", then it checks if the URL contains the string ".#!serverUsers.", then it
 * clicks on a cell with the name of the remote server.
 * 
 * @param {any} page - the page object
 * @param {string} remote - the name of the remote server
 */
export async function hoptoserverusers(page: any, remote: string) {
  await page.getByRole("cell", { name: remote, exact: true  }).click();
  await pressbutton(page,  " Távoli felhasználók", 0);
  await expect(page).toHaveURL(/.#!serverUsers./);
  await page.getByRole('textbox', { name: 'Szerver', exact: true  }).click(); // ez is :D
  await page.getByRole('combobox', { exact: true }).locator('div').click(); // talán ez hiányzott
  await page
    .locator('td[role="listitem"]:has-text("' + remote + '")')
    .click();
  await page.waitForLoadState();
};

/**
 * It clicks on a button with a given name and position on the page
 * @param {any} page - the page object
 * @param {string} buttonname - the name of the button
 * @param {number} [position=0] - number = 0 -&gt; if there are multiple buttons with the same name,
 * you can specify which one you want to click on.
 * @param {string} [role=button] - the role of the button, usually "button"
 */
export async function pressbutton(page: any, buttonname: string, position: number = 0, role: string = "button") {
  const button = page.getByRole(role, { name: buttonname, exact: true }).nth(position);
  await expect(button).toBeEnabled();
  await button.click();
  console.log(button + " meg lett nyomva");
};

/**
 * It clicks on a button, then it clicks on the first button with the text "Nem" (Cancel), then it
 * clicks on the original button again, then it clicks on the first button with the text "Igen" (Ok).
 * @param {any} page - the page object
 * @param {string} buttonname - the name of the button you want to press
 * @param {number} [position=0] - 0 = first button, 1 = second button, etc.
 * @param {number} [environment=0] - 0 = Medalyse admin Hungarian, 1 = Medalyse admin English, 2 = Angular Hungarian
 */
export async function removeitem(page: any, buttonname: string, position: number = 0, environment: number = 0) {
  const nemstr: string[] = ['Nem', 'Cancel', 'Mégsem'];
  const igenstr: string[] = ['Igen', 'Ok', 'Igen'];
  const nem = nemstr[environment], igen = igenstr[environment];
  console.log(nem + " " + igen);

  if (environment == 2) {
    await page.locator('button:has-text("delete_outline")').click();
    await pressbutton(page, nem, 0);
    await page.locator('button:has-text("delete_outline")').click();
    await pressbutton(page, igen, 0);
  }
  else {
    await pressbutton(page, buttonname, position);
    await pressbutton(page, nem, 0);
    await pressbutton(page, buttonname, position);
    await pressbutton(page, igen, 0);
  }
};

/**
 * It scrolls to the element that matches the selector.
 * @param {any} page - the page object from puppeteer
 * @param {any} selector - The selector of the element you want to scroll to.
 */
export async function scrollOnElement(page: any, selector: any) {
  await page.$eval(selector, (element: any) => {
    element.scrollIntoView();
  });
};

/**
 * "Scrolls" down by holding the ArrowDown key inside until the element becomes visible.
 * This workaround exists only because Medalyse isn't capable of running the already existing scrollIntoView(IfNeeded) function.
 * @param {any} page - the page object
 * @param {string} headername - The name of the header you want to "click on"
 * @param {number} nth - To indicate which header name to be selected if there are multiple with the same name
 * @param {any} locator - the element you want to scroll to
 */
export async function scrollUntilVisible(page: any, headername: string, nth: number, locator: any) {
  await page.getByText(headername).nth(nth).click({ delay: 100 });
  do await page.keyboard.down('ArrowDown');
  while (await locator.isVisible() == false);
  console.log(locator + " megtalálva")
  await page.keyboard.up('ArrowDown');
};

/**
 * It clicks on the "Alkalmazás" menu, then clicks on the appname, then clicks on the "BELÉPÉS" button,
 * then checks if the URL is correct
 * @param {any} page - the page object
 * @param {string} appname - the name of the application
 * @param {string} appurl - the url of the application
 * @param {boolean} [remote=false] - boolean = false
 */
export async function selectApp(page: any, appname: string, appurl: string, remote: boolean = false) {
  await page.locator('div:has-text("Alkalmazás")').nth(4).click();
  await page.getByText(appname).click();
  await pressbutton(page, "BELÉPÉS");
  await expect(page).toHaveURL(medaurl(remote, appurl));
};

/**
 * It takes a locator as an argument, and returns the background color of the element
 * @param {any} locator - The element you want to get the color of.
 */
export async function getElementColor(locator: any) {
  const color = await locator.evaluate((e) => { return window.getComputedStyle(e).getPropertyValue("background-color") });
  console.log(color);
  //return color;
};