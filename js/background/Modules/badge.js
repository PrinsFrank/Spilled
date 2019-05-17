export function getText(score) {
  return score.toString();
}

export function getColor(score) {
  if (score <= 0) {
    return "#20FDC3";
  }

  if (score <= 5) {
    return "#EBE13D";
  }

  return "#E03C37";
}

export function getHighestScoreFromMessagesForDomain(domains) {
  let highestScore = 0;
  if (domains === false || Object.keys(domains).length === 0) {
    return highestScore;
  }
  Object.keys(domains).forEach(domain => {
    let cookiesForDomain = domains[domain];
    Object.keys(cookiesForDomain).forEach(cookieName => {
      let scoresForCookie = cookiesForDomain[cookieName].score;
      Object.keys(scoresForCookie).forEach(cookieScore => {
        if (scoresForCookie[cookieScore] > highestScore) {
          highestScore = scoresForCookie[cookieScore];
        }
      });
    });
  });
  return highestScore;
}
