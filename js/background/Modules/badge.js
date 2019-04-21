export default function updateBadgeForTabAndMessages(tabId, messages) {
  const count = getCountFromMessages(messages);
  browser.browserAction.setBadgeText({
    text: getText(count),
    tabId
  });
  browser.browserAction.setBadgeBackgroundColor({
    color: getColor(count),
    tabId
  });
}

function getText(count) {
  if (count.error <= 0 && count.warning <= 0) {
    return "";
  }
  if (count.error <= 0) {
    return count.warning.toString();
  }
  return count.warning > 0
    ? `${count.error.toString()}+`
    : count.error.toString();
}

function getColor(count) {
  if (count.error <= 0 && count.warning <= 0) {
    return "#20FDC3";
  }
  return count.error > 0 ? "#E03C37" : "#EBE13D";
}

function getCountFromMessages(messages) {
  return {
    warning: Object.keys(messages.warning).length,
    error: Object.keys(messages.error).length
  };
}
