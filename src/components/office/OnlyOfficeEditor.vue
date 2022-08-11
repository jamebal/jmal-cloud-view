<template>
  <div class="component-only-office">
    <div :id="this.id" class="placeholder"></div>
    <div v-if="loadIng > 0" class="office-loading"></div>
  </div>
</template>

<script>

import fileConfig from "@/utils/file-config";

export default {
  name: "OnlyOfficeEditor",
  props: {
    id: {
      type: String,
      default: () => {
        return "office_" + Math.round(Math.random() * 10000);
      }
    },
    code: {
      type: String,
      default: ''
    },
    value: {
      type: [Object, Array],
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
      loadIng: 0,

      docEditor: null,
    }
  },

  mounted() {
  },

  beforeDestroy() {
    if (this.docEditor !== null) {
      this.docEditor.destroyEditor();
      this.docEditor = null;
    }
  },

  computed: {

    fileType() {
      return this.getType(this.value.suffix);
    },

    fileName() {
      return this.value.name;
    },
  },
  watch: {
    'value.id': {
      handler(id)  {
        if (!id) {
          return;
        }
        this.loadIng++;
        $J.loadScript($J.apiUrl("http://nps.jmal.top:18849/web-apps/apps/api/documents/api.js"), (e) => {
          this.loadIng--;
          if (e !== null) {
            $J.modalAlert("组件加载失败！");
            return;
          }
          if (!this.documentKey) {
            this.handleClose();
            return
          }
          const documentKey = this.documentKey();
          if (documentKey && documentKey.then) {
            documentKey.then(this.loadFile);
          } else {
            this.loadFile();
          }
        })
      },
      immediate: true,
    }
  },

  methods: {
    getType(type) {
      switch (type) {
        case 'word':
          return 'docx';
        case 'excel':
          return 'xlsx';
        case 'ppt':
          return 'pptx'
      }
      return type;
    },

    loadFile(keyAppend = '') {
      if (this.docEditor !== null) {
        this.docEditor.destroyEditor();
        this.docEditor = null;
      }
      let fileKey = this.code || this.value.id;
      let fileName = $J.strExists(this.fileName, '.') ? this.fileName : (this.fileName + '.' + this.fileType);
      const config = {
        "document": {
          "fileType": this.fileType,
          "key": `${this.fileType}-${$J.randNum(0,45678)}`,
          "title": fileName,
          //"url": window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.value, this.$store.getters.token),
          "url": "http://nps.jmal.top:19957/download?fileName=new+%281%29.docx&userAddress=%2FUsers%2Fjmal%2FDownloads%2Ftest%2F",
        },
        "editorConfig": {
          "mode": "edit",
          "lang": "zh",
          "user": {
            "id": this.$store.state.user.name,
            "name": this.$store.state.user.name
          },
          // "customization": {
          //   "uiTheme": this.themeIsDark ? "theme-dark" : "theme-classic-light",
          // },
          "customization": {
            "logo": null,
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
          // "callbackUrl": `${window.location.origin}/api/office/track?jmal-token=${this.$store.getters.token}&fileName=new.docx&userAddress=%2FUsers%2Fjmal%2FDownloads%2Ftest%2F`,
          callbackUrl: "http://nps.jmal.top:19957/track?fileName=new+%281%29.docx&userAddress=%2FUsers%2Fjmal%2FDownloads%2Ftest%2F",
        }
      };
      if (/\/hideenOfficeTitle\//.test(window.navigator.userAgent)) {
        config.document.title = " ";
      }
      console.log(config.document, config.editorConfig)
      // if ($J.leftExists(fileKey, "msgFile_")) {
      //   config.document.url = `http://nginx/api/dialog/msg/download/?msg_id=${$J.leftDelete(fileKey, "msgFile_")}&token=${this.userToken}`;
      // } else if ($J.leftExists(fileKey, "taskFile_")) {
      //   config.document.url = `http://nginx/api/project/task/filedown/?file_id=${$J.leftDelete(fileKey, "taskFile_")}&token=${this.userToken}`;
      // }
      // if (this.readOnly) {
      //   config.editorConfig.mode = "view";
      //   config.editorConfig.callbackUrl = null;
      //   if (!config.editorConfig.user.id) {
      //     let viewer = $J.getStorageInt("viewer")
      //     if (!viewer) {
      //       viewer = $J.randNum(1000, 99999);
      //       $J.setStorage("viewer", viewer)
      //     }
      //     config.editorConfig.user.id = "viewer_" + viewer;
      //     config.editorConfig.user.name = "Viewer_" + viewer
      //   }
      // }
      this.$nextTick(() => {
        this.docEditor = new DocsAPI.DocEditor(this.id, config);
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
