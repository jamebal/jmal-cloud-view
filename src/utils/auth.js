import Cookies from 'js-cookie'

const tokenKey = 'jmal-token'
const usernameKey = 'username'
const shareTokenKey = 'share-token'
const shareIdKey = 'shareId'
const consumerId = 'consumerId'
const rememberName = 'rememberName'

export function getRememberName() {
  return Cookies.get(rememberName)
}

export function removeRememberName() {
  return Cookies.remove(rememberName)
}

export function getToken() {
  return Cookies.get(tokenKey)
}

export function getUsername() {
  return Cookies.get(usernameKey)
}

export function getShareToken() {
  return Cookies.get(shareTokenKey)
}

export function getShareId() {
  return Cookies.get(shareIdKey)
}

export function setShareToken(token, shareId) {
  Cookies.set(shareTokenKey, token)
  Cookies.set(shareIdKey, shareId)
}

export function removeToken() {
  Cookies.remove(tokenKey)
  Cookies.remove(usernameKey)
}

export function removeShareToken() {
   Cookies.remove(shareTokenKey)
  Cookies.remove(shareIdKey)
}

export function getConsumerId() {
  return Cookies.get(consumerId)
}

export function removeConsumerId() {
  return Cookies.remove(consumerId)
}
