export default function takeFingerPrint(key) {
  return normalizeString(key);
}

// So we don't have to add multiple variants to the fingerprint file (firstname and first_name FE)
function normalizeString(str) {
  return str.replace(/[_\-.]/g, "").toLowerCase();
}
