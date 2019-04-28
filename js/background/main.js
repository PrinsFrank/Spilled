import updateBadgeForTabAndMessages from "./BrowserAPI/badge.js";
import parseCookiesForTab from "./BrowserAPI/cookies.js";

var API = chrome || browser;

API.tabs.onUpdated.addListener(tabUpdated);

function tabUpdated(tabId) {
  API.tabs.get(tabId, tab => {
    if (tab.url.startsWith("moz-extension://")) {
      API.browserAction.disable(tab.id);
    }
    parseCookiesForTab(tab, updateBadgeForTabAndMessages);
  });
}
