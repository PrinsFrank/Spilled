import {
  getColor,
  getHighestScoreFromMessagesForDomain,
  getText
} from "../Modules/badge.js";

var API = chrome || browser;

export default function updateBadgeForTabAndMessages(tabId, messages) {
  const score = getHighestScoreFromMessagesForDomain(messages);
  if (messages === false || Object.keys(messages).length === 0) {
    API.browserAction.disable(tabId);
    return;
  }
  if (score !== 0) {
    API.browserAction.setBadgeText({
      text: getText(score),
      tabId
    });
    API.browserAction.setBadgeBackgroundColor({
      color: getColor(score),
      tabId
    });
  }
}
