<template>
  <div>
    <div v-if="show" class="viewer-container" :style="{ width: width + 'px', height: height + 'px' }">
      <model-viewer
        ref="modelViewer"
        class="model-viewer"
        :src="fileUrl"
        autoplay
        animation-name="Running"
        shadow-intensity="1"
        camera-controls
        touch-action="pan-y"
        reveal="auto"
      >
        <common-loading slot="poster" text="资源加载中..." />

        <!-- 隐藏原生进度条 -->
        <div slot="progress-bar"></div>

      </model-viewer>
    </div>
  </div>
</template>

<script>
import { loadScript } from '@/utils/load-script'
import CommonLoading from '@/components/loading/CommonLoading.vue'

export default {
  name: "ModelPreview",
  components: {
    CommonLoading
  },
  props: {
    fileUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  mounted() {
    const modelViewerJsUrl = window.location.origin + '/resource/model-viewer.min.js';
    loadScript(modelViewerJsUrl, 'module').then(() => {
      this.onRead();
    })
  },
  methods: {
    onRead() {
      this.$emit('onReady')
      this.show = true

      this.$nextTick(() => {
        if (this.$refs.modelViewer) {
          this.$refs.modelViewer.style.width = "100%";
          this.$refs.modelViewer.style.height = "100%";
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.viewer-container {
  position: relative;
  background-color: var(--model-preview-bg-color);
  overflow: hidden;
}

.model-viewer {
  width: 100%;
  height: 100%;
  --poster-color: transparent;
}
</style>
