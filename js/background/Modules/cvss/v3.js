import cookieExploits from "../exploits/cookie.js";

export function getScoreNonHTTPSAdjacentNetwork(linked = false) {
  if (linked) {
    return { mitm_adjacent: cookieExploits.mitm_adjacent.scores.linked };
  }
  return { mitm_adjacent: cookieExploits.mitm_adjacent.scores.linkable };
}

export function getScoreNonHTTPOnlyXSS(linked = false) {
  if (linked) {
    return { xss_non_httponly: cookieExploits.xss_non_httponly.scores.linked };
  }
  return { xss_non_httponly: cookieExploits.xss_non_httponly.scores.linkable };
}

export function getScoreNonExploitable() {
  return { none: 0 };
}
