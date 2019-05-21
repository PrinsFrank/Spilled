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
To following commands are available (in PHPstorm avaible with alt+f11):
```
npm run lint
npm run fix
npm run test
```

# Install temporary Extension (Recommended)

## Firefox
- Go to [about:debugging](about:debugging).
- Click on "Load temporary Add-on...".
- Navigate to the local folder where this repo is present and select the manifest.json file.

## Chrome
- Go to [chrome://extensions/](chrome://extensions/).
- Enable "Developer mode" in the thop right hand corner.
- Click on "Load extracted extension".
- Navigate to the directory __above__ where this repo is present.
- Click on the folder, and subsequently click on "Select folder".

# Install permanent extension
I don't recommend installing any permanent extension, but for your convenience and to prevent fake copies i submitted this extension to the chrome(pending review) and Firefox store.

[![Download for Firefox](./icons/firefox_addon.png)](https://addons.mozilla.org/en-US/firefox/addon/spilled/)