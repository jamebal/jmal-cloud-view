<template>
  <div>
    <div class="top-bar">
      <div class="top-left"></div>
      <div class="top-center" :style="{'color': saved ? (lightTheme ? '':'#ffffff'): '#ff8200'}">{{ title }}</div>
      <div class="top-right">
        <div class="top-right-option">
          <div style="margin-right: 15px">
            <el-button v-if="historyVersion.metadata.time" @click="cancelPreview" size="mini"
                       :class="lightTheme ? '':'dark-button'">取消预览
            </el-button>
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

          <div style="margin-right: 15px">
            <el-button v-if="!saved" @click="saveBtn" size="mini" :loading="saveBtnUpdating"
                       :class="lightTheme ? '':'dark-button'">保存
            </el-button>
          </div>
          <div>
            <el-button title="外部打开" size="medium" type="primary" @click="openUrl"><svg-icon icon-class="wailian"/></el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="excalidraw-content" :style="{'top': readOnly ? '0': '2.5rem'}">
      <iframe ref="excalidrawIframe" class="excalidraw-iframe" :src="excalidrawUrl" :title="file.name"></iframe>
    </div>

  </div>
</template>

<script>

import api from '@/api/file-api'
import historyApi from '@/api/file-history'
import txtApi from '@/api/markdown-api'
import HistoryPopover from '@/components/HistoryPopover/index.vue'
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'ExcalidrawEditor',
  components: { HistoryPopover },
  props: {
    file: {
      type: Object,
      default: function() {
        return {}
      },
    },
    shareId: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // excalidrawUrl: 'http://localhost:3000/excalidraw/app/',
      excalidrawUrl: 'http://localhost:8085/excalidraw/app/',
      excalidrawData: {
        elements: [],
        appState: {},
        files: {}
      },
      saveBtnUpdating: false,
      title: this.file.name,
      thisEditorClosing: false,
      saved: true,
      ready: false,
      currentContext: undefined,
      currentTitle: undefined,
      historyVersion: { metadata: {} },
      hasHistoryVersion: false,
      historyListPopoverVisible: false,
      viewHistory: false,
      loading: {
        closed: true,
      },
      lightTheme: true,
    }
  },
  computed: {
    ...mapState(['message']),
  },
  created() {
  },
  mounted() {
    this.clearExcalidrawCache()
    window.addEventListener('message', this.handleMessage)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleMessage)
  },
  destroyed() {
  },
  watch: {
    'file.id': {
      handler(id) {
        if (!id) {
          return
        }
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
          this.file.path = res.data.path
          this.loadData(res.data.contentText)
          this.currentContext = res.data.contentText
        })
        this.$nextTick(() => {
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
    },
  },
  methods: {
    loadData(contentText) {
      if (contentText) {
        const data = JSON.parse(contentText)
        if (typeof this.excalidrawData === 'string') {
          this.excalidrawData = JSON.parse(data)
        } else {
          this.excalidrawData = data
        }
      }
    },
    viewHistoryFile({ historyInfo, recovery }) {
      if (!this.saved) {
        this.$message({ type: 'info', message: '请先保存当前修改的内容' })
        return
      }
      let loadingInfo = recovery ? '恢复中...' : '加载中...'
      this.loading = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: `<span>&nbsp;&nbsp;${loadingInfo}</span>`,
      })
      historyApi.previewHistoryText({ id: historyInfo.id }).then((res) => {
        this.loading.close()

        if (this.historyListPopoverVisible) {
          this.historyListPopoverVisible = false
        }
        if (recovery) {
          this.cancelPreview(null, res.data.contentText)
          this.$message({ message: '恢复成功', type: 'success' })
        } else {
          this.currentTitle = this.title
          this.loadData(res.data.contentText)
          this.updateContent()
          this.historyVersion = historyInfo
          this.title = `历史版本：${historyInfo.metadata.time}`
          this.viewHistory = true
        }
      }).catch(() => {
        this.loading.close()
      })
    },
    recoverySuccess({ historyInfo }) {
      this.viewHistoryFile({ historyInfo: historyInfo, recovery: true })
    },
    cancelPreview(event, currentContext) {
      if (!currentContext) {
        currentContext = this.currentContext
      }
      this.historyVersion = { metadata: {} }
      this.loadData(currentContext)
      this.updateContent()
      if (this.currentTitle) {
        this.title = this.currentTitle
      }
      this.viewHistory = false
    },
    saveAndClose() {
      this.saveBtn()
      this.thisEditorClosing = true
    },
    updateContent() {
      const excalidrawData = {
        type: 'INIT_DATA',
        data: this.excalidrawData
      };
      this.$refs.excalidrawIframe.contentWindow.postMessage(excalidrawData, '*');
    },
    saveBtn() {
      this.getDataBase()
    },
    loadExcalidrawFiles(files) {
      const data = {
        type: 'REQUEST_SAVE',
        data: {
          elements: JSON.parse(localStorage.getItem('excalidraw')),
          appState: JSON.parse(localStorage.getItem('excalidraw-state')),
          files: files
        }
      }
      this.$refs.excalidrawIframe.contentWindow.postMessage(data, '*')
    },
    update() {
      this.saveBtnUpdating = true
      this.currentContext = JSON.stringify(this.excalidrawData)
      txtApi.editMarkdownByPath({
        relativePath: encodeURI(this.file.path + this.file.name),
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        mountFileId: this.$store.state.user.userId !== this.file.userId ? this.file.id : '',
        contentText: this.currentContext,
      }).then(() => {
        this.saveBtnUpdating = false
        this.saved = true
        this.title = this.file.name
        this.$emit('onEdit', this.saved)
        this.$refs.historyPopover.loadHistoryList(this.file.id)
        if (this.thisEditorClosing) {
          this.thisEditorClosing = false
          this.$emit('onClose')
        }
      }).catch(() => {
        this.thisEditorClosing = false
        this.saveBtnUpdating = false
      })
    },
    clearExcalidrawCache() {
      localStorage.removeItem('excalidraw')
      localStorage.removeItem('excalidraw-state')
      localStorage.removeItem('version-dataState')
      localStorage.removeItem('version-files')
    },
    getDataBase() {
      const request = indexedDB.open("files-db", 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("files-store")) {
          db.createObjectStore("files-store", { keyPath: "id" });
        }
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        this.getData(db);
      };
    },
    // 获取所有数据
    getData(db) {
      const transaction = db.transaction("files-store", "readonly");
      const store = transaction.objectStore("files-store");
      const getAllRequest = store.getAll();
      const files = {}
      getAllRequest.onsuccess = (event) => {
        const data = event.target.result;
        data.forEach((item) => {
          files[item.id] = item;
        });
        this.loadExcalidrawFiles(files);
      };
      getAllRequest.onerror = (event) => {
        console.error("Error getting data:", event.target.error);
      };
    },
    handleMessage(event) {
      const editWindow = this.$refs.excalidrawIframe.contentWindow
      if (event.source !== editWindow) {
        return
      }
      const payload = event.data
      switch (payload.type) {
        case 'EXCALIDRAW_READY':
          this.updateContent()
          break
        case 'INIT_DONE':
          this.ready = true
          this.$emit('onReady')
          break
        case 'CHANGE_FILE':
          if (!this.viewHistory) {
            const data = JSON.parse(localStorage.getItem('excalidraw'))
            if (_.isEqual(this.excalidrawData.elements, data)) {
              this.saved = true
              if (this.title === `*${this.file.name}`) {
                this.title = this.file.name
              }
            } else {
              this.saved = false
              this.title = `*${this.file.name}`
            }
            this.$emit('onEdit', this.saved)
          }
          break

        case 'SAVE_FILE':
          if (typeof payload.data === 'string') {
            this.excalidrawData = JSON.parse(payload.data)
          } else {
            this.excalidrawData = payload.data
          }
          if (!this.saved) {
            this.update()
          }
          break
      }
    },
    openUrl() {
      window.open(this.excalidrawUrl)
    }
  },
}
</script>

<style lang="scss" scoped>

@import 'src/styles/iframe.scss';

.excalidraw-content {
  z-index: 999;
  position: absolute;
  top: 2.5rem;
  left: 0;
  width: 100%;
  height: calc(100% - 2.5rem);

  > > > .dark-button {
    background: #3e3e3e;
    border: 1px solid #3e3e3e;
    color: #ffffff;
  }

  > > > .dark-button:hover {
    color: #409EFF;
    background-color: #181818;
  }

  .excalidraw-title {
    z-index: 2001;
    position: relative;

    .excalidraw-title-name {
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

    .excalidraw-operation {
      display: flex;
      float: right;
      margin-right: 15px;
      line-height: 32px;
    }
  }

  .excalidraw-iframe {
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
