import api from '@/api/file-api'
export default {

  data() {
    return {
      basePath: '/',
      pathList: [{ folder: '' }],
      currentDirectory: '/', // 当前路径
    }
  },
  mounted() {
    // 监听返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.goBack, false)
  },
  methods: {
    // 浏览器的返回事件
    goBack() {
      if (this.pathList.length <= 1) {
        const queryTagId = this.$route.query.tagId
          ? `&tagId=${this.$route.query.tagId}`
          : ''
        const keyword = this.$route.query.keyword
          ? `&keyword=${this.$route.query.keyword}`
          : ''
        const basePath = this.getBasePath()
        this.$router.push(
          `/?vmode=${this.vmode}&path=${encodeURIComponent(
            this.path
          )}${queryTagId}${basePath}${keyword}`
        )
        return
      }
      this.lastLink()
    },
    lastLink() {
      let keywordQuery = ''
      const searchPathIndex = this.pathList.findIndex(item => item.search)
      if (searchPathIndex === this.pathList.length - 1) {
        keywordQuery = '&keyword='
      }
      this.handleLink(
        this.pathList[this.pathList.length - 2],
        this.pathList.length - 2,
        undefined,
        undefined,
        keywordQuery
      ).then(r => {})
    },
    async handleLink(item, index, unPushLink, unRefresh, keywordQuery) {
      this.pathList.splice(
        this.pathList.findIndex((v, i) => i === index + 1),
        this.pathList.length - (index + 1)
      )
      if (item && item.search) {
        if (item.searchKey) {
          this.searchFileByKeyword(item.searchKey)
        } else if (item.row) {
          this.searchFileAndOpenDir(item.row.id)
        }
      } else {
        this.pathList.forEach((p, number) => {
          if (number === 0) {
            this.path = ''
          } else if (number === this.pathList.length) {
          } else {
            this.path += '/' + this.pathList[number].folder
          }
          this.path = this.path.replace(/\\/g, '/')
        })
        let queryFolder = localStorage.getItem('mountFileOwner') ? localStorage.getItem(this.path) : this.$route.query.folder
        if (localStorage.getItem('mountFileOwner') && !queryFolder) {
          queryFolder = await this.getMountFolderId(this.$route.query.folder, localStorage.getItem('mountFileOwner'), this.path)
        }
        let searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''
        if (!unPushLink) {
          const queryTagId = this.$route.query.tagId
            ? `&tagId=${this.$route.query.tagId}`
            : ''
          const basePath = this.getBasePath()
          if (keywordQuery !== '&keyword=') {
            keywordQuery = this.$route.query.keyword
              ? `&keyword=${this.$route.query.keyword}`
              : ''
          } else {
            keywordQuery = ''
          }
          const searchPathIndex = this.pathList.findIndex(item => item.search)
          if (searchPathIndex < 0) {
            keywordQuery = ''
            searchOpenFolder = ''
          }
          this.$router.push(`?vmode=${this.vmode}&path=${encodeURIComponent(this.path)}${queryFolder ? '&folder=' + queryFolder : ''}${queryTagId}${basePath}${keywordQuery}${searchOpenFolder}`)
        }
        if (!unRefresh) {
          this.pagination.pageIndex = 1
          this.getFileListEnter()
        }
      }
    },
    getMountFolderId(currentFolder, fileUsername, path) {
      return new Promise((resolve, reject) => {
        api.getMountFolderId({
          otherFileId: currentFolder,
          fileUsername: fileUsername,
          path: path
        })
          .then(res => {
            if (res.data) {
              resolve(res.data)
            } else {
              resolve('')
            }
          })
          .catch(error => {
            reject('')
          })
      })
    },
    getBasePath() {
      let basePath = this.$route.query.basePath ? `&basePath=${this.$route.query.basePath}` : ''
      if (!this.path || this.path.length < 2) {
        this.basePath = '/'
        return ''
      }
      return basePath
    },
    getQueryPath() {
      // 去掉this.$route.query.basePath最后的/
      let basePath = this.$route.query.basePath ? this.$route.query.basePath : '/'
      if (basePath) {
        if (basePath.lastIndexOf('/') === basePath.length - 1) {
          basePath = basePath.substring(0, basePath.length - 1)
        }
      }
      return encodeURIComponent(basePath + this.$route.query.path)
    },
  }
}
