import { extractRecursively, isMeaningfulData } from "../formatConversion.js";

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
  browser.cookies.getAll({}, cookies => {
    callback(tab.id, parseCookies(cookies));
  });
}

function parseCookiesForDomain(domain, callback, tab) {
  browser.cookies.getAll({ domain }, cookies => {
    callback(tab.id, parseCookies(cookies));
  });
}

function parseCookies(cookies) {
  const collectedMessages = { warning: {}, error: {} };
  if (!cookies.length) {
    return collectedMessages;
  }
  cookies.forEach(cookie => {
    const messageForCookie = parseCookie(cookie);
    if (messageForCookie !== false) {
      collectedMessages[messageForCookie.type][
        messageForCookie.key
      ] = messageForCookie;
    }
  });
  return collectedMessages;
}

function parseCookie(cookie) {
  if (isMeaningfulData(cookie.value) !== false) {
    return {
      key: `data-readable-${cookie.name}`,
      type: "warning",
      text: `There is readable data present in <b>cookie</b> "<i>${
        cookie.name
      }</i>" set for domain: "<i>${cookie.domain}</i>"`,
      data: isMeaningfulData(cookie.value)
    };
  }
  const extractedValue = extractRecursively(cookie.value);
  if (
    extractedValue !== cookie.value &&
    isMeaningfulData(extractedValue) !== false
  ) {
    return {
      key: `data-extractable-${cookie.name}`,
      type: "error",
      text: `There is extractable data present in <b>cookie</b> "<i>${
        cookie.name
      }</i>" set for domain: "<i>${cookie.domain}</i>"`,
      data: isMeaningfulData(extractedValue)
    };
  }
  return false;
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