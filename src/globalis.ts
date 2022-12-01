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

function klienslink() {
  return "medalyse3app/";
};

/**
 * If the branch is pre or prod, return medalyse3admin/; otherwise, return admin/.
 * @param {boolean} remote - true if the site is being used as a remote server, false if it's used locally.
 * @returns The function adminlink() is being returned.
 */
function adminlink(remote: boolean) {
  if (branch(remote) == "pre" || branch(remote) == "prod") return "medalyse3admin/";
  else return "admin/";
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
      if (branch(remote) == "pre" || branch(remote) == "prod") {
        url = medalink(remote) + "app/" + adminlink(remote); }
      else url = medalink(remote) +  adminlink(remote);
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

/*export function medaurl(remote: boolean, menu?: string) {
  let url = "";
  if (menu == "remote" || menu == "local") {
    url = medalink(remote) + "m3/call?app=" + klienslink();
    // http://medalyse.beta.local/m3/call?app=medalyse3app
    return url;
  } else {
    if (misc.admin) {
      if (branch(remote) == "pre" || branch(remote) == "prod") url = medalink(remote) + "app/" + adminlink(remote);
      else url = medalink(remote) +  adminlink(remote);
      if (menu == undefined) return url;
      else return url + menu;
    } else {
      url = medalink(remote) + "app/" + klienslink();
      if (menu == undefined) return url;
      else return url + menu;
    }
  }
}*/

/*export function medaurl(menu?: string) {
    let admin = "";
    if (misc.branch != "alfa") admin = medalink() + "app/" + adminlink();
    else admin = medalink() + adminlink();
    if (menu == undefined) return admin;
    else return admin + menu;
};*/

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
  await page.getByLabel("Username or email").fill(user.name);
  await page.getByLabel("Username or email").press("Tab");
  await page.getByLabel("Password").fill(user.pass);
  await page.getByLabel("Password").press("Enter");
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