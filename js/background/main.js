import updateBadgeForTabAndMessages from "./Modules/badge.js";
import parseCookiesForTab from "./Modules/filters/cookie.js";

browser.tabs.onUpdated.addListener(tabUpdated);

function tabUpdated(tabId) {
  browser.tabs.get(tabId, tab => {
    if (tab.url.startsWith("moz-extension://")) {
      browser.browserAction.disable(tab.id);
    }
    parseCookiesForTab(tab, updateBadgeForTabAndMessages);
  });
}
