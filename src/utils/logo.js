import fileConfig from "@/utils/file-config";

const titleKey = 'netdisk-name'

const logoKey = 'netdisk-logo'

const loginBackgroundUrlKey = 'login-background-url'

export function getLogoName() {
  return localStorage.getItem(titleKey)
}

export function getLogo() {
  return localStorage.getItem(logoKey)
}

export function getLoginBackgroundUrl() {
  return localStorage.getItem(loginBackgroundUrlKey)
}

export function setLoginBackgroundUrl(url) {
  localStorage.setItem(loginBackgroundUrlKey, url)
}

export function setLogo(logoName, logo) {
  localStorage.setItem(titleKey, logoName)
  localStorage.setItem(logoKey, logo)
  setFavicon()
}

export function removeLogo() {
  localStorage.removeItem(titleKey)
  localStorage.removeItem(logoKey)
}

export function setFavicon() {
  const logo = getLogo()
  if (logo && logo !== 'undefined') {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = fileConfig.logoUrl(logo)
    document.getElementsByTagName('head')[0].appendChild(link)
  }
}
