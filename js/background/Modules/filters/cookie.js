import { extractRecursively, getMeaningfulData } from "../formatConversion.js";
import { PIIpresent } from "../checkPII.js";

export function parseCookies(cookies) {
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

export function parseCookie(cookie) {
  let extractedValue = extractRecursively(cookie.value);
  let parsedCookieInfo = {
    warnings: {},
    value: cookie.value
  };

  let meaningfulData = getMeaningfulData(cookie.value);
  if (meaningfulData !== false) {
    parsedCookieInfo.value = meaningfulData;
    parsedCookieInfo.warnings.data_readable = "There is readable data present";
  }

  let meaningfulExtractedData = getMeaningfulData(extractedValue);
  if (
    meaningfulExtractedData !== meaningfulData &&
    meaningfulExtractedData !== false
  ) {
    parsedCookieInfo.value = meaningfulExtractedData;
    parsedCookieInfo.warnings.data_extractable =
      "There is extractable data present";
  }

  let presentPII = PIIpresent(cookie.name, extractedValue);
  if (typeof presentPII !== "undefined" && Object.keys(presentPII).length) {
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

export function isOverviewTab(tab) {
  return (
    tab.url.startsWith("moz-extension://") ||
    tab.url.startsWith("chrome-extension://")
  );
}

export function domainShouldBeChecked(domain) {
  return domain !== "";
}

export function getCleanDomainFromTab(tab) {
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
