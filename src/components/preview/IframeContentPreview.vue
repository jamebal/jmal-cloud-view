<template>
  <div>
    <div class="top-bar">
      <div class="top-left"></div>
      <div class="top-center">{{file.name}}</div>
      <div class="top-right">
        <div class="top-right-option">
          <el-select v-if="services.length > 1" size="medium" v-model="url" placeholder="请选择">
            <el-option
              v-for="item in services"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button size="medium" type="primary" @click="openUrl"><svg-icon icon-class="wailian"/></el-button>
        </div>
      </div>
    </div>
    <div class="iframe-content">
      <iframe ref="iframeContent" name="Iframe Content Preview" :title="file.name" :src="url"></iframe>
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
    },
    fileHandler: {
      type: Object,
      default: undefined
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
      if (this.fileHandler) {
        console.log('this.fileHandler', this.fileHandler);
        for (let service in this.fileHandler) {
          const urlTemplate = this.fileHandler[service]
          if (!urlTemplate) {
            continue
          }
          const url = decodeURI(this.fileUrl)
          if (urlTemplate.indexOf('$e_url') > 0) {
            this.url = urlTemplate.replace('$e_url', encodeURIComponent(url))
            this.services.push({label: service, value: this.url})
          }
          if (urlTemplate.indexOf('$eb_url') > 0) {
            this.url = urlTemplate.replace('$eb_url', encodeURIComponent(this.base64EncodeUnicode(url)))
            this.services.push({label: service, value: this.url})
          }
          console.log('services', this.services)
        }
      } else {
        this.url = undefined
        this.services = []
      }
      const iframe = this.$refs.iframeContent;
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.onReady()
        })
      } else {
        iframe.onload = () => {
          this.onReady()
        }
      }
    },
    base64EncodeUnicode(str) {
      // 首先，将字符串编码为 UTF-8
      const utf8Bytes = new TextEncoder().encode(str);
      // 然后，将 Uint8Array 转换为字符串
      const binaryStr = String.fromCharCode(...utf8Bytes);
      // 最后，使用 btoa 编码为 Base64
      return btoa(binaryStr);
    },
    onReady() {
      this.$emit('onReady')
      // this.url = 'http://192.168.0.233:8012/onlinePreview?url='+encodeURIComponent(this.base64EncodeUnicode('https://cloud.jmal.top/api/file/jmal/tewo/海印缤缤广场/冷机智能控制系统布线图.pdf'))
      //this.url = 'https://alist-org.github.io/pdf.js/web/viewer.html?file=' + encodeURIComponent('http://localhost:9528/api/file/jmal/jmal/share/滨滨广场冷冻侧采集箱布线图_副本 (1).pdf')
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
.top-bar {
  width: 100%;
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background: #fff;
}
.top-left {
  width: 25%;
}
.top-center {
  width: 50%;
  text-align: center;
  align-content: center;
}
.top-right {
  width: 25%;
  .svg-icon {
    font-size: 14px;
  }
  .top-right-option {
    float: right;
    margin-right: 3rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;
    line-height: 2.5rem;
  }
  >>> .el-select {
    width: 135px;
    margin-right: 10px;
  }
}
.iframe-content {
  position: absolute;
  top: 2.5rem;
  left: 0;
  right: 0;
  bottom: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
