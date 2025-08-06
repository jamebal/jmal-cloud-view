// 快捷键处理
export default {
  data() {
    return {
      drawer: false,
      drawerShowTime: 0,
    }
  },
  mounted() {
    // 获取键盘事件
    window.addEventListener('keydown', this.keydown)
    window.addEventListener('keyup', this.keyup)
  },
  beforeDestroy() {
    // 移除事件监听
    window.removeEventListener('keydown', this.keydown, false)
    window.removeEventListener('keyup', this.keyup, false)
  },
  computed: {
    cmdKey() {
      return navigator.platform.startsWith('Mac') ? '⌘' : 'Ctrl'
    },
  },
  methods: {
    checkCmdKey(event) {
      const isMac = navigator.platform.startsWith('Mac')
      const { ctrlKey, metaKey } = event
      return (isMac && metaKey) || (!isMac && ctrlKey)
    },
    keydown(event) {
      const { keyCode } = event
      const isCmd = this.checkCmdKey(event)
      const checkPreviewVisible = this.checkPreviewVisible()
      // space
      if (keyCode === 32 && this.selectRowData.length > 0 && !checkPreviewVisible) {
        if (!this.drawer) {
          this.drawer = true
          this.drawerShowTime = Date.now()
        } else {
          this.drawer = false
        }
        event.preventDefault()
        event.stopPropagation()
      }
      // F2
      if (keyCode === 113 && this.selectRowData.length > 0 && !checkPreviewVisible) {
        this.renameFileName = this.rowContextData.name
        this.editingIndex = this.rowContextData.index
        event.preventDefault()
        event.stopPropagation()
      }
      // Del
      if (keyCode === 8 && !this.inputting && this.selectRowData.length > 0 && !checkPreviewVisible) {
        this.removeOperation()
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + A / cmd + A
      if (isCmd && keyCode === 65 && !checkPreviewVisible) {
        if (this.inputting || this.editingIndex !== -1) {
          event.target.select()
        } else {
          this.$nextTick(() => {
            if (this.$refs.fileListTable) {
              this.$refs.fileListTable.toggleAllSelection()
            }
          })
          event.preventDefault()
          event.stopPropagation()
        }
      }
      // ctrl + C / cmd + C
      if (isCmd && keyCode === 67 && !checkPreviewVisible && !this.inputting && this.selectRowData.length > 0) {
        this.copyOperation()
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + V / cmd + V
      if (isCmd && keyCode === 86 && !checkPreviewVisible && !this.inputting && this.fileClipboard.length > 0) {
        // copy
        this.onCopy(this.getClipboardFileIdList, this.path, this.currentFolder)
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + X / cmd + X
      if (isCmd && keyCode === 88 && !checkPreviewVisible && !this.inputting && this.fileClipboard.length > 0) {
        // move
        this.onMove(this.getClipboardFileIdList, this.path, this.currentFolder)
        event.preventDefault()
        event.stopPropagation()
      }
      // ctrl + P / cmd + P
      if (isCmd && keyCode === 80 && !checkPreviewVisible) {
        this.$refs.searchInput.focus()
        event.preventDefault()
        event.stopPropagation()
      }
    },
    keyup(event) {
      const { keyCode } = event
      // space
      if (keyCode === 32) {
        if (this.drawer && Date.now() - this.drawerShowTime >= 500) {
          this.drawer = false
        }
      }
    },
  },
}
