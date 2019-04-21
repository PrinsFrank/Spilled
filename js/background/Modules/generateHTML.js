export function getHTMLListFromMessages(messages) {
  let messageHtml = "";
  Object.keys(messages).forEach(key => {
    const message = messages[key];
    messageHtml += `<li id="${key}" class="${message.type}">${
      message.text
    }<br><samp>${message.data}</samp></li>`;
  });
  return messageHtml;
}
