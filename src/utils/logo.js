import Cookies from 'js-cookie'

const titleKey = 'netdisk-name'

const logoKey = 'netdisk-logo'

export function getLogoName() {
  const res = Cookies.get(titleKey)
  return !res || res === 'undefined' ? res : 'jmalcloud'
}

export function getLogo() {
  const res = Cookies.get(logoKey)
  return !res || res === 'undefined' ? res : ''
}

export function setLogoName(logoName, logo) {
  Cookies.set(titleKey, logoName)
  return Cookies.set(logoKey, logo)
}

export function removeLogo() {
  Cookies.remove(titleKey)
  return Cookies.remove(logoKey)
}
