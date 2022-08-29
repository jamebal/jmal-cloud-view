import Cookies from 'js-cookie'
import fileConfig from "@/utils/file-config";
import getPageTitle from "@/utils/get-page-title";

const titleKey = 'netdisk-name'

const logoKey = 'netdisk-logo'

export function getLogoName() {
  return Cookies.get(titleKey)
}

export function getLogo() {
  return Cookies.get(logoKey)
}

export function setLogo(logoName, logo) {
  Cookies.set(titleKey, logoName)
  Cookies.set(logoKey, logo)
  setFavicon()
}

export function removeLogo() {
  Cookies.remove(titleKey)
  return Cookies.remove(logoKey)
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
