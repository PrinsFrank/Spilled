export function getHTMLListFromMessages(domains) {
  let warningHtml = "";
  let messageHtml = "";
  Object.keys(domains).forEach(domain => {
    let messageForDomain = "";
    let highestScoreForDomain = 0;
    let cookiesForDomain = domains[domain];
    Object.keys(cookiesForDomain).forEach(cookieName => {
      let cookie = cookiesForDomain[cookieName];
      let warnings = cookie.warnings;
      let score = getHighestScoreForCookie(cookie);
      if (Object.keys(warnings).length <= 0) {
        return;
      }
      if (score > highestScoreForDomain) {
        highestScoreForDomain = score;
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
      if (highestScoreForDomain > 0) {
        warningHtml += "<h2>Cookies for domain: " + domain + "</h2>";
        warningHtml += messageForDomain;
      } else {
        messageHtml += "<h2>Cookies for domain: " + domain + "</h2>";
        messageHtml += messageForDomain;
      }
    }
  });
  return warningHtml + messageHtml;
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
