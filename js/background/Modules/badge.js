export function getText(count) {
  return count.toString();
}

export function getColor(count) {
  if (count <= 0) {
    return "#20FDC3";
  }

  if (count <= 5) {
    return "#EBE13D";
  }

  return "#E03C37";
}

export function getCountFromMessages(domains) {
  let count = 0;
  Object.keys(domains).forEach(domain => {
    let cookiesForDomain = domains[domain];
    Object.keys(cookiesForDomain).forEach(cookieName => {
      let warnings = cookiesForDomain[cookieName].warnings;
      count += Object.keys(warnings).length;
    });
  });
  return count;
}
