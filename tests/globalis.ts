import { expect } from '@playwright/test';
import { misc, user } from './core.json';

// LINK ÖSSZERAKÁSOK

const alfa = "http://medalyse.alfa.local/";
//const alfa_admin = "http://medalyse.alfa.local/"; //változott a link az adminhoz
const beta = "http://medalyse.beta.local/";
const gamma = "http://medalyse.gamma.local/";
const pre = "https://pre.medalyse.hu/";
const prod = "https://medalyse.hu/";

function medalink(remote: boolean = false) {
    let branch: string;
    if (!remote) branch = misc.branch;
    else branch = misc.branch_remote;

    switch (branch) {
        case "alfa": return alfa;
        case "beta": return beta;
        case "gamma": return gamma;
        case "pre": return pre;
        case "prod": return prod;
        default: return gamma;
    };
};

function klienslink() {
    return "medalyse3app/";
};

function adminlink() {
    if (misc.branch == "alfa") return "admin/";
    else return "medalyse3admin/"; 
};

export function medaurl(menu?: string) {
    let url = "";
    if (menu == "call")
    {
        url = medalink(true) + "app/" + klienslink() + "call";
        return url;
    }
    else
    {
        if (misc.admin)
        {
            if (misc.branch != "alfa") url = medalink() + "app/" + adminlink();
            else url = medalink() + adminlink();
            if (menu == undefined) return url;
            else return url + menu;
        }
        else
        {
            url = medalink() + "app/" + klienslink();
            if (menu == undefined) return url;
            else return url + menu;
        };
    };
};

/*export function medaurl(menu?: string) {
    let admin = "";
    if (misc.branch != "alfa") admin = medalink() + "app/" + adminlink();
    else admin = medalink() + adminlink();
    if (menu == undefined) return admin;
    else return admin + menu;
};*/

// NÉV GENERÁLÁS

export function randomname(name: string) {
    const randomname_num = Math.floor(Math.random() * 10000000);
    let randomname = name + "_" + randomname_num;
    console.log(randomname + " generálva");
    return randomname;
};

// DÁTUM

export function datum() {
    const now = new Date().toISOString();
    return now;
};

// KI ÉS BE

export async function login(page: any) {
    await page.goto(medaurl());
    await page.getByLabel('Username or email').fill(user.name);
    await page.getByLabel('Username or email').press('Tab');
    await page.getByLabel('Password').fill(user.pass);
    await page.getByLabel('Password').press('Enter');
    await expect(page).toHaveURL(medaurl());
    console.log("sikeres bejelentkezés: " + misc.branch + ": " + user.name + " - " + user.pass);
};