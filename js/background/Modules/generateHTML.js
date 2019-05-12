export function getHTMLListFromMessages(domains) {
  let messageHtml = "";
  Object.keys(domains).forEach(domain => {
    let messageForDomain = "";
    let cookiesForDomain = domains[domain];
    Object.keys(cookiesForDomain).forEach(cookieName => {
      let cookie = cookiesForDomain[cookieName];
      let warnings = cookie.warnings;
      let score = getHighestScoreForCookie(cookie);
      if (Object.keys(warnings).length <= 0) {
        return;
      }
      messageForDomain += "<h3>" + score + " Cookie: " + cookieName + "</h3>";
      Object.keys(warnings).forEach(warningKey => {
        messageForDomain +=
          '<li class="warning ' +
          warningKey +
          '">' +
          warnings[warningKey] +
          "</li>";
      });
      messageForDomain += "<br><samp>" + cookie.value + "</samp>";
    });
    if (messageForDomain !== "") {
      messageHtml += "<h2>Cookies for domain: " + domain + "</h2>";
      messageHtml += messageForDomain;
    }
  });
  return messageHtml;
}

function getHighestScoreForCookie(cookie) {
  let highestScore = 0;
  let scoresForCookie = cookie.score;
  Object.keys(scoresForCookie).forEach(cookieScore => {
    if (scoresForCookie[cookieScore] > highestScore) {
      highestScore = scoresForCookie[cookieScore];
    }
  });
  return highestScore;
}
