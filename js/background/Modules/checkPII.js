import takeFingerPrint from "./fingerprint.js";
import PIIfingerprints from "./fingerprints/PII.js";
import { isValidJSON } from "./formatConversion.js";

let linkedPIIFingerPrints = PIIfingerprints.linked;
let linkablePIIFingerPrints = PIIfingerprints.linkable;

export function getPIIpresent(name, value) {
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
      return {};
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
    });
  }

  return presentPII;
}

function isLinkedPII(str) {
  let keyFingerPrint = takeFingerPrint(str);
  if (linkedPIIFingerPrints.hasOwnProperty(keyFingerPrint)) {
    return true;
  }
}

function isLinkablePII(str) {
  let keyFingerPrint = takeFingerPrint(str);
  if (linkablePIIFingerPrints.hasOwnProperty(keyFingerPrint)) {
    return true;
  }
}
