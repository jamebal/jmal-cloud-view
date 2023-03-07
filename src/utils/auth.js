import Cookies from 'js-cookie'

const tokenKey = 'jmal_token'
const shareTokenKey = 'share-token'
const consumerId = 'consumerId'
const rememberName = 'rememberName'

export function getRememberName() {
  return Cookies.get(rememberName)
}

export function setRememberName(username) {
  return Cookies.set(rememberName, username)
}

export function removeRememberName() {
  return Cookies.remove(rememberName)
}

export function getToken() {
  return Cookies.get(tokenKey)
}

export function getShareToken() {
  return Cookies.get(shareTokenKey)
}

export function setShareToken(token) {
  return Cookies.set(shareTokenKey, token)
}

export function setToken(token) {
  return Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}

export function removeShareToken() {
  return Cookies.remove(shareTokenKey)
}

export function getConsumerId() {
  return Cookies.get(consumerId)
}

export function setConsumerId(userId) {
  return Cookies.set(consumerId, userId)
}

export function removeConsumerId() {
  return Cookies.remove(consumerId)
}
