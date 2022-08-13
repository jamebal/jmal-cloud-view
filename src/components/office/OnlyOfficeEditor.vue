<template>
  <di>
    <div class="component-only-office">
      <div :id="this.id" class="placeholder"></div>
    </div>
  </di>
</template>

<script>

import api from "@/api/file-api"
import fileConfig from "@/utils/file-config";
import Bus from "@/assets/js/bus";

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
    file: {
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
      saved: true,
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
      return this.getType(this.file.suffix)
    },
  },
  watch: {
    'file.id': {
      handler(id)  {
        if (!id) {
          return
        }
        $J.loadScript($J.apiUrl("http://imac/office/web-apps/apps/api/documents/api.js"), (e) => {
          if (e !== null) {
            $J.modalAlert("组件加载失败！")
            return
          }
          if(this.$store.state.user.token && this.$store.state.user.userId === this.file.userId){
            api.getFileInfoById(this.file.id).then(res => {
              this.file = res.data
              this.loadFile()
            })
          } else {
            api.getPublicFileInfoById(this.file.id).then(res => {
              this.file = res.data
              this.loadFile()
            })
          }
        })
      },
      immediate: true,
    }
  },
  mounted() {
    Bus.$on('previewSaveAndClose', () => {
      this.requestClose()
    })
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
      let fileKey = `${new Date(this.file.updateDate).getTime()}-${this.file.id}`

      let url = window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
      if(this.readOnly){
        url = window.location.origin + fileConfig.publicPreviewUrl(this.file.id, window.shareId);
      }
      let callbackUrl = fileConfig.officeCallBackUrl(this.$store.getters.token, this.file.id)
      const config = {
        "document": {
          "fileType": this.fileType,
          "key": fileKey,
          "title": this.file.name,
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
            "logo": null,
            "autosave": false,
            "comments": true,
            "compactHeader": false,
            "compactToolbar": false,
            "compatibleFeatures": false,
            "forcesave": false,
            "help": false,
            "hideRightMenu": false,
            "hideRulers": false,
            "submitForm": false,
            "about": null,
            "feedback": false
          },
          "callbackUrl": callbackUrl,
        }
      }
      if (!this.$pc) {
        config.type = 'mobile'
      }
      if (this.readOnly) {
        config.editorConfig.mode = "view"
        config.editorConfig.callbackUrl = null
        if (!config.editorConfig.user.id) {
          let visitor = $J.getStorageInt("visitor")
          if (!visitor) {
            visitor = $J.randNum(1000, 99999)
            $J.setStorage("viewer", visitor)
          }
          config.editorConfig.user.id = "visitor_" + visitor
          config.editorConfig.user.name = "Visitor_" + visitor
        }
      }
      config.events = {
        "onDocumentReady": this.onDocumentReady,
        "onDocumentStateChange": this.onDocumentStateChange,
      }
      this.$nextTick(() => {
        this.docEditor = new DocsAPI.DocEditor(this.id, config)
      })
    },
    onDocumentReady() {
      console.log('onDocumentReady')
      let parentDoc = document.querySelector('.component-only-office')
      let doc = parentDoc.getElementsByTagName('iframe')[0].contentWindow.document
      let logo = doc.querySelector('.extra .logo')
      // 隐藏logo,about
      logo.style.display = 'none'
      let about = doc.getElementById('left-btn-about')
      about.style.display = 'none'
      this.saveBtnDoc = doc.getElementById('slot-btn-dt-save').getElementsByTagName('button')[0]
    },
    onDocumentStateChange() {
      this.saved = this.saveBtnDoc.classList.contains('disabled')
      this.$emit('onEdit', this.saved)
    },
    requestClose() {
      this.$emit('manualSave')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
