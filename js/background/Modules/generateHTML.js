export function getHTMLListFromMessages(domains) {
  let messageHtml = "";
  Object.keys(domains).forEach(domain => {
    let messageForDomain = "";
    let cookiesForDomain = domains[domain];
    Object.keys(cookiesForDomain).forEach(cookieName => {
      let cookie = cookiesForDomain[cookieName];
      let warnings = cookie.warnings;
      if (Object.keys(warnings).length <= 0) {
        return;
      }
      messageForDomain += "<h3>Cookie: " + cookieName + "</h3>";
      Object.keys(warnings).forEach(warningKey => {
        messageForDomain +=
          '<li class="warning ' +
          warningKey +
          '">' +
          warnings[warningKey] +
          "</li>";
      });
    });
    if (messageForDomain !== "") {
      messageHtml += "<h2>Cookies for domain: " + domain + "</h2>";
      messageHtml += messageForDomain;
    }
  });
  return messageHtml;
}
