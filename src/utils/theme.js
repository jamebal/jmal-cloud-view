// utils/theme.js
import store from '@/store'

// 应用主题
export function applyTheme(theme) {
  const isDark = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  store.dispatch('updateTheme', theme)
}

// 应用用户主题设置
export function applyUserTheme(userTheme) {
  if (userTheme === 'auto') {
    // 如果用户选择跟随系统
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(isDark ? 'dark' : 'light')
  } else {
    // 应用用户指定的主题
    applyTheme(userTheme)
  }
}

// 获取用户主题设置（安全访问）
export function getUserTheme() {
  try {
    if (store.state.user &&
      store.state.user.userInfo &&
      store.state.user.userInfo.personalization) {
      return store.state.user.userInfo.personalization.theme || 'auto'
    }
    return 'auto'
  } catch (error) {
    console.error('获取用户主题失败:', error)
    return 'auto'
  }
}

// 初始化系统主题
export function initSystemTheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(isDark ? 'dark' : 'light')
}

// 设置系统主题监听器
export function setupSystemThemeListener() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const userTheme = getUserTheme()
    if (userTheme === 'auto') {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
}
