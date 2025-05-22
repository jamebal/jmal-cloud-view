function isEncoded(str) {
  return /%[0-9A-Fa-f]{2}/.test(str);
}

export function encodeIfNeeded(str) {
  if (isEncoded(str)) {
    return str;
  } else {
    return encodeURI(str);
  }
}
