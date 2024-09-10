// 使用 require.context 动态加载 locales 目录中的语言文件

export function loadLocaleMessages() {
  const locales = require.context('@/locales', true, /\.js$/)

  return locales.keys().reduce((messages, key) => {
    // 获取语言文件的默认导出
    const locale = locales(key).default

    // 根据文件名推断语言代码，比如将 `en_US.js` 解析为 `en_US`
    const localeKey = key.match(/([a-zA-Z_]+)\./i)[1]

    // 添加到 messages 对象
    messages[localeKey] = locale
    return messages
  }, {})
}

export function getBrowserLanguage() {
  const browserLanguage = navigator.language || navigator.userLanguage
  return browserLanguage.replace('-', '_')
}

// 获取浏览器语言，判断是否支持，返回相应语言代码
export function getBrowserLocale(messages, fallbackLocale = 'en_US') {
  return Object.keys(messages).includes(getBrowserLanguage()) ? getBrowserLanguage() : fallbackLocale
}
