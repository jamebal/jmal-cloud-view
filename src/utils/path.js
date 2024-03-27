import Cookies from 'js-cookie'

const pathKey = 'user-select-path'

const pathListKey = 'user-select-path-list'

export function getPath() {
  const res = Cookies.get(pathKey)
  if (!res || res === 'undefined') {
    return ''
  } else {
    return res
  }
}

export function getPathList() {
  return Cookies.get(pathListKey)
}

export function setPath(path, pathList) {
  Cookies.set(pathListKey, pathList)
  return Cookies.set(pathKey, path)
}

export function removePath() {
  Cookies.remove(pathListKey)
  return Cookies.remove(pathKey)
}

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
