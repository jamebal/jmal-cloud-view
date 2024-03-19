<template>
  <div class="drawio-content" :style="{'top': readOnly ? '0': '2.5rem'}">
    <div class="drawio-title">
      <div class="drawio-title-name" :style="{'color': saved ? (lightTheme ? '':'#ffffff'): '#ff8200'}">{{title}}</div>
      <div class="drawio-operation">
        <div style="margin-right: 15px">
          <el-button v-if="historyVersion.metadata.time" @click="cancelPreview" size="mini" :class="lightTheme ? '':'dark-button'">取消预览</el-button>
        </div>
        <history-popover
          ref="historyPopover"
          :light-theme.sync="lightTheme"
          :has-history-version.sync="hasHistoryVersion"
          :history-list-popover-visible.sync="historyListPopoverVisible"
          :history-operation-loading="!loading.closed"
          :saved.sync="saved"
          @viewHistoryFile="viewHistoryFile"
          @recoverySuccess="recoverySuccess"
        >
        </history-popover>

        <div><el-button v-if="!saved" @click="save" size="mini" :loading="saveBtnUpdating" :class="lightTheme ? '':'dark-button'">保存</el-button></div>
      </div>
    </div>
    <iframe ref="myFlow" class="drawio-iframe" :src="url" :title="file.name"></iframe>
  </div>
</template>

<script>

import api from '@/api/file-api'
import txtApi from "@/api/markdown-api"
import Bus from "@/assets/js/bus";
import HistoryPopover from "@/components/HistoryPopover/index.vue";
import historyApi from "@/api/file-history";
import {mapState} from "vuex";

export default {
  name: "Drawio",
  components: {HistoryPopover},
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
      drawioUrlValid: false,
      saveBtnUpdating: false,
      title: this.file.name,
      saved: true,
      ready: false,
      currentContext: undefined,
      currentTitle: undefined,
      historyVersion: {metadata: {}},
      hasHistoryVersion: false,
      historyListPopoverVisible: false,
      viewHistory: false,
      loading: {
        closed: true
      },
      lightTheme: true
    }
  },
  computed: {
    ...mapState(['message'])
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
  destroyed() {
  },
  watch: {
    'file.id': {
      handler(id)  {
        if (!id) {
          return
        }
        this.xml = ''
        let request = 'previewText'
        if (!this.$store.state.user.token) {
          request = 'sharePreviewText'
        }
        api[request]({
          shareId: this.shareId,
          fileId: this.file.id,
          id: this.file.id,
          fileName: this.file.name,
          path: encodeURI(this.file.path),
          username: this.$store.state.user.name,
          content: true,
        }).then(async (res) => {
          await this.checkDrawioUrl()
          if (!this.drawioUrlValid) {
            return
          }
          this.file.path = res.data.path
          this.xml = res.data.contentText
          if (this.bakData === res.data.contentText) {
            return
          }
          this.bakData = res.data.contentText
          this.updateContent()
        })
        this.$nextTick(()=> {
          this.$refs.historyPopover.loadHistoryList(this.file.id)
        })
      },
      immediate: true,
      deep: true,
    },
    message(msg) {
      if (msg.event === 'previewSaveAndClose') {
        this.saveAndClose()
      }
    }
  },
  methods: {
    async checkDrawioUrl() {
      await axios.get(this.url).then(response => {
        if (response.status === 200) {
          this.drawioUrlValid = true
        } else {
          this.$emit('onClose')
          this.$store.dispatch('updateMessage', { event: 'loadFileFailed'})
        }
      }).catch(() => {
        this.$emit('onClose')
        this.$store.dispatch('updateMessage', { event: 'loadFileFailed'})
      })
    },
    viewHistoryFile({historyInfo, recovery}) {
      if (!this.saved) {
        this.$message({type: 'info', message: "请先保存当前修改的内容"})
        return
      }
      let loadingInfo = recovery ? '恢复中...' : '加载中...'
      this.loading = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: `<span>&nbsp;&nbsp;${loadingInfo}</span>`
      })
      historyApi.previewHistoryText({id: historyInfo.id}).then((res) => {
        this.loading.close()

        if (this.historyListPopoverVisible) {
          this.historyListPopoverVisible = false
        }
        if (recovery) {
          this.cancelPreview(null, res.data.contentText)
          this.$message({message: '恢复成功',type: 'success'})
        } else {
          this.currentContext = this.xml
          this.currentTitle = this.title
          this.bakData = res.data.contentText
          this.xml = res.data.contentText
          this.updateContent()
          this.historyVersion = historyInfo
          this.title = `历史版本：${historyInfo.metadata.time}`
          this.viewHistory = true
        }
      }).catch(() => {
        this.loading.close()
      })
    },
    recoverySuccess({historyInfo}) {
      this.viewHistoryFile({historyInfo: historyInfo, recovery: true})
    },
    cancelPreview(event, currentContext) {
      if (!currentContext) {
        currentContext = this.currentContext
      }
      this.historyVersion = {metadata: {}}
      this.xml = currentContext
      this.bakData = currentContext
      this.updateContent()
      if (this.currentTitle) {
        this.title = this.currentTitle
      }
      this.viewHistory = false
    },
    saveAndClose() {
      this.save()
      this.$emit('onClose')
    },
    updateContent() {
      this.$refs.myFlow.contentWindow.postMessage(JSON.stringify({
        action: "load",
        autosave: 1,
        xml: this.bakData,
      }), "*")
    },
    save() {
      if (!this.saved) {
        this.update(this.xml)
      }
    },
    update(value) {
      this.saveBtnUpdating = true
      txtApi.editMarkdownByPath({
        relativePath: encodeURI(this.file.path + this.file.name),
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        mountFileId: this.$store.state.user.userId !== this.file.userId ? this.file.id : '',
        contentText: value
      }).then(() => {
        this.saveBtnUpdating = false
        this.saved = true
        this.title = this.file.name
        this.$emit('onEdit', this.saved)
        this.bakData = this.xml
        this.updateContent()
        this.$refs.historyPopover.loadHistoryList(this.file.id)
      }).catch(() => {
        this.saveBtnUpdating = false
      })
    },
    onSwitchTheme() {
      let isDarkMode = false;
      let linkElements = this.$refs.myFlow.contentWindow.document.getElementsByTagName("link");
      for (let i = 0; i < linkElements.length; i++) {
        let link = linkElements[i];
        if (link.href.includes("styles/dark.css")) {
          isDarkMode = true;
          break;
        }
      }
      this.lightTheme = !isDarkMode
    },
    handleMessage(event) {
      const editWindow = this.$refs.myFlow.contentWindow
      if (event.source !== editWindow) {
        return
      }
      let doc = this.$refs.myFlow.contentWindow.document
      const payload = $J.jsonParse(event.data)
      switch (payload.event) {
        case "init":
          this.ready = true
          this.$emit('onReady')
          this.updateContent()
          let menuBar = doc.querySelector('.geMenubarContainer .geMenubar')
          if (menuBar) {
            let helpMenu = menuBar.childNodes[5]
            doc.addEventListener('click', this.$refs.historyPopover.onGlobalClick)
            helpMenu.style.display = 'none'
          }
          let toolbar = doc.querySelector('.geToolbarContainer')
          if (toolbar) {
            let elementTheme = toolbar.querySelector('[title="主题"][class="geButton geAdaptiveAsset"]');
            if (elementTheme) {
              elementTheme.addEventListener('click', this.onSwitchTheme)
            }
          }
          break
        case "load":
          if (this.xml.length < 1) {
            editWindow.postMessage(JSON.stringify({
              action: "template"
            }), "*")
          }
          break

        case "autosave":
          let undo = doc.querySelector('.geSprite.geSprite-undo')
          if (undo && !this.viewHistory) {
            let undoClass = undo.parentElement.getAttribute('class')
            if (undoClass && undoClass.indexOf('mxDisabled') > -1) {
              this.saved = true
              if (this.title === `*${this.file.name}`) {
                this.title = this.file.name
              }
            } else {
              this.xml = payload.xml
              this.saved = false
              this.title = `*${this.file.name}`
            }
            this.$emit('onEdit', this.saved)
          }
          break

        case "save":
          this.save()
          break
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.drawio-content {
  z-index: 999;
  position: absolute;
  top: 2.5rem;
  left: 0;
  width: 100%;
  height: 100%;

  >>>.dark-button {
    background: #3e3e3e;
    border: 1px solid #3e3e3e;
    color: #ffffff;
  }
  >>>.dark-button:hover {
    color: #409EFF;
    background-color: #181818;
  }

  .drawio-title {
    z-index: 2001;
    position: relative;

    .drawio-title-name {
      line-height: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 2001;
      position: absolute;
      text-align: center;
      width: 40%;
      top: 16px;
      left: 50%;
      transform: translate(-50%, -50%);

    }

    .drawio-operation {
      display: flex;
      float: right;
      margin-right: 15px;
      line-height: 32px;
    }
  }

  .drawio-iframe {
    z-index: 1999;
    position: absolute;
    top: 2px;
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
