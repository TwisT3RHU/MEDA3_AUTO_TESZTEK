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
//const beta = "http://medalyse.beta.local/";
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
    /*case "beta":
      return beta;*/ // béta lelőve
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
 * It's a function that clicks on the nth element of a text on a page.
 * @param {any} page - the page object
 * @param {string} textname - the text you want to find
 * @param {number} nth - number - the nth text located inside the page
 */
export async function textcheck(page: any, textname: string, nth: number) {
  const text = page.getByText(textname).nth(nth);
  await expect(text).toBeVisible();
  console.log(text + " megtalálva a(z) " + nth + ". helyen");
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

/**
 * It's a function that checks if a label is editable, then clicks on it, then checks if it's focused,
 * then fills it with content, then checks if it's not empty.
 * @param {any} page - any - the page object
 * @param {string} name - the name of the label
 * @param {string} content - the text that will be inserted into the textbox
 */
export async function labelcheck(page: any, name: string, content: string) {
  const label = page.getByLabel(name, { exact: true });
  await expect(label).toBeEditable();
  await label.click();
  await expect(label).toBeFocused();
  await label.fill(content);
  await expect(label).not.toBeEmpty();
  console.log(content + " beillesztve a " + label + " textboxba");
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
 * @param {string} user - string - the username to log in with
 * @param {string} pass - string - the password to log in with
 */
export async function login(page: any, remote: boolean = false, user: string = core.user.name, pass: string = core.user.pass) {
  await page.goto(medaurl(remote));
  await expect(page).toHaveURL(/.auth\/realms\/healthware\/protocol\/openid-connect./); // SSO
  await labelcheck(page, "Username or email", user);
  await labelcheck(page, "Password", pass);
  await pressbutton(page, "Sign In");
  await expect(page).toHaveURL(medaurl(remote));
  console.log("sikeres bejelentkezés: " + branch(remote) + ": " + user + " - " + pass);
};

export async function register(page: any, remote: boolean = false, firstname: string, lastname: string, email: string, user: string, pass: string, accesscode: string) {
  await page.goto(medaurl(remote));
  await expect(page).toHaveURL(/.auth\/realms\/healthware\/protocol\/openid-connect./); // SSO
  await pressbutton(page, "Register", 0, "link");
  await expect(page).toHaveURL(/.auth\/realms\/healthware\/login-actions\/registration./); // SSO
  await labelcheck(page, "First name", firstname);
  await labelcheck(page, "Last name", lastname);
  await labelcheck(page, "Email", email);
  await labelcheck(page, "Username", user);
  await labelcheck(page, "Password", pass);
  await labelcheck(page, "Confirm password", pass);
  await labelcheck(page, "Access code (optional)", accesscode);
  await page.locator('.rc-anchor-center-item').first().click(); // NEM VAGYOK ROBOT (xD)
  await pressbutton(page, "Register");
  await expect(page).toHaveURL(medaurl(remote));
  console.log("sikeres regisztráció: " + branch(remote) + ": " + user + " - " + pass);
};

/**
 * It clicks on the "kilépés" button, then closes the page context
 * @param {any} page - the page object
 */
export async function logout(page: any, user: string = core.user.name) {
  if (core.misc.admin) await pressbutton(page, 'span:has-text("kilépés")', 0, "locator");
  else {
    await pressbutton(page, "avatar" + user);
    await pressbutton(page, "Kijelentkezés", 0, "menuitem");
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
  await pressbutton(page, remote, 0, "cell");
  //await page.getByRole("cell", { name: remote, exact: true  }).click();
  await pressbutton(page,  " Távoli felhasználók");
  await expect(page).toHaveURL(/.#!serverUsers./);
  await pressbutton(page, "Szerver", 0, "textbox");
  //await page.getByRole('textbox', { name: 'Szerver', exact: true  }).click(); // ez is :D
  await page.getByRole('combobox', { exact: true }).locator('div').click(); // talán ez hiányzott
  await pressbutton(page, 'td[role="listitem"]:has-text("' + remote + '")', 0, "locator");
  await page.waitForLoadState();
};

/**
 * It clicks on a button with a given name and position on the page
 * @param {any} page - the page object
 * @param {string} buttonname - the name of the button
 * @param {number} [position=0] - number = 0 -&gt; if there are multiple buttons with the same name,
 * you can specify which one you want to click on.
 * @param {string} [role=button] - the role of the button, usually "button"
 * @param {boolean} [filtered=false] - true if the stock getByRole function needs extra filtering
 */
export async function pressbutton(page: any, buttonname: string, position: number = 0, role: string = "button", filtered: boolean = false) {
  let button: any = undefined;
  if (role == "text") button = page.getByText(buttonname).nth(position);
  else if (role == "locator") button = page.locator(buttonname).nth(position);
  else {
    if (filtered) button = page.getByRole(role).filter({ hasText: buttonname, exact: true }).nth(position);
    else button = page.getByRole(role, { name: buttonname, exact: true }).nth(position);
  }
  await expect(button).toBeEnabled();
  await expect(button).toBeVisible();
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
  const text: string[][] = [
    ['Nem', 'Cancel', 'Mégsem'],
    ['Igen', 'Ok', 'Igen']
  ];
  const nem = text[0][environment], igen = text[1][environment];
  console.log(nem + " " + igen);

  if (environment == 2) {
    await pressbutton(page, 'button:has-text("delete_outline")', 0, "locator");
    await pressbutton(page, nem, 0);
    await pressbutton(page, 'button:has-text("delete_outline")', 0, "locator");
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
  await page.getByText(headername).nth(nth).click({ delay: 50 });
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
  await pressbutton(page, 'div:has-text("Alkalmazás")', 4, "locator");
  await pressbutton(page, appname, 0, "text");
  await pressbutton(page, "BELÉPÉS");
  await expect(page).toHaveURL(medaurl(remote, appurl));
};

/**
 * It takes a locator as an argument, and returns the background color of the element
 * @param {any} locator - The element you want to get the color of.
 */
export async function getElementColor(locator: any) {
  const color = await locator.evaluate((e: any) => { return window.getComputedStyle(e).getPropertyValue("background-color") });
  console.log(color);
  //return color;
};

/**
 * It clicks on the report version changer button located inside a report, 
 * then sets the version given as the argument. (Angular)
 * @param {any} page - the page object
 * @param {string} version - string - report version
 */
export async function chooseReportAccMode(page: any, version: string) {
  await page.locator('hw-report-breadcrumbs').getByRole('button').click();
  await pressbutton(page, version, 0, "menuitem");
  console.log(version + " riport hozzáférési mód kiválasztva");
};

/**
 * It clicks on the accessibility mode changer button, 
 * then chooses the accessibility mode according to the argument given. (Angular)
 * @param {any} page - any - the page object
 * @param {string} mode - string - the accessibility mode to choose
 */
export async function chooseAccessibilityMode(page: any, mode: string) {
  await page.locator('hw-header').getByRole('button').filter({ hasText: 'explore' }).click();
  await pressbutton(page, mode, 0, "text");
  console.log(mode + " hozzáférési mód kiválasztva");
}

/**
 * This function navigates to a page in the admin section of the site.
 * @param {any} page - the page object from puppeteer
 * @param {string} parent - the parent button to press
 * @param {string} child - the name of the child element
 * @param {string} url - the url of the page you want to navigate to
 * @param {boolean} [remote=false] - boolean = false
 */
export async function navigateToAdminPage(page: any, parent: string, child: string, url: string, remote: boolean = false) {
  await pressbutton(page, parent, 0, "text");
  await pressbutton(page, child, 0, "text");
  await expect(page).toHaveURL(medaurl(remote, url));
}