<template>
  <div>
    <div class="top-bar">
      <div class="top-left"></div>
      <div class="top-center">{{file.name}}</div>
      <div class="top-right">
        <div class="top-right-option">
          <el-select v-if="services.length > 1" size="mini" v-model="url" placeholder="请选择">
            <el-option
              v-for="item in services"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button round title="外部打开" size="mini" type="primary" @click="openUrl"><svg-icon icon-class="wailian"/></el-button>
        </div>
      </div>
    </div>
    <div class="iframe-content">
      <iframe ref="iframeContent" name="Iframe Content Preview" :title="file.name" :src="url" sandbox="allow-scripts allow-forms allow-same-origin allow-popups"></iframe>
    </div>
  </div>
</template>

<script>

export default {
  name: "IframeContentPreview",
  props: {
    fileUrl: {
      type: String,
      default: ''
    },
    file: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      url: undefined,
      services: []
    }
  },
  mounted() {
    this.iframeLoad()
  },
  methods: {
    iframeLoad() {
      if (!this.fileUrl) return '';
      this.url = `/resource/cad-preview/index.html?url=${encodeURIComponent(this.fileUrl)}`;
      this.$nextTick(() => {
        this.onReady()
      })
    },
    onReady() {
      this.$emit('onReady')
      if (!this.url) {
        this.$emit('loadFileFailed')
      }
    },
    openUrl() {
      window.open(this.url)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'src/styles/iframe.scss';
</style>
