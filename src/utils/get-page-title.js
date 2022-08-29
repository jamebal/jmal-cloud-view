import defaultSettings from '@/settings'

import { getLogoName } from '@/utils/logo'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  let logoName = getLogoName()
  if (!logoName || logoName === 'undefined') {
    logoName = title
  }
  if (pageTitle) {
    return `${pageTitle} - ${logoName}`
  }
  return `${logoName}`
}
