import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    console.log('title', title)
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
