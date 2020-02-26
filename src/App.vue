<template>
  <div id="app">
    <router-view />
    <!-- 将上传组件全局注册 -->
    <global-uploader></global-uploader>
  </div>
</template>

<script>

import globalUploader from '@/components/SimpleUploader/globalUploader.vue'

export default {
  name: 'App',
  components: {
    globalUploader
  },
  watch: {
    $route: function(to, from) {
      const path = to.path
      if (path.indexOf('/login') < 0) {
        if (path.indexOf('_m') > 0 && this.$pc) {
          this.$router.push(path.split('_m')[0])
        } else if (path.indexOf('_m') < 0 && !this.$pc) {
          this.$router.push(path + '_m')
        }
      }
    }
  }
}
</script>
