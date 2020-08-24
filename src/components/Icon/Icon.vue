<template>
  <icon-font :type="type" />
</template>
<script>

import { Icon } from 'ant-design-vue'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2024484_dyz0zgvb9x.js'
})

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
