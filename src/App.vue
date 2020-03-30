<template>
  <div id="app">
    <router-view />
    <!-- 全局音乐播放 -->
    <audio-preview></audio-preview>
    <!-- 将上传组件全局注册 -->
    <global-uploader></global-uploader>
  </div>
</template>

<script>

import AudioPreview from "@/components/preview/AudioPreview";
import globalUploader from '@/components/SimpleUploader/globalUploader.vue'

export default {
  name: 'App',
  components: {
    AudioPreview,globalUploader
  },
  watch: {
    $route: function(to, from) {
      const path = to.path
      if (path.indexOf('/login') < 0) {
        if (path === '/_m' && this.$pc) {
          this.$router.push(path.split('_m')[0])
        } else if (path === '/' && !this.$pc) {
          this.$router.push('/_m')
        }
      }
    }
  }
}
</script>
