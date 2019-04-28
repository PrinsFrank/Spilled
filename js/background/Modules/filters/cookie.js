import { extractRecursively, isMeaningfulData } from "../formatConversion.js";
import PIIpresent from "../checkPII.js";

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

  let meaningfulData = isMeaningfulData(cookie.value);
  if (meaningfulData !== false) {
    parsedCookieInfo.value = meaningfulData;
    parsedCookieInfo.warnings.data_readable = "There is readable data present";
  }
  meaningfulData = isMeaningfulData(extractedValue);
  if (extractedValue !== meaningfulData && meaningfulData !== false) {
    parsedCookieInfo.value = meaningfulData;
    parsedCookieInfo.warnings.data_extractable =
      "There is extractable data present";
  }

  let presentPII = PIIpresent(cookie.name, extractedValue);
  if (presentPII !== false && typeof presentPII !== "undefined") {
    Object.keys(presentPII).forEach(name => {
      let data = presentPII[name];
      parsedCookieInfo.warnings["pii_present_" + name] =
        data.type +
        " PII found in " +
        data.context +
        ' with key "' +
        name +
        '" : <b>' +
        data.value +
        "</b>";
    });
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
