import parseCookiesForTab from "./background/BrowserAPI/cookies.js";
import { getHTMLListFromMessages } from "./background/Modules/generateHTML.js";

var API = chrome || browser;

const messageContainer = document.getElementById("message-container");

function updateMessageContent(tabId, messages) {
  if (messages === false || Object.keys(messages).length === 0) {
    messageContainer.innerHTML =
      "<li>No Information available for this domain</li>";
    return;
  }

  messageContainer.innerHTML = getHTMLListFromMessages(messages);
}

API.tabs.query({ currentWindow: true, active: true }, tab => {
  parseCookiesForTab(tab[0], updateMessageContent);
});
