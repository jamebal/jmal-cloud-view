<template>
  <div>
    <div class="top-bar">
      <div class="top-left"></div>
      <div class="top-center">{{ file.name }}</div>
      <div class="top-right">
        <div class="top-right-option">
          <el-button round title="切换背景色" size="mini" type="primary" @click="changeBackground"
                     :icon="lightTheme?'el-icon-moon':'el-icon-sunny'"></el-button>
          <el-button round title="显示全部" size="mini" type="primary" @click="reset"
                     icon="el-icon-c-scale-to-original"></el-button>
        </div>
      </div>
    </div>
    <div class="iframe-content">
      <canvas id="mxCadCanvas" style="height: 600px"></canvas>
    </div>
  </div>
</template>

<script>
import { createMxCad, loadMxCADassembly, MxCpp } from 'mxcad'
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
      locateFile: (fileName) => new URL("./wasm/2d-st/" + fileName, document.location.origin + '/' + document.location.pathname).href,
      fileUrl: '',
      onInit:()=>{
        MxCpp.App.addNetworkLoadingFont(["txt.shx", "simplex.shx","gdt.shx", "aaa.shx", "ltypeshp.shx", "complex.shx"]);
        MxCpp.App.addNetworkLoadingBigFont(["hztxt.shx", "gbcbig.shx"])
      },
      onOpenFileComplete: () => {
        this.$emit('onReady')
      },
    }).then((mxcad) => {
      this.fetchFile()
      MxFun.sendStringToExecute('Mx_Pan')
    }).catch((error) => {
      console.error('加载 MxCAD assembly 时出错：', error)
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
    fetchFile() {
      const mxcad = this.mxcad()
      mxcad.openWebFile(this.mxwebUrl, (iRet) => {
        if (iRet === 0) {
          this.$emit('onReady')
        } else {
          this.$emit('loadFileFailed', '文件加载失败, 请稍后再试, 或者对该文件重建索引')
        }
      })
    },
    reset() {
      const mxcad = this.mxcad()
      mxcad.regen()
      mxcad.updateDisplay()
      mxcad.zoomAll()
    },
    mxcad() {
      return MxCpp.getCurrentMxCAD()
    },
  },
}
</script>
<style lang="scss" scoped>
@import 'src/styles/iframe.scss';
</style>
