# Spilled
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Detects Data in cookies and on web pages that probably shouldn't be there

# colors and style
Color: #2C1B3D

Extra color 1: #AA225A

Secondary color: #E03C37

Extra color 2: #EBE13D

Tertiary color: #20FDC3

# Development
To initialize npm, run:
```
npm install
```
To following commands are available (in PhpStorm available with alt+F11):

`npm run build` Runs all tests and builds on success to `build/extension/spilled-{VERSION}.zip` <br>
`npm run pre-commit` Runs all tests before commit <br>
`npm run fix:js` Fixes JS <br>
`npm run generate:screenshots` Takes screenshots of viewport in Chrome <br>
`npm run lint:js` Checks JS files <br>
`npm run lint:web-ext` Checks for web-ext errors <br>
`npm run run:firefox` Runs in Firefox <br>
`npm run test` Run tests <br>

# Install temporary Extension (Recommended)

## Firefox
- Go to [about:debugging](about:debugging).
- Click on "Load temporary Add-on...".
- Navigate to the local folder where this repo is present and select the manifest.json file.

## Chrome
- Go to [chrome://extensions/](chrome://extensions/).
- Enable "Developer mode" in the top right hand corner.
- Click on "Load extracted extension".
- Navigate to the directory __above__ where this repo is present.
- Click on the folder, and subsequently click on "Select folder".

# Install permanent extension
I don't recommend installing any permanent extension, but for your convenience and to prevent fake copies i submitted this extension to the Chrome and Firefox store.

[![Download for Firefox](./icons/firefox_addon.png)](https://addons.mozilla.org/en-US/firefox/addon/spilled/)
[![Download for Chrome](./icons/chrome_addon.png)](https://chrome.google.com/webstore/detail/spilled/eemcjnefigpbpofkmbidicimickmokch)