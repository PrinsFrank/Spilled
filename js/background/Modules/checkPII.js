import takeFingerPrint from "./fingerprint.js";
import PIIfingerprints from "./fingerprints/PII.js";
import { isValidJSON } from "./formatConversion.js";

let linkedPIIFingerPrints = PIIfingerprints.linked;
let linkablePIIFingerPrints = PIIfingerprints.linkable;

export default function PIIpresent(name, value) {
  let normalizedName = takeFingerPrint(name);
  let presentPII = {};

  if (isLinkedPII(name)) {
    presentPII[normalizedName] = {
      type: "linked",
      context: "name",
      value: value
    };
  }

  if (isLinkablePII(name)) {
    presentPII[normalizedName] = {
      type: "linkable",
      context: "name",
      value: value
    };
  }

  if (isValidJSON(value)) {
    let parsedJSON = JSON.parse(value);
    if (parsedJSON === null) {
      return;
    }
    Object.keys(parsedJSON).forEach(key => {
      let normalizedName = takeFingerPrint(key);
      let value = parsedJSON[key];
      if (isLinkedPII(key)) {
        presentPII[normalizedName] = {
          type: "linked",
          context: "json-value",
          value: value
        };
      }
      if (isLinkablePII(key)) {
        presentPII[normalizedName] = {
          type: "linkable",
          context: "json-value",
          value: value
        };
      }
      showConsoleInfoIfNotFound(key, value);
    });
  } else {
    showConsoleInfoIfNotFound(name, value);
  }

  return presentPII;
}

function isLinkedPII(str) {
  return linkedPIIFingerPrints.indexOf(takeFingerPrint(str)) > -1;
}

function isLinkablePII(str) {
  return linkablePIIFingerPrints.indexOf(takeFingerPrint(str)) > -1;
}

// @TODO: Remove temp debugging function
function showConsoleInfoIfNotFound(name, value) {
  if (!isLinkedPII(name) && !isLinkablePII(name)) {
    // console.log(name + " is not in fingerprint file %c" + value, "color: red;");
  }
}
