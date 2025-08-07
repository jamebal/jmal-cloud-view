import api from '@/api/file-api'
import fileConfig from '@/utils/file-config'
import { directLinkSubMenus, fileOperations } from '@/utils/file-operations'
import { suffix } from '@/utils/file-type'

export default {
  props: {
    singleMenus: {
      type: Array,
      default: function() {
        return [
          fileOperations.open,
          { iconClass: 'link', label: '直链', operation: 'directLink', child: directLinkSubMenus },
          fileOperations.download,
          { iconClass: 'share', label: '分享...', operation: 'share' },
          { iconClass: 'tag', label: '标签...' , operation: 'tag'},
          { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
          fileOperations.detail,
          fileOperations.copyOnly,
          fileOperations.rename,
          fileOperations.copy,
          fileOperations.remove,
        ]
      },
    },
    multipleRightMenus: {
      type: Array,
      default: function() {
        return [
          {
            iconClass: 'menu-deselect',
            label: '取消选定',
            operation: 'deselect',
          },
          fileOperations.download,
          { iconClass: 'tag', label: '标签', operation: 'tag' },
          fileOperations.copyOnly,
          fileOperations.copy,
          fileOperations.remove,
        ]
      },
    },
  },
  data() {
    return {
      isJustHideMenus: false,
      menusIsMultiple: false,
      menus: [],
      rowContextData: {},
    }
  },
  methods: {
    contextmenu(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    show() {
      const that = this
      this.contextmenuDisabled = true
      setTimeout(function() {
        that.contextmenuDisabled = false
      }, 1000)
    },
    hide() {
      const that = this
      this.isJustHideMenus = true
      setTimeout(function() {
        that.isJustHideMenus = false
      }, 100)
      this.cellMouseIndex = -1
    },
    setMenus(row) {
      this.menus = JSON.parse(JSON.stringify(this.singleMenus))
      // 挂载的文件
      const owner = localStorage.getItem('mountFileOwner')
      const notSelf = row.userId && row.userId !== this.$store.getters.userId
      if ((this.$route.query.folder && owner) || notSelf) {
        // 根据权限设置菜单
        this.setMenusByPermission(row)
      } else {
        if (row.suffix && row.suffix === 'md' && this.queryFileType !== 'trash') {
          this.menus.splice(this.getIndexOfFileContextMenus(fileOperations.copyOnly.operation), 0, {
            iconClass: 'menu-edit1',
            label: '编辑',
            operation: 'edit',
          })
        }
        if (row.isFolder && row.mountFileId) {
          const reservations = ['open', 'tag', 'favorite', 'remove']
          // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
          this.menus = this.menus.filter(item =>
            reservations.includes(item.operation)
          )
        }
        if (!row.isFolder && this.queryFileType !== 'trash') {
          // 创建副本
          const copyIndex = this.getIndexOfFileContextMenus(fileOperations.copy.operation)
          if (copyIndex > -1) {
            this.menus.splice(copyIndex, 0, fileOperations.duplicate)
          }
        }
        if (row.ossFolder) {
          const reservations = ['open', 'tag']
          // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
          this.menus = this.menus.filter(item =>
            reservations.includes(item.operation)
          )
        }
        this.setMenusCopyDownLoadLinks(row)
      }
      this.preliminaryRowData(row)
    },
    setFileContextMenusDivider() {
      // 下载栏下面添加分隔符
      const downloadIndex = this.getIndexOfFileContextMenus(fileOperations.download.operation)
      if (downloadIndex > -1 && this.menus.length - 1 > downloadIndex && !this.menus[downloadIndex + 1].divider) {
        this.menus.splice(downloadIndex + 1, 0, { divider: true, operation: 'divider' })
      }
      // 删除栏上面添加分隔符
      const removeIndex = this.getIndexOfFileContextMenus(fileOperations.remove.operation)
      if (removeIndex > 0 && !this.menus[removeIndex - 1].divider) {
        this.menus.splice(removeIndex, 0, { divider: true, operation: 'divider' })
      }
      // 详情栏下面添加分隔符
      const detailIndex = this.getIndexOfFileContextMenus(fileOperations.detail.operation)
      if (detailIndex > -1 && this.menus.length - 1 > detailIndex && !this.menus[detailIndex + 1].divider) {
        this.menus.splice(detailIndex + 1, 0, { divider: true, operation: 'divider' })
      }
    },
    getIndexOfFileContextMenus(operation) {
      return this.menus.findIndex(item => item.operation === operation)
    },
    setMenusCopyDownLoadLinks(row) {
      if (row.isShare) {
        // 获取this.menus中download的索引
        const downloadIndex = this.menus.findIndex(
          item => item.operation === 'download'
        )
        this.shareToken = undefined
        // 在download之前添加复制下载链接选项
        this.addMenusCopyDownLoadLinks(downloadIndex)
        if (row.isPrivacy) {
          // 如果是私密分享需要先获取shareToken
          api.generateShareToken({fileId: row.id}).then(res => {
            this.shareToken = res.data
          }).catch(() => {
            this.menus.splice(downloadIndex, 1)
          })
        }
      }
    },
    addMenusCopyDownLoadLinks(index) {
      this.menus.splice(index, 0, {
        iconClass: 'menu-fuzhi',
        label: '复制下载链接',
        operation: 'copyDownloadLink',
      })
    },
    setMenusByPermission(file) {
      const reservations = ['open', 'download', 'details']
      // 删除this.menus中不要的菜单, 仅保留reservations中的菜单
      this.menus = this.menus.filter(item =>
        reservations.includes(item.operation)
      )
      if (file.operationPermissionList && file.operationPermissionList.length > 0) {
        if (file.operationPermissionList.indexOf('PUT') > -1) {
          this.menus.splice(this.menus.length, 0, fileOperations.rename)
        }
        if (file.operationPermissionList.indexOf('UPLOAD') > -1) {
          if (file.operationPermissionList.indexOf('DELETE') > -1) {
            this.menus.splice(this.menus.length, 0, fileOperations.copy)
            this.menus.splice(this.menus.length, 0, fileOperations.copyOnly)
          }
          if (!file.isFolder) {
            this.menus.splice(this.menus.length, 0, fileOperations.duplicate)
          }
        }
        if (file.operationPermissionList.indexOf('DELETE') > -1) {
          this.menus.splice(this.menus.length, 0, fileOperations.remove)
        }
      }
      this.setMenusCopyDownLoadLinks(file)
    },
    // 鼠标右击
    rowContextmenu(row) {
      this.$refs.homeContextmenu.hide()
      if (this.selectFile) {
        return
      }
      if (
        this.$refs.fileListTable.tableSelectData.length > 1 &&
        this.$refs.fileListTable.tableSelectData.findIndex(item => item.index === row.index) > -1
      ) {
        this.menusIsMultiple = true
        this.menus = JSON.parse(JSON.stringify(this.multipleRightMenus))
        this.highlightFavorite(false, false)
      } else {
        this.fileListTableClearSelection()
        this.$refs.fileListTable.toggleRowSelection([{ row: row }])
        this.menusIsMultiple = false
        this.setMenus(row)
      }

      // 设置分割线
      this.setFileContextMenusDivider()

      event.preventDefault()
      event.stopPropagation()
      const e = {}
      e.pageX = event.pageX + 5
      e.pageY = event.pageY + 20
      e.clientX = event.clientX + 50
      e.clientY = event.clientY + 2
      e.top = event.clientY
      e.left = event.clientX + 2

      const dividerSize = this.menus.filter(item => item.divider).length

      const containerWidth = 180 + 10
      const containerHeight = (this.menus.length - dividerSize)  * 35 + (dividerSize * 11) + 18 + 10
      const distanceToBottom = document.documentElement.clientHeight - event.clientY
      const distanceToRight = document.documentElement.clientWidth - event.clientX

      if (distanceToBottom < containerHeight) {
        e.top = event.clientY - (containerHeight - distanceToBottom)
      }
      if (distanceToRight < containerWidth) {
        e.left = event.clientX - containerWidth + 8
      }

      this.$refs.contextShow.showMenu(e)
      this.cellMouseIndex = -1
    },
    // 列表右键菜单操作
    menusOperations(operation, event) {
      switch (operation) {
        case 'share':
          // 分配标签
          this.share()
          break
        case 'tag':
          // 分配标签
          this.allocateTag()
          break
        case 'favorite':
          // 收藏
          this.favoriteOperating(true)
          break
        case 'edit':
          // 编辑
          window.open(
            `/setting/website/manager-articles?operation=editor&id=${this.rowContextData.id}`,
            '_blank'
          )
          break
        case 'open':
          // 打开
          this.fileClick(this.rowContextData, event)
          break
        case 'deselect':
          // 取消选定
          this.fileListTableClearSelection()
          break
        case 'unFavorite':
          // 取消收藏
          this.favoriteOperating(false)
          break
        case 'details':
          this.drawer = true
          break
        case 'rename':
          // 重命名
          this.renameFileName = this.rowContextData.name
          this.editingIndex = this.rowContextData.index
          break
        case 'duplicate':
          // 创建副本
          this.duplicate()
          break
        case 'copy':
          // 移动或复制
          this.moveOrCopy()
          break
        case 'copyOnly':
          this.copyOperation()
          break
        case 'download':
          // 下载
          this.downloadFile()
          break
        case 'copyDownloadLink':
          // 复制下载链接
          this.copyDownloadLink(this.rowContextData, '.file-contextmenu')
          break
        case 'remove':
          // 删除
          this.removeOperation()
          break
        case 'sweep':
          // 清空回收站
          this.sweepFile()
          break
        case 'restore':
          // 返回原处
          this.restoreFile()
          break
        case 'manageDirectLink':
          // 管理直链
          this.directLinkDialogVisible = true
          this.directLinkDialogGetDirectLink(this.rowContextData)
          break
        case 'copyDirectLink':
          // 复制直链
          this.directLinkDialogGetDirectLink(this.rowContextData, true)
          break
      }
      this.$refs.contextShow.hideMenu()
    },
    // 点击文件或文件夹
    fileClick(row, event) {
      this.drawer = false
      if (this.queryFileType === 'trash') {
        return
      }
      if (this.editingIndex === row.index) {
        return
      }
      this.openingFile = row
      if (row.isFolder) {
        this.editingIndex = -1
        const queryTagId = this.$route.query.tagId ? `&tagId=${this.$route.query.tagId}` : ''
        const keyword = this.$route.query.keyword ? `&keyword=${this.$route.query.keyword}` : ''
        // 打开文件夹
        if (this.listModeSearch) {
          const item = {}
          item['folder'] = row.name
          item['search'] = true
          item['row'] = row
          this.pathList.push(item)
          this.pagination.pageIndex = 1
          const searchOpenFolder = row.id ? `&searchOpenFolder=${row.id}` : ''
          const path = this.$route.query.path ? `&path=${this.$route.query.path}` : ''
          const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
          const basePath = this.getBasePath()
          this.$router.push(
            `?vmode=${
              this.vmode
            }${path}${keyword}${searchOpenFolder}${folder}${queryTagId}${basePath}`
          )
          this.searchFileAndOpenDir(row.id)
        } else {
          let notHomePage = this.$route.path.length > 1
          if (
            notHomePage &&
            this.path + '/' !== row.path &&
            this.basePath.length === 1
          ) {
            this.basePath = row.path
          }

          this.path += '/' + row.name
          this.path = this.path.replace(/\\/g, '/')
          this.path = this.path.replace(/\/\//g, '/')
          // 去掉this.path开头的this.basePath
          this.path = this.path.replace(this.basePath, '/')
          const path = encodeURIComponent(this.path)
          const item = { folder: row.name, shareBase: row.shareBase }
          this.pathList.push(item)
          this.pagination.pageIndex = 1
          if (this.$store.getters.userId !== row.userId) {
            row.mountFileId = row.id
          }
          if (row.mountFileId) {
            localStorage.setItem(this.path, row.mountFileId)
          }
          const basePath = this.basePath && this.basePath.length > 1 ? `&basePath=${this.basePath}` : ''
          const searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''
          this.$router.push(`?vmode=${this.vmode}&path=${path}${row.mountFileId ? '&folder=' + row.mountFileId : ''}${queryTagId}${basePath}${keyword}${searchOpenFolder}`)
          this.openDir(row)
        }
      } else {
        if (this.selectFile) {
          let selectFile = row
          const selectData = this.$refs.fileListTable.tableSelectData
          if (selectData.length < 1 || selectData[0].id !== row.id) {
            this.fileListTableClearSelection()
            this.$refs.fileListTable.toggleRowSelection([{ row: row }])
            this.pinSelect(row, event)
          } else {
            this.fileListTableClearSelection()
            selectFile = {}
          }
          this.$emit('selectedFile', selectFile)
          return
        }
        const fileHandler = fileConfig.hasIframePreview(row.suffix, this.$store.getters.iframePreviewConfig)
        if (fileHandler !== null) {
          // iframe 预览
          this.iframePreviewVisible = true
          this.iframePreviewRow = row
          this.fileHandler = fileHandler
          return
        }
        if (row.contentType.startsWith('image')) {
          // 图片
          this.imagePreviewVisible = true
          this.imagePreviewRow = row
          return
        }
        if (suffix.simText.includes(row.suffix)) {
          // 文本文件
          this.textPreviewRow = row
          this.textPreviewVisible = true
          return
        }
        if (row.contentType.indexOf('video') > -1) {
          // 视频文件
          this.videoPreviewVisible = true
          this.videoPreviewRow = row
          return
        }
        if (row.contentType.indexOf('audio') > -1) {
          // 音频文件
          this.$store.dispatch('updateMessage', {
            event: 'onAddAudio',
            data: { row: row, audioCoverUrl: this.audioCoverUrl },
          })
          return
        }
        if (suffix.compressedFile.includes(row.suffix)) {
          // 压缩文件
          this.openCompressionVisible = true
          return
        }
        if (row.contentType.indexOf('office') > -1 || suffix.iframePreviewFile.includes(row.suffix)) {
          // iframe 预览
          this.iframePreviewVisible = true
          this.iframePreviewRow = row
          this.fileHandler = {}
          return
        }
        if (row.contentType.indexOf('utf-8') > -1) {
          // 文本文件
          this.textPreviewRow = row
          this.textPreviewVisible = true
          return
        }
        this.notPreviewDialogVisible = true
      }
    },
  }
}
