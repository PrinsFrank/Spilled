import updateBadgeForTabAndMessages from "./BrowserAPI/badge.js";
import parseCookiesForTab from "./BrowserAPI/cookies.js";

var API = chrome || browser;

API.tabs.onUpdated.addListener(tabUpdated);

API.runtime.onInstalled.addListener(async ({ reason }) => {
  switch (reason) {
    case "install":
      onboard();
      break;
    case "update":
      upboard();
      break;
  }
});

function tabUpdated(tabId) {
  API.tabs.get(tabId, tab => {
    if (tab.url.startsWith("moz-extension://")) {
      API.browserAction.disable(tab.id);
    }
    parseCookiesForTab(tab, updateBadgeForTabAndMessages);
  });
}

async function onboard() {
  const url = API.runtime.getURL("views/onboard.html");
  await API.tabs.create({ url });
}

async function upboard() {
  const url = API.runtime.getURL("CHANGELOG.md");
  await API.tabs.create({ url });
}
