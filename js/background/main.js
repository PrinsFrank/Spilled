import updateBadgeForTabAndMessages from "./Modules/badge.js";
import parseCookiesForTab from "./Modules/filters/cookie.js";

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
