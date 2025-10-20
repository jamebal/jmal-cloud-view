function isEncoded(str) {
  return /%[0-9A-Fa-f]{2}/.test(str);
}

export function encodeIfNeeded(str) {
  if (isEncoded(str)) {
    return str;
  } else {
    return encodeURIComponent(str);
  }
}

// 判断字符串是否为路径
export function isPath(str) {
  return typeof str === 'string' && str.includes('/');
}
