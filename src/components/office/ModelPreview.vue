<template>
  <div>
    <div v-if="show">
      <model-viewer ref="modelViewer" class="model-viewer" alt="" :src="fileUrl" autoplay animation-name="Running" shadow-intensity="1" camera-controls touch-action="pan-y"></model-viewer>
    </div>
  </div>
</template>

<script>

export default {
  name: "ModelPreview",
  components: {},
  props: {
    file: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fileUrl: {
      type: String,
      default: ''
    },
    shareId: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      show: false,
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    const modelViewerJsUrl = window.location.origin + '/resource/model-viewer.min.js';

    // 检查是否已经加载了相同的脚本
    const existingScript = Array.from(document.head.getElementsByTagName('script')).find(
      script => script.src === modelViewerJsUrl
    )

    if (existingScript) {
      this.onRead()
    } else {
      const script = document.createElement('script');
      script.src = modelViewerJsUrl;
      script.type = 'module';
      script.onload = () => {
        this.onRead()
      };
      document.head.appendChild(script);
    }
  },
  beforeDestroy() {
  },
  destroyed() {
  },
  watch: {
  },
  methods: {
    onRead() {
      this.$emit('onReady')
      this.show = true
      this.$nextTick(() => {
        this.$refs.modelViewer.style.width = this.width + "px"
        this.$refs.modelViewer.style.height = this.height + "px"
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.model-viewer {
  position: absolute;
}
</style>
