<template>
  <icon-font :type="type" />
</template>
<script>

import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2024484_64i0l9tj8gq.js'
})

// 把此段代码贴到iconfont项目页面的控制台中, 以获取图标列表

// const nodeArray = Array.from(document.querySelectorAll('.block-icon-list .icon-item .icon-code.icon-code-show'));
//  const iconNames = nodeArray.map(item => item.outerText.replace('icon-',''))
//  console.log(iconNames.slice(0,80))
// console.log(iconNames.slice(80,160))

export const iconFonts = {
  list: ["wulianwang-","zuji","disk-drive", "menu-fuzhi", "iso", "zuijinhuoyue","key", "shouquan", "sort", "grid", "list", "emoji-a", "emoji-bizui", "emoji-baiyan", "emoji-aixin", "emoji-dajing", "emoji-ziya", "emoji-daxiao", "emoji-esi", "emoji-fadai", "emoji-fankun", "emoji-ganga", "emoji-fennu", "emoji-hanyan", "emoji-jingkong", "emoji-haochi", "emoji-emo", "emoji-jingsong", "emoji-jingya", "emoji-kaixin", "emoji-lengku", "emoji-danao", "emoji-liukoushui", "emoji-liulei", "emoji-mengbi", "mianwubiaoqing", "nanguo", "shuizhuo", "taoyan", "tanchi", "siliao", "tiaopi", "xiaochulei", "wuliao", "xingxingyan", "xieyan", "xiasi", "xiaolian", "ku", "shengqi", "yousiliao", "en", "bushufu", "bianbian", "fankun1", "feiwen", "ganmao", "huaixiao", "liuhan", "outu", "keshui", "renzhe", "santiaoxian", "guaiwu", "shoushang", "tianshi", "shuai", "xianwen", "xiaodiaodaya", "xiong", "yiwen", "yun", "liubixie", "shimo", "dianzan", "biti", "fendou", "huqi", "heng", "kulou", "leng", "taoyan1", "shuixing", "aini", "aixin1", "zhadan", "xinsui",
    "maren", "zhutou", "qie", "youling", "apple-fill", "attachment", "android-fill", "apple", "download", "arrow-up-circle", "arrow-right-circle", "arrow-down", "ashbin", "add", "file_music", "menu", "role", "jiaoseguanli", "yemianshezhi", "drop_down", "yuandian", "tag", "service-directory", "fabu", "wailian", "bianji-", "WEBSITE", "wangzhanguanli", "Up", "up", "fenlei", "guanlizhuanjiawenzhang", "pifu", "tuichudenglu", "shezhi", "wangzhan", "huaban", "yunshezhi", "UserSettings", "blogger", "biaoqian", "myself", "guidang", "quxiaoyulan1-copy", "yulan-copy", "quxiaoyulan1", "yulan"]
}

export default {
  name: 'Icon',
  components: {
    IconFont
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
