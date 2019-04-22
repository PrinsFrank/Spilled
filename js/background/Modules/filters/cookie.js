import { extractRecursively, isMeaningfulData } from "../formatConversion.js";

var API = chrome || browser;

export default function parseCookiesForTab(tab, callback) {
  if (isOverviewTab(tab)) {
    parseAllCookies(callback, tab);
  }
  const domain = getCleanDomainFromTab(tab);
  if (!domainShouldBeChecked(domain)) {
    return false;
  }
  parseCookiesForDomain(domain, callback, tab);
}

function parseAllCookies(callback, tab) {
  API.cookies.getAll({}, cookies => {
    callback(tab.id, parseCookies(cookies));
  });
}

function parseCookiesForDomain(domain, callback, tab) {
  API.cookies.getAll({ domain }, cookies => {
    callback(tab.id, parseCookies(cookies));
  });
}

function parseCookies(cookies) {
  const collectedMessages = {};
  if (!cookies.length) {
    return collectedMessages;
  }
  cookies.forEach(cookie => {
    if (typeof collectedMessages[cookie.domain] === "undefined") {
      collectedMessages[cookie.domain] = {};
    }
    collectedMessages[cookie.domain][cookie.name] = parseCookie(cookie);
  });
  return collectedMessages;
}

function parseCookie(cookie) {
  let extractedValue = extractRecursively(cookie.value);
  let parsedCookieInfo = {
    warnings: {},
    value: cookie.value
  };

  if (isMeaningfulData(cookie.value) !== false) {
    parsedCookieInfo.value = isMeaningfulData(cookie.value);
    parsedCookieInfo.warnings.data_readable = "There is readable data present";
  }
  if (
    extractedValue !== isMeaningfulData(cookie.value) &&
    isMeaningfulData(extractedValue) !== false
  ) {
    parsedCookieInfo.value = isMeaningfulData(extractedValue);
    parsedCookieInfo.warnings.data_extractable =
      "There is extractable data present";
  }

  return parsedCookieInfo;
}

function isOverviewTab(tab) {
  return (
    tab.url.startsWith("moz-extension://") ||
    tab.url.startsWith("chrome-extension://")
  );
}

function domainShouldBeChecked(domain) {
  return domain !== "";
}

function getCleanDomainFromTab(tab) {
  return getCleanDomain(new URL(tab.url).hostname);
}

function getCleanDomain(domain) {
  // converts www.example.com to example.com but returns example.co.uk
  const regexVar = new RegExp(/([^.]*\.(([^.]{0,2}\.[^.]{0,2})|([^.]*)))$/g);
  const result = domain.match(regexVar);
  if (result === null) {
    return "";
  }

  return result[0];
}
