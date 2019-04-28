import { getColor, getCountFromMessages, getText } from "../Modules/badge.js";

var API = chrome || browser;

export default function updateBadgeForTabAndMessages(tabId, messages) {
  const count = getCountFromMessages(messages);
  API.browserAction.setBadgeText({
    text: getText(count),
    tabId
  });
  API.browserAction.setBadgeBackgroundColor({
    color: getColor(count),
    tabId
  });
}
