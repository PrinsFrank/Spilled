/*global require, __dirname */

const puppeteer = require("puppeteer");
const extensionPath = require("path").join(__dirname, "../");
const browserSettings = {
  headless: false, // extension are allowed only in head-full mode
  defaultViewport: {
    width: 1280,
    height: 800
  },
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`
  ]
};
var page;
var extensionID;

(async () => {
  browser = await puppeteer.launch(browserSettings);
  page = await browser.newPage();
  await getExtensionID(browser);

  await takeScreenshot(`views/overview.html`, `no_results`);
  await takeScreenshot(
    `views/overview.html?example_content=true`,
    `example_overview`
  );
  await takeScreenshot(`views/onboard.html`, `onboarding`);

  await browser.close();
})();

async function takeScreenshot(path, name) {
  await page.goto(`chrome-extension://${extensionID}/${path}`);
  await page.screenshot({ path: `build/screenshot/1280_800_${name}.png` });
}

async function getExtensionID() {
  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return _targetInfo.title === "Spilled";
  });
  const extensionUrl = extensionTarget._targetInfo.url || "";
  [, , extensionID] = extensionUrl.split("/");
}
