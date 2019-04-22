export function getHTMLListFromMessages(domains) {
  let messageHtml = "";
  Object.keys(domains).forEach(domain => {
    messageHtml += "<h2>Cookies for domain: " + domain + "</h2>";

    let cookiesForDomain = domains[domain];
    Object.keys(cookiesForDomain).forEach(cookieName => {
      messageHtml += "<h3>Cookie: " + cookieName + "</h3>";
      let cookie = cookiesForDomain[cookieName];
      let warnings = cookie.warnings;
      if (Object.keys(warnings).length <= 0) {
        return;
      }

      Object.keys(warnings).forEach(warningKey => {
        messageHtml +=
          '<li class="warning ' +
          warningKey +
          '">' +
          warnings[warningKey] +
          "</li>";
      });

      messageHtml += "<br><samp>" + cookie.value + "</samp>";
    });
  });
  return messageHtml;
}
