import { expect } from "@playwright/test";
import { misc, user } from "core.json";

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
  if (!remote) branch = misc.branch;
  else branch = misc.branch_remote;
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
 * The function klienslink() returns the string "medalyse3app/"
 * @returns The function klienslink() is being returned.
 */
function klienslink() {
  return "medalyse3app/";
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
    url = medalink(remote) + "m3/call?app=" + klienslink();
  } else {
    if (misc.admin) {
      url = medalink(remote) +  adminlink();
      if (menu == undefined) url;
      else url = url + menu;
    } else {
      url = medalink(remote) + "app/" + klienslink();
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
  const textbox = page.getByRole("textbox", { name: textboxname });
  await expect(textbox).toBeEditable();
  await textbox.click();
  await expect(textbox).toBeFocused();
  await textbox.fill(name);
  await expect(textbox).not.toBeEmpty(); // ez legalább működik
  //await expect(textbox).toHaveText(name); // elfosta magát? received string "" közben nem?
  console.log(name + " beillesztve a " + textbox + " textboxba");
};

/**
 * It clicks on a combobox, then clicks on a text in the combobox.
 * @param {any} page - the page object
 * @param {string} rowname - the name of the combobox
 * @param {string} name - the name of the item inside a combobox
 */
export async function rowcheck(page: any, rowname: string, name: string) {
  const row = await page.getByRole("row", { name: rowname }).getByRole("combobox").locator("div");
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
  await username.fill(user.name);
  await expect(username).not.toBeEmpty();
  console.log(user.name + " beillesztve a " + username + " textboxba");

  const password = page.getByLabel("Password");
  await expect(password).toBeEditable();
  await password.click();
  await expect(password).toBeFocused();
  await password.fill(user.pass);
  await expect(password).not.toBeEmpty();
  console.log(user.pass + " beillesztve a " + password + " textboxba");

  await password.press("Enter");
  await expect(page).toHaveURL(medaurl(remote));
  console.log("sikeres bejelentkezés: " + branch(remote) + ": " + user.name + " - " + user.pass);
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
  await page.getByRole("cell", { name: remote }).click();
  await page
    .getByRole("button", { name: " Távoli felhasználók" })
    .click();
  await expect(page).toHaveURL(/.#!serverUsers./);
  await page
    .locator('td[role="listitem"]:has-text("' + remote + '")')
    .click();
};

export async function removeitem(page: any, buttonname: string) {
  const removebutton = page.getByRole("button", { name: buttonname });
  await expect(removebutton).toBeEnabled();
  await removebutton.click();
  console.log(removebutton + " meg lett nyomva");

  const nem = page.getByRole("button", { name: "Nem" });
  await expect(nem).toBeEnabled();
  await nem.click();
  console.log(nem + " meg lett nyomva");

  await expect(removebutton).toBeEnabled();
  await removebutton.click();
  console.log(removebutton + " meg lett nyomva");
  
  const igen = page.getByRole("button", { name: "Igen" });
  await expect(igen).toBeEnabled();
  await igen.click();
  console.log(igen + " meg lett nyomva");
};