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
    fileUrl: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    },
    shareId: {
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
        let officeApiUrl = fileConfig.officeApiUrl()
        $J.loadScript($J.apiUrl(officeApiUrl), (e) => {
          if (e !== null) {
            this.$emit('onClose')
            Bus.$emit('loadFileFaild')
            return
          }
          if(this.$store.state.user.token && this.$store.state.user.userId === this.file.userId){
            api.getFileInfoById({id: this.file.id}).then(res => {
              this.file = res.data
              this.loadFile()
            })
          } else {
            api.getPublicFileInfoById({fileId: this.file.id, shareId: this.shareId}).then(res => {
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
  destroyed() {
    Bus.$off('previewSaveAndClose')
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
      this.fileUrl = window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
      if(this.readOnly && window.shareId){
        this.fileUrl = window.location.origin + fileConfig.publicPreviewUrl(this.file.id, window.shareId, this.$store.getters.shareToken)
      }
      let fileKey = `${new Date(this.file.updateDate).getTime()}-${this.file.id}`

      let callbackUrl = fileConfig.officeCallBackUrl(this.$store.getters.token, this.$store.getters.name, this.file.id)

      const config = {
        "document": {
          "fileType": this.fileType,
          "key": fileKey,
          "title": this.file.name,
          "url": this.fileUrl,
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
        "onAppReady": this.onAppReady,
        "onDocumentReady": this.onDocumentReady,
        "onDocumentStateChange": this.onDocumentStateChange,
      }
      this.$nextTick(() => {
        this.docEditor = new DocsAPI.DocEditor(this.id, config)
      })
    },
    onAppReady() {
      this.$emit('onReady')
      console.log('onAppReady')
    },
    onDocumentReady() {
      console.log('onDocumentReady')
      let parentDoc = document.querySelector('.component-only-office')
      let doc = parentDoc.getElementsByTagName('iframe')[0].contentWindow.document

      if (!this.$pc) {
        parentDoc.style.top = '5rem'
        doc.querySelector('.navbar.main-navbar.navbar-with-logo').style.height = '0'
        let editorNavbar = doc.getElementById("editor-navbar")
        console.log(editorNavbar)
        // editorNavbar.style.display = 'none'
      }

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
