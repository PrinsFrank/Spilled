import parseCookiesForTab from "./background/BrowserAPI/cookies.js";
import {
  getHTMLListFromMessages,
  getHTMLNoContent
} from "./background/Modules/generateHTML.js";

var API = chrome || browser;

const messageContainer = document.getElementById("message-container");

function updateMessageContent(tabId, messages) {
  let content;

  if (messages !== false && Object.keys(messages).length > 0) {
    content = getHTMLListFromMessages(messages);
  } else {
    content = getHTMLNoContent();
  }

  while (messageContainer.firstChild) {
    messageContainer.removeChild(messageContainer.firstChild);
  }
  messageContainer.appendChild(content);
}

API.tabs.query({ currentWindow: true, active: true }, tab => {
  parseCookiesForTab(tab[0], updateMessageContent);
});
