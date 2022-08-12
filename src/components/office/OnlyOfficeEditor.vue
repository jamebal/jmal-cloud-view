<template>
  <div class="component-only-office">
    <div :id="this.id" class="placeholder"></div>
  </div>
</template>

<script>

import api from "@/api/file-api"
import fileConfig from "@/utils/file-config";

export default {
  name: "OnlyOfficeEditor",
  props: {
    id: {
      type: String,
      default: () => {
        return "office_" + Math.round(Math.random() * 10000)
      }
    },
    code: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
     readOnly: {
      type: Boolean,
      default: false
    },
    documentKey: Function
  },

  data() {
    return {
      docEditor: null,
    }
  },
  beforeDestroy() {
    if (this.docEditor !== null) {
      this.docEditor.destroyEditor()
      this.docEditor = null
    }
  },
  computed: {
    fileType() {
      return this.getType(this.value.suffix)
    },
    fileName() {
      return this.value.name
    },
  },
  watch: {
    'value.id': {
      handler(id)  {
        if (!id) {
          return
        }
        $J.loadScript($J.apiUrl("http://192.168.0.188:3454/web-apps/apps/api/documents/api.js"), (e) => {
          if (e !== null) {
            $J.modalAlert("组件加载失败！")
            return
          }
          if(this.$store.state.user.token && this.$store.state.user.userId === this.value.userId){
            api.getFileInfoById(this.value.id).then(res => {
              this.value = res.data
              this.loadFile()
            })
          } else {
            api.getPublicFileInfoById(this.value.id).then(res => {
              this.value = res.data
              this.loadFile()
            })
          }
        })
      },
      immediate: true,
    }
  },
  methods: {
    getType(type) {
      switch (type) {
        case 'doc':
          return 'docx'
        case 'word':
          return 'docx'
        case 'excel':
          return 'xlsx'
        case 'xls':
          return 'xlsx'
        case 'ppt':
          return 'pptx'
      }
      return type
    },

    loadFile() {
      if (this.docEditor !== null) {
        this.docEditor.destroyEditor()
        this.docEditor = null
      }
      let fileKey = `${new Date(this.value.updateDate).getTime()}-${this.value.id}`
      let fileName = $J.strExists(this.fileName, '.') ? this.fileName : (this.fileName + '.' + this.fileType)

      let url = window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.value, this.$store.getters.token)
      if(this.readOnly){
        url = window.location.origin + fileConfig.publicPreviewUrl(this.value.id, window.shareId);
      }

      const config = {
        "document": {
          "fileType": this.fileType,
          "key": fileKey,
          "title": fileName,
          "url": url,
        },
        "editorConfig": {
          "mode": "edit",
          "lang": "zh",
          "user": {
            "id": this.$store.state.user.userId,
            "name": this.$store.state.user.name
          },
          "customization": {
            "logo": {
              "image": "http://localhost:9528/favicon.ico",
              "imageEmbedded": "",
              "url": window.location.origin
            },
            "autosave": true,
            "comments": true,
            "compactHeader": false,
            "compactToolbar": false,
            "compatibleFeatures": false,
            "forcesave": false,
            "help": false,
            "hideRightMenu": false,
            "hideRulers": false,
            "submitForm": false,
            "about": false,
            "feedback": false
          },
          "callbackUrl": `http://192.168.0.66:8088/office/track?jmal-token=${this.$store.getters.token}&fileId=${this.value.id}`,
        }
      }
      if (!this.$pc) {
        config.type = 'mobile'
      }
      if (this.readOnly) {
        config.editorConfig.mode = "view"
        config.editorConfig.callbackUrl = null
        if (!config.editorConfig.user.id) {
          let viewer = $J.getStorageInt("viewer")
          if (!viewer) {
            viewer = $J.randNum(1000, 99999)
            $J.setStorage("viewer", viewer)
          }
          config.editorConfig.user.id = "viewer_" + viewer
          config.editorConfig.user.name = "Viewer_" + viewer
        }
      }
      this.$nextTick(() => {
        this.docEditor = new DocsAPI.DocEditor(this.id, config)
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
