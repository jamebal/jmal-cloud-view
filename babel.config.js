// https://www.babeljs.cn/
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant'],
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }]
  ]
}
