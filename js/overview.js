import parseCookiesForTab from "./background/Modules/filters/cookie.js";
import { getHTMLListFromMessages } from "./background/Modules/generateHTML.js";

var API = chrome || browser;

const messageContainer = document.getElementById("message-container");

function updateMessageContent(tabId, messages) {
  messageContainer.innerHTML =
    getHTMLListFromMessages(messages.error) +
    getHTMLListFromMessages(messages.warning);
}

API.tabs.query({ currentWindow: true, active: true }, tab => {
  parseCookiesForTab(tab[0], updateMessageContent);
});
