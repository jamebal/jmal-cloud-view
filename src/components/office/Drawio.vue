<template>
  <div class="drawio-content" :style="{'top': readOnly ? '0': '2.5rem'}">
    <div class="drawio-title">
      <span class="drawio-title-name" :style="{'color': saved ? '': '#ff8200'}">{{title}}</span>
      <span  class="drawio-save"><el-button v-if="!saved" @click="save" size="mini" :loading="saveBtnUpdating">保存</el-button></span>
    </div>
    <iframe ref="myFlow" class="drawio-iframe" :src="url" :title="file.name"></iframe>
  </div>
</template>

<style lang="scss" scoped>
.drawio-content {
  z-index: 999;
  position: absolute;
  top: 2.5rem;
  left: 0;
  width: 100%;
  height: 100%;

  .drawio-title {
    text-align: center;
    background-color: #fbfbfb;
    z-index: 2001;
    position: absolute;
    top: 0;
    width: 100%;
    height: 10px;

    .drawio-title-name {
      line-height: 40px;
    }

    .drawio-save {
      float: right;
      margin-right: 30px;
      line-height: 40px;
    }
  }

  .drawio-iframe {
    z-index: 1999;
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 100%;
    background: 0 0;
    border: 0;
    float: none;
    margin: -1px 0 0;
    max-width: none;
    outline: 0;
    padding: 0;
  }
}
</style>
<script>

import api from '@/api/file-api'
import txtApi from "@/api/markdown-api"

export default {
  name: "Drawio",
  props: {
    file: {
      type: Object,
      default: function () {
        return {}
      }
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
      url: null,
      bakData: '',
      xml: '',
      saveBtnUpdating: false,
      title: this.file.name,
      saved: true,
      reday: false
    }
  },
  created() {
    let language = 'zh'
    let lightbox = this.readOnly ? 1 : 0
    let chrome = this.readOnly ? 0 : 1
    let theme = 'kennedy'
    let title = this.file.name ? encodeURIComponent(this.file.name) : ''
    let query = `?title=${title}&chrome=${chrome}&lightbox=${lightbox}&ui=${theme}&lang=${language}&offline=1&pwa=0&embed=1&noLangIcon=1&noExitBtn=1&noSaveBtn=1&saveAndExit=0&spin=1&proto=json`
    this.url = $J.apiUrl(`../drawio/webapp/${query}`)
  },
  mounted() {
    window.addEventListener('message', this.handleMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage)
  },
  watch: {
    'file.id': {
      handler(id)  {
        if (!id) {
          return
        }
        this.xml = ''
        let request = 'previewText'
        if(this.readOnly){
          request = 'sharePreviewText'
        }
        api[request]({
          shareId: this.shareId,
          fileId: this.file.id,
          id: this.file.id,
          path: encodeURI(this.file.path),
          username: this.$store.state.user.name
        }).then((res) => {
          this.file.path = res.data.path
          this.xml = res.data.contentText
          if (this.bakData === res.data.contentText) {
            return
          }
          this.bakData = res.data.contentText
          this.updateContent()
        })
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  methods: {
    updateContent() {
      this.$refs.myFlow.contentWindow.postMessage(JSON.stringify({
        action: "load",
        autosave: 1,
        xml: this.bakData,
      }), "*")
    },
    save() {
      this.saved = true
      this.title = this.file.name
      this.update(this.xml)
      this.$emit('onEdit', this.saved)
    },
    update(value) {
      this.saveBtnUpdating = true
      txtApi.editMarkdownByPath({
        relativePath: encodeURI(this.file.path + this.file.name),
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        contentText: value
      }).then(() => {
        this.saveBtnUpdating = false
        this.$message({
          message: "保存成功",
          type: 'success',
          duration : 1000
        })
      }).catch(() => {
        this.saveBtnUpdating = false
      })
    },
    handleMessage(event) {
      const editWindow = this.$refs.myFlow.contentWindow
      if (event.source !== editWindow) {
        return
      }
      const payload = $J.jsonParse(event.data)
      switch (payload.event) {
        case "init":
          this.reday = true
          this.$emit('onReady')
          this.updateContent()
          break
        case "load":
          if (this.xml.length < 1) {
            editWindow.postMessage(JSON.stringify({
              action: "template"
            }), "*")
          }
          break

        case "autosave":
          this.bakData = payload.xml
          this.xml = payload.xml
          this.saved = false
          this.title = `*${this.file.name}`
          this.$emit('onEdit', this.saved)
          break

        case "save":
          // save
          this.save()
          break
      }
    }
  },
}
</script>
