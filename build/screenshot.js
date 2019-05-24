/*global require, __dirname */

const puppeteer = require("puppeteer");
const extensionPath = require("path").join(__dirname, "../");

(async () => {
  browser = await puppeteer.launch({
    headless: false, // extension are allowed only in head-full mode
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });

  // We need to open a blank page to load the extension
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 800 });

  // Get extensionId
  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return _targetInfo.title === "Spilled";
  });
  const extensionUrl = extensionTarget._targetInfo.url || "";
  const [, , extensionID] = extensionUrl.split("/");

  await page.goto(`chrome-extension://${extensionID}/views/overview.html`);

  await page.screenshot({ path: "build/screenshot/1280_800_no_results.png" });

  await browser.close();
})();
