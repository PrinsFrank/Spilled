export function isExampleOverview(tab) {
  return isOverviewTab(tab) && tab.url.endsWith("?example_content=true");
}

export function isOverviewTab(tab) {
  return (
    tab.url.startsWith("moz-extension://") ||
    tab.url.startsWith("chrome-extension://")
  );
}
