export function getHTMLListFromMessages(domains) {
  let content = document.createElement("ul");
  Object.keys(domains).forEach(domain => {
    let hasMessages = false;
    let messagesForDomain = document.createElement("ul");
    let cookiesForDomain = domains[domain];
    Object.keys(cookiesForDomain).forEach(cookieName => {
      let cookie = cookiesForDomain[cookieName];
      let warnings = cookie.warnings;
      if (Object.keys(warnings).length <= 0) {
        return;
      }
      hasMessages = true;
      let textNode = document.createTextNode("Cookie: " + cookieName);
      let cookieTitle = document.createElement("h3");
      cookieTitle.appendChild(textNode);
      messagesForDomain.appendChild(cookieTitle);
      Object.keys(warnings).forEach(warningKey => {
        let textNode = document.createTextNode(warnings[warningKey]);
        let listItem = document.createElement("li");
        listItem.appendChild(textNode);
        messagesForDomain.appendChild(listItem);
      });
    });
    if (hasMessages) {
      let textNode = document.createTextNode("Cookies for domain: " + domain);
      let domainTitle = document.createElement("h2");
      domainTitle.appendChild(textNode);
      content.appendChild(domainTitle);
      content.appendChild(messagesForDomain);
    }
  });
  return content;
}

export function getHTMLNoContent() {
  let content = document.createElement("ul");
  let listItem = document.createElement("li");
  let textNode = document.createTextNode(
    "No Information available for this domain"
  );

  listItem.appendChild(textNode);
  content.appendChild(listItem);

  return content;
}
