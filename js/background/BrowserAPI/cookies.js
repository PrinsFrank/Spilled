import {
  isOverviewTab,
  getCleanDomainFromTab,
  domainShouldBeChecked,
  parseCookies
} from "../Modules/filters/cookie.js";

var API = chrome || browser;

export default function parseCookiesForTab(tab, callback) {
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
