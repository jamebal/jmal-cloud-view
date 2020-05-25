import Cookies from 'js-cookie'

const TokenKey = 'jmal_token'
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
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
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
