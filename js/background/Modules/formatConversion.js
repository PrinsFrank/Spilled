export function extractRecursively(value, depth = 0) {
  // Check if our totem is spinning
  if (depth >= 10) {
    return value;
  }
  let extractedValue = value; // Make a copy so we can test if this value is changed later

  // The data in these types are resolved so we can return them formatted
  if (isMeaningfulData(value)) {
    return isMeaningfulData(value);
  }

  // Convert the data
  if (isValidBase64(value)) {
    extractedValue = base64ToString(value);
  }

  // Check if this step didn't resolve anything so we have our final value
  if (extractedValue === value) {
    return extractedValue;
  }
  depth++;
  return extractRecursively(extractedValue, depth);
}

export function isMeaningfulData(value) {
  if (isValidBool(value)) {
    return booleanToString(value);
  }
  if (isValidTimeStamp(value)) {
    return timeStampToString(value);
  }
  if (isValidTimeStampWithOutMillis(value)) {
    return timeStampWithOutMillisToString(value);
  }
  if (isValidJSON(value)) {
    return value;
  }
  if (isReadableString(value)) {
    return value;
  }
  return false;
}

export function isValidJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function isValidBool(str) {
  return str === "1" || str === "0" || str === "true" || str === "false";
}

function isValidBase64(str) {
  if (str === "" || str.trim() === "") {
    return false;
  }
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

function isValidTimeStamp(str) {
  let dateFromString = new Date(str);
  if (isNaN(dateFromString.getTime())) {
    dateFromString = new Date(parseInt(str));
    if (isNaN(dateFromString.getTime())) {
      return false;
    }
  }
  let tenYearsAgo = new Date(
    new Date().setFullYear(new Date().getFullYear() - 10)
  );
  let inTenYears = new Date(
    new Date().setFullYear(new Date().getFullYear() + 10)
  );
  return dateFromString >= tenYearsAgo && dateFromString <= inTenYears;
}

function isValidTimeStampWithOutMillis(str) {
  return isValidTimeStamp(str * 1000);
}

function isReadableString(str) {
  return /^[A-z0-9]$/.test(str);
}
function base64ToString(base64) {
  return atob(base64);
}

function timeStampToString(str) {
  let dateFromString = new Date(str);
  if (isNaN(dateFromString.getTime())) {
    dateFromString = new Date(parseInt(str));
  }
  return dateFromString.toString();
}

function timeStampWithOutMillisToString(str) {
  return timeStampToString(str * 1000);
}

function booleanToString(value) {
  return value === "1" || value === "true" ? "true" : false;
}
