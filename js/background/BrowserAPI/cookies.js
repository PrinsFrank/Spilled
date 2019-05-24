import {
  getCleanDomainFromTab,
  domainShouldBeChecked,
  parseCookies
} from "../Modules/filters/cookie.js";
import { isExampleOverview, isOverviewTab } from "../Modules/tab.js";

var API = chrome || browser;

export default function parseCookiesForTab(tab, callback) {
  if (isExampleOverview(tab)) {
    parseExampleCookies(tab, callback);
    return;
  }
  if (isOverviewTab(tab)) {
    parseAllCookies(tab, callback);
    return;
  }
  const domain = getCleanDomainFromTab(tab);
  if (!domainShouldBeChecked(domain)) {
    callback(tab.id, false);
    return;
  }
  parseCookiesForDomain(domain, tab, callback);
}

function parseAllCookies(tab, callback) {
  API.cookies.getAll({}, cookies => {
    callback(tab.id, parseCookies(cookies));
  });
}

function parseCookiesForDomain(domain, tab, callback) {
  API.cookies.getAll({ domain }, cookies => {
    callback(tab.id, parseCookies(cookies));
  });
}

function parseExampleCookies(tab, callback) {
  let parsedCookies = parseCookies([
    {
      name: "info",
      httpOnly: true,
      secure: false,
      domain: "example.com",
      value:
        "eyJuYW1lIjoidXNlciBuYW1lIiwgImRhdGVfb2ZfYmlydGgiOiAiMjAwMC0wMS0wMSJ9"
    },
    {
      name: "password",
      httpOnly: true,
      secure: false,
      domain: "example.com",
      value: "password123!"
    },
    {
      name: "ou4EO9Fu",
      httpOnly: true,
      secure: false,
      domain: ".example.com",
      value:
        "eyJuYW1lIjoidXNlciBuYW1lIiwgInBhc3N3b3JkIjogInBhc3N3b3JkIiwiU1NOIjoiMTIzNDU2Nzg5MCJ9"
    }
  ]);
  callback(tab.id, parsedCookies);
}
