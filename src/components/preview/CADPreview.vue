<template>
  <div>
    <div class="top-bar">
      <div class="top-left"></div>
      <div class="top-center">{{file.name}}</div>
      <div class="top-right">
        <div class="top-right-option">
          <el-button title="切换背景色" size="medium" type="primary" @click="changeBackground" :icon="lightTheme?'el-icon-moon':'el-icon-sunny'"></el-button>
          <el-button title="显示全部" size="medium" type="primary" @click="reset" icon="el-icon-c-scale-to-original"></el-button>
        </div>
      </div>
    </div>
    <div class="iframe-content">
      <canvas id="mxCadCanvas" style="height: 600px"></canvas>
    </div>
  </div>
</template>

<script>
import { createMxCad, MxCpp } from 'mxcad'
import { MxFun } from 'mxdraw'

export default {
  name: 'CADPreview',
  props: {
    fileUrl: {
      type: String,
      default: '',
    },
    shareId: {
      type: String,
      default: undefined,
    },
    file: {
      type: Object,
      default: function() {
        return {}
      },
    },
  },
  data() {
    return {
      clientHeight: document.documentElement.clientHeight - 100,
      lightTheme: false,
    }
  },
  computed: {
    mxwebUrl() {
      if (this.shareId) {
        return `${process.env.VUE_APP_BASE_API}/public/s/view/mxweb/${this.file.id}/${this.shareId}`
      }
      return `${process.env.VUE_APP_BASE_API}/view/mxweb/${this.file.id}`
    },
  },
  mounted() {
    createMxCad({
      canvas: '#mxCadCanvas',
      locateFile: (fileName) => window.location.origin + '/resource/mxcad/wasm/2d-st/' + fileName,
      fontspath: window.location.origin + '/resource/mxcad/fonts/',
      fileUrl: this.mxwebUrl,
    }).then(() => {
      MxFun.sendStringToExecute('Mx_Pan')
      this.$emit('onReady')
    })
  },
  methods: {
    changeBackground() {
      this.lightTheme = !this.lightTheme
      const value = this.lightTheme ? 255 : 0
      const mxcad = this.mxcad()
      mxcad.updateDisplay()
      mxcad.setViewBackgroundColor(value, value, value)
    },
    reset() {
      const mxcad = this.mxcad()
      mxcad.regen()
      mxcad.updateDisplay()
      mxcad.zoomAll()
    },
    mxcad() {
      return MxCpp.getCurrentMxCAD()
    }
  },
}
</script>
<style lang="scss" scoped>
@import 'src/styles/iframe.scss';
</style>
