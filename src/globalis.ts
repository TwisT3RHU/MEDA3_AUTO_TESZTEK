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

/* Paraméter nélküli domain URL-ek definiálása. */
const alfa = "http://medalyse.alfa.local/";
//const beta = "http://medalyse.beta.local/";
const gamma = "http://medalyse.gamma.local/";
const pre = "https://pre.medalyse.hu/";
const prod = "https://medalyse.hu/";

/**
 * A tesztelendő verziót visszaadja stringként.
 * @param {boolean} remote - true, ha távoli szerver és false, ha helyi.
 * @returns a verzió nevét.
 */

export function branch(remote: boolean = false) {
  let branch: string;
  if (!remote) branch = core.misc.branch;
  else branch = core.misc.branch_remote;
  return branch;
};

/**
 * Ez a funkció a stringben kapott verzió nevéből a helyes URL-t adja vissza.
 * @param {boolean} [remote=false] - boolean = false
 * @returns a stringből kapott verziónak a fentebb definiált linkjét adja vissza.
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
 * A kliensen belül megnyitott app linkje, alapesetben a választóba dob be.
 * @param {string} [appurl] - Az app neve.
 * @returns  Az app kliens linkjét adja vissza.
 */
function klienslink(appurl?: string) {
  if (branch() == "alfa") {
    if (appurl == undefined) return "medalyse-ng-dev/";
    else return "medalyse-ng-dev/" + appurl;
  }
  else return "medalyse3app/";
};


/**
 * Az admin linkje.
 * @returns Az admin linkjét.
 */
function adminlink() {
  return "admin/";
};

/**
 * Összerakja a komplett Medalyse linket különböző paraméterek alapján.
 * @param {boolean} remote - True, ha távoli szerver összekötéshez van használva a link és false, ha minden máshoz.
 * @param {string} [menu] - Amennyiben üres, a főmenübe dob be.
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
 * Ellenőrzi, hogy a textbox szerheszthető-e, majd ráklikkel, ellenőrzi, hogy fókuszban van-e és kitölti amennyiben igen.
 * @param {any} page - page objektum
 * @param {any} textboxname - string - a textbox neve
 * @param {string} name - string - az érték, amit kap a textbox
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
 * Ez a funkció ellenőrzi azt, hogy a szöveg megjelenik-e a felületen.
 * @param {any} page - page objektum
 * @param {string} textname - a szöveg, amit meg szeretnél találni
 * @param {number} nth - szám - a szöveg számszerűsített helye az oldalon
 */
export async function textcheck(page: any, textname: string, nth: number) {
  const text = page.getByText(textname).nth(nth);
  await expect(text).toBeVisible();
  console.log(text + " megtalálva a(z) " + nth + ". helyen");
};

/**
 * Ráklikkel egy comboboxra és utána a benne lévő elemre.
 * @param {any} page - page objektum
 * @param {string} rowname - a combobox neve
 * @param {string} name - az elem neve a comboboxban
 */
export async function rowcheck(page: any, rowname: string, name: string) {
  const row = await page.getByRole("row", { name: rowname, exact: true  }).getByRole("combobox").locator("div");
  await row.click();
  //await expect(row).toBeFocused();
  await page.getByText(name).click();
  console.log(name + " kiválasztva a " + row + " comboboxból")
};

/**
 * Ellenőrzi, hogy a label szerkeszthető-e, majd ráklikkel, majd ellenőrzi a fókuszt,
 * feltölti a megadott szöveggel és ellenőrzi, hogy bele lett-e téve.
 * @param {any} page - page objektum
 * @param {string} name - a label neve
 * @param {string} content - a szöveg, amivel fel lesz töltve
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
 * A paraméterként kapott név után tesz egy alsóvonalat és egy véletlen számot.
 * @param {string} name - a név
 * @returns a paraméterben kapott nevet és a számot.
 */
export function randomname(name: string) {
  const randomname_num = Math.floor(Math.random() * 10000000);
  let randomname = name + "_" + randomname_num;
  console.log(randomname + " generálva");
  return randomname;
};

// DÁTUM

/**
 * `datum()` visszaadja az aktuális dátumot ISO formátumban, stringként.
 * @returns a dátumot.
 */
export function datum() {
  const now = new Date().toISOString();
  return now;
};

// KI ÉS BE

/**
 * Elnavigál az SSO-s login oldalra, kitölti a nevet és jelszavat, bejelentkeztet és ellenőrzi azt, hogy jó helyre dobott-e.
 * 
 * @param {any} page - page objektum
 * @param {boolean} remote - true, ha távoliként van használva a link és false, ha helyiként.
 * @param {string} user - string - a felhasználónév (alap paraméter a configban beírt)
 * @param {string} pass - string - a jelszó (alap paraméter a configban beírt)
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

/**
 * Beregisztrál egy új felhasználót.
 * Ez a funkció nem működik, mert a bot nem képes beleklikkelni a captcha-ba...
 * 
 * @example register(page, false, "John", "Doe", "john.doe@example.com", "johndoe", "password", "12345");
 * @param {any} page - page objektum
 * @param {boolean} [remote=false] - boolean = false
 * @param {string} firstname - string, keresztnév
 * @param {string} lastname - string, vezetéknév
 * @param {string} email - string, e-mail cím
 * @param {string} user - string, felhasználónév
 * @param {string} pass - string, jelszó
 * @param {string} accesscode - string, opcionális
 */
export async function register(page: any, remote: boolean = false, firstname: string, lastname: string, email: string, user: string, pass: string, accesscode?: string) {
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
  if (accesscode != undefined) await labelcheck(page, "Access code (optional)", accesscode);
  //await page.locator('iframe[name=' + RegExp(/a-[a-z0-9]{12}/g) + '"]').getByRole('checkbox', { name: 'I\'m not a robot' }).click();
  //await page.getByRole('checkbox', { name: 'I\'m not a robot', exact: true }).click();
  await pressbutton(page, "Register");
  await expect(page).toHaveURL(medaurl(remote));
  console.log("sikeres regisztráció: " + branch(remote) + ": " + user + " - " + pass);
};

/**
 * Rányom a "Kilépés" gombra, ezáltal kijelentkeztet.
 * @param {any} page - page objektum
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
 * A távoli szerver nevére ráklikkel, majd megnyitja a Távoli felhasználók felületet
 * és onnan is kiválasztja a távoli szervert.
 * 
 * @param {any} page - page objektum
 * @param {string} remote - a távoli szerver neve
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
 * Megnyom egy gombot az adott paraméterek alapján, miután ellenőrizte azt, hogy létezik és látható.
 * 
 * @param {any} page - page objektum
 * @param {string} buttonname - a gomb neve
 * @param {number} [position=0] - number = 0, ha több gomb van ugyanazzal a névvel, akkor aszerint kell számozni
 * @param {string} [role=button] - a gomb szerepe, általában "button", mivel vaadin alatt több fajta gombot is meg lehet nyomni...
 * @param {boolean} [filtered=false] - true, ha egyéb szűrési feltételekre is szükség van
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
 * Ez a funkció bizonyos dolgok törlésére való, aminél először Nem-re nyom, majd Igen-re, 
 * hogy ellenőrizze a működését ennek is.
 * 
 * @param {any} page - page objektum
 * @param {string} buttonname - a megnyomandó gomb neve
 * @param {number} [position=0] - a gomb pozíciója
 * @param {number} [environment=0] - 0 = Medalyse admin magyar nyelvű, 1 = Medalyse admin angol nyelvű, 2 = Angular magyar
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
 * "Legörget" egy listában addig az elemig, amit meg akarunk találni benne.
 * Technikailag a lefelé nyilat spameli.
 * Ez a funkció azért létezik, mert vaadinban a scrollIntoView() nem működik.
 * 
 * @param {any} page - page objektum
 * @param {string} headername - a klikkelendő fejléc neve
 * @param {number} nth - klikkelendő fejléc pozíciója
 * @param {any} locator - az elem, amire "görgetni" szeretnénk
 */
export async function scrollUntilVisible(page: any, headername: string, nth: number, locator: any) {
  await page.getByText(headername).nth(nth).click({ delay: 50 });
  do await page.keyboard.down('ArrowDown');
  while (await locator.isVisible() == false);
  console.log(locator + " megtalálva")
  await page.keyboard.up('ArrowDown');
};

/**
 * Az "Alkalmazás" menüre klikkel, azon belül kiválasztja az appot,
 * a BELÉPÉS gombra kattint és ellenőrzi az URL helyességét.
 * @param {any} page - page objektum
 * @param {string} appname - az alkalmazás neve
 * @param {string} appurl - az alkalmazás linkje
 * @param {boolean} [remote=false] - boolean = false
 */
export async function selectApp(page: any, appname: string, appurl: string, remote: boolean = false) {
  await pressbutton(page, 'div:has-text("Alkalmazás")', 4, "locator");
  await pressbutton(page, appname, 0, "text");
  await pressbutton(page, "BELÉPÉS");
  await expect(page).toHaveURL(medaurl(remote, appurl));
};

/**
 * Egy elemnek a háttérszínét adja vissza.
 * @param {any} locator - Az elem, aminek a színe kell.
 */
export async function getElementColor(locator: any) {
  const color = await locator.evaluate((e: any) => { return window.getComputedStyle(e).getPropertyValue("background-color") });
  console.log(color);
  //return color;
};

/**
 * A lokális módválasztón átklikkel a megadott riport verzióra.
 * @param {any} page - page objektum
 * @param {string} version - string - riport verzió
 */
export async function chooseReportAccMode(page: any, version: string) {
  await page.locator('hw-report-breadcrumbs').getByRole('button').click();
  await pressbutton(page, version, 0, "menuitem");
  console.log(version + " riport hozzáférési mód kiválasztva");
};

/**
 * A globális módválasztón átklikkel a megadott verzióra.
 * @param {any} page - page objektum
 * @param {string} mode - string - hozzáférési mód neve
 */
export async function chooseAccessibilityMode(page: any, mode: string) {
  await page.locator('hw-header').getByRole('button').filter({ hasText: 'explore' }).click();
  await pressbutton(page, mode, 0, "text");
  console.log(mode + " hozzáférési mód kiválasztva");
}

/**
 * Ez a funkció az admin egyik fő menüjében lévő gyermekmenüre klikkel.
 * @param {any} page - page objektum
 * @param {string} parent - szülő menü neve
 * @param {string} child - gyermek menü neve
 * @param {string} url - az URL, amire navigálni akarsz
 * @param {boolean} [remote=false] - boolean = false
 */
export async function navigateToAdminPage(page: any, parent: string, child: string, url: string, remote: boolean = false) {
  await pressbutton(page, parent, 0, "text");
  await pressbutton(page, child, 0, "text");
  await expect(page).toHaveURL(medaurl(remote, url));
}