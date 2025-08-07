import store from '@/store'
import fileConfig from '@/utils/file-config'

export default {

  computed: {
    fileClipboard() {
      return store.getters.fileClipboard
    },
    getClipboardFileIdList() {
      return store.getters.fileClipboard.map(file => file.id)
    },
  },
  props: {
    showClipboard: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    // 复制下载链接
    copyDownloadLink(row, elName) {
      let url = window.location.origin + fileConfig.previewUrl(this.$store.getters.name, row, undefined, this.shareToken)
      if (row.isFolder) {
        url = fileConfig.packageDownloadUrl(row.id, row.name + '.zip', this.shareToken)
      }
      let clipboard = new Clipboard(elName, {
        text: function() {
          return url
        },
      })
      clipboard.on('success', () => {
        this.$message({ message: '复制成功', type: 'success', duration: 1000 })
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持自动复制',
          type: 'warning',
          duration: 1000,
        })
        clipboard.destroy()
      })
    },
  }
}
