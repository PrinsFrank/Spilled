import parseCookiesForTab from "./background/Modules/filters/cookie.js";
import { getHTMLListFromMessages } from "./background/Modules/generateHTML.js";

const messageContainer = document.getElementById("message-container");

function updateMessageContent(tabId, messages) {
  messageContainer.innerHTML =
    getHTMLListFromMessages(messages.error) +
    getHTMLListFromMessages(messages.warning);
}

browser.tabs.query({ currentWindow: true, active: true }, tab => {
  parseCookiesForTab(tab[0], updateMessageContent);
});
