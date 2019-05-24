import { extractRecursively, getMeaningfulData } from "../formatConversion.js";
import { getPIIpresent } from "../checkPII.js";
import {
  getScoreNonHTTPOnlyXSS,
  getScoreNonHTTPSAdjacentNetwork,
  getScoreNonExploitable
} from "../cvss/v3.js";

export function parseCookies(cookies) {
  const collectedMessages = {};
  if (!cookies.length) {
    return collectedMessages;
  }
  cookies.forEach(cookie => {
    collectedMessages[cookie.domain] = collectedMessages[cookie.domain] || {};
    collectedMessages[cookie.domain][cookie.name] = parseCookie(cookie);
  });
  return collectedMessages;
}

export function parseCookie(cookie) {
  let extractedValue = extractRecursively(cookie.value);
  let parsedCookieInfo = {
    warnings: {},
    value: cookie.value,
    score: getScoreNonExploitable()
  };

  let meaningfulExtractedData = getMeaningfulData(extractedValue);
  if (
    meaningfulExtractedData !== cookie.value &&
    meaningfulExtractedData !== false
  ) {
    parsedCookieInfo.value = meaningfulExtractedData;
  }

  let presentPII = getPIIpresent(cookie.name, extractedValue);
  if (Object.keys(presentPII).length > 0) {
    Object.keys(presentPII).forEach(name => {
      let data = presentPII[name];
      parsedCookieInfo.warnings["pii_present_" + name] =
        data.type +
        " PII found in " +
        data.context +
        ' with key "' +
        name +
        '" : "' +
        data.value +
        '"';
      parsedCookieInfo.score = getCVSSScore(cookie, data.type);
    });
  }

  return parsedCookieInfo;
}

export function domainShouldBeChecked(domain) {
  return domain !== "";
}

export function getCleanDomainFromTab(tab) {
  return getCleanDomain(new URL(tab.url).hostname);
}

function getCVSSScore(cookie, PIIType) {
  let isLinked = PIIType === "linked";
  if (!cookie.httpOnly) {
    return getScoreNonHTTPOnlyXSS(isLinked);
  }
  if (!cookie.secure) {
    return getScoreNonHTTPSAdjacentNetwork(isLinked);
  }
  return getScoreNonExploitable();
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
