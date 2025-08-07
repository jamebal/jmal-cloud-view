import api from '@/api/file-api'
import _ from 'lodash'

export default {
  data() {
    return {
      debounceGetFileList: null,// 获取文件列表防抖
      fileList: [],
      pageLoadCompleteList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50],
      },
      clientHeight: 500,
      tableHeadNameWidth: 500,
      // 表头数据
      tableHead: [
        {
          name: '',
          label: '',
          index: 0,
        },
        {
          name: '',
          label: '',
          index: 1,
        },
        {
          name: 'name',
          label: '名称',
          sortable: true,
          index: 2,
        },
        {
          name: 'size',
          label: '大小',
          sortable: true,
          index: 3,
        },
        {
          name: 'updateDate',
          label: '修改日期',
          sortable: true,
          index: 4,
        },
      ],
      tableLoading: true,
      finished: false,
      grid: this.defaultGrid,
      vmode: this.defaultGrid ? 'grid' : 'list',
      gridColumnNum: -1,
      gridPaddingRight: 0,
      gridItemWidth: 125,
      gridMinHeight: 125,
      onCreateFilename: '',
    }
  },
  created() {
    this.debounceGetFileList = _.debounce((onLoad) => {
      this.getFileList(onLoad)
    }, 200)
  },
  mounted() {
// 加载布局
    if (this.$route.query.vmode) {
      this.vmode = this.$route.query.vmode
    } else {
      if (this.defaultGrid) {
        this.vmode = 'grid'
      } else {
        this.vmode = 'list'
      }
    }
    if (this.vmode === 'list') {
      this.grid = false
      if (!this.selectFile) {
        this.lessClientHeight = 140
      }
    } else {
      this.grid = true
      if (!this.selectFile) {
        this.lessClientHeight = 106
      }
      this.containerResize()
    }
    // 加载url上的path
    if (this.$route.query.path !== '/') {
      const path = decodeURI(this.$route.query.path)
      this.pathList.splice(1, 1)
      path.split('/').forEach((pathName, index) => {
        if (index > 0) {
          const item = {}
          item['folder'] = pathName
          this.pathList.push(item)
        }
      })
    }
    if (this.$route.query.searchOpenFolder && this.path && !this.$route.query.keyword) {
      localStorage.setItem(this.path, this.$route.query.searchOpenFolder)
    }
    if (this.$route.query.highlight) {
      this.onCreateFilename = this.$route.query.highlight
      this.clearOnCreateFilename()
    }
    // remove query.basePath
    if (this.$route.query.basePath) {
      this.basePath = this.$route.query.basePath
    }

    // remove query.folder
    if (this.$route.query.searchOpenFolder && this.$route.query.keyword) {
      const query = { ...this.$route.query }
      delete query.searchOpenFolder
      this.$router.replace({ query })
    }

    if (this.$route.query.keyword) {
      this.filterOption = localStorage.getItem('searchFilterOption') ? JSON.parse(localStorage.getItem('searchFilterOption')) : {}
      this.$refs.searchOption.setFilterOption(this.filterOption)
    }

    let that = this
    window.onresize = function() {
      that.clientHeight = document.documentElement.clientHeight - that.lessClientHeight
    }

    setTimeout(() => {
      if (!this.getFileListed) {
        this.getFileListEnter()
      }
    }, 50)
  },
  methods: {
    onmessage(msg) {
      let fileDoc = msg.body
      const url = msg.url
      let index = this.fileList.findIndex(file => file.id === fileDoc.id)
      if ('updateFile' === url) {
        if (index > -1) {
          if (fileDoc.m3u8) {
            this.fileList[index].m3u8 = fileDoc.m3u8
          }
          this.fileList[index].size = fileDoc.size
          this.fileList[index].agoTime = 1
          this.fileList[index].updateDate = fileDoc.updateDate
        }
      }
      let thisPath = this.path
      if (this.listModeSearchOpenDir) {
        const row = this.pathList[this.pathList.length - 1]
        thisPath = `${row.row.path}${row.folder}`
      }
      console.log('fileDoc', fileDoc)
      const isCurrentPath = (thisPath + '/') === fileDoc
      if ('deleteFile' === url && (isCurrentPath || this.$route.path.startsWith('/recently'))) {
        this.getFileListEnter()
      }
      if ('createFile' === url) {
        if (fileDoc.$set) {
          this.onCreateFilename = fileDoc.$set.name
        }
        if (fileDoc && fileDoc.name) {
          this.onCreateFilename = fileDoc.name
        }
        if (!thisPath) {
          thisPath = ''
        }
        if (fileDoc) {
          if (fileDoc.$set) {
            let path = fileDoc.$set.path
            path = path.replace(/\\/g, '/')
            if (thisPath + '/' === path) {
              this.getFileListEnter()
            }
          } else {
            if (thisPath + '/' === fileDoc.path) {
              this.getFileListEnter()
            }
          }
        }
        this.clearOnCreateFilename()
      }
      if (this.$route.path.startsWith('/trash') && msg.url === 'operationTips') {
        this.getFileListEnter()
      }
    },
    // 延时清空onCreateFilename
    clearOnCreateFilename() {
      setTimeout(() => {
        this.onCreateFilename = ''
      }, 2000)
    },
    gridItemClick(row, event) {
      if (this.selectFile) {
        this.fileClick(row, event)
      }
      if (this.checkCmdKey(event)) {
        this.pinSelect(row, event)
        this.$refs.fileListTable.toggleRowSelection([{ row: row }])
        return
      }
      this.pinSelect(row, event)
    },
    containerResize() {
      // gird视图
      const container = document.querySelector('.dashboard-container')
      let clientWidth = container.clientWidth
      this.clientHeight = document.documentElement.clientHeight - this.lessClientHeight
      this.gridItemWidth = 125
      if (this.queryFileType === 'image') {
        this.gridItemWidth = 165
        this.gridColumnNum = Math.trunc((clientWidth - 10) / this.gridItemWidth)
      } else {
        this.gridColumnNum = Math.trunc((clientWidth - 10) / this.gridItemWidth)
      }
      const gridWidth = (clientWidth - 10) / this.gridColumnNum
      this.gridPaddingRight = gridWidth - this.gridItemWidth + 10
      this.showUpdateDateItem = clientWidth >= 900;
      this.showSizeItem = clientWidth >= 500;
      let gridRowNum = Math.round(
        this.clientHeight / (clientWidth / this.gridColumnNum)
      )

      if (this.finished && this.pagination.pageIndex === 1) {
        const actualRows =  Math.ceil(this.fileList.length / this.gridColumnNum)
        const gridMinHeight = actualRows * this.gridItemWidth + (actualRows - 1) * 10
        if (gridMinHeight < this.clientHeight) {
          this.gridMinHeight = gridMinHeight
        }
      }

      const lastPageSize = this.pagination.pageSize
      const thisPageSize = gridRowNum * this.gridColumnNum + this.gridColumnNum
      if (thisPageSize !== lastPageSize) {
        this.pagination.pageSize = thisPageSize
        if (this.$route.query.tagId) {
          this.queryCondition.tagId = this.$route.query.tagId
        }
        this.getFileListEnter()
      }
      this.$nextTick(() => {
        // list 视图
        const fileListTableWidth = this.$refs.fileListTableContainer.offsetWidth
        this.tableHeadNameWidth = fileListTableWidth - (80 + 200 + 250) - 90
      })

      // 使列表可拖拽
      this.rowDrop()
      this.drawRectangle()
    },
    // 切换布局
    changeVmode() {
      this.grid = !this.grid
      this.vmode = 'list'
      if (this.grid) {
        this.vmode = 'grid'
        this.lessClientHeight = 106
      } else {
        this.lessClientHeight = 140
        this.$refs.fileListTable.setHeight()
      }
      this.clientHeight =
        document.documentElement.clientHeight - this.lessClientHeight
      if (!this.path) {
        this.path = ''
      }
      this.editingIndex = -1
      const queryTagId = this.$route.query.tagId ? `&tagId=${this.$route.query.tagId}` : ''
      const basePath = this.getBasePath().replace(/#/g, '%23')
      const keyword = this.$route.query.keyword ? `&keyword=${this.$route.query.keyword}` : ''
      const folder = this.$route.query.folder ? `&folder=${this.$route.query.folder}` : ''
      const searchOpenFolder = this.$route.query.searchOpenFolder ? `&searchOpenFolder=${this.$route.query.searchOpenFolder}` : ''
      this.$router.push(`?vmode=${this.vmode}&path=${this.path.replace(/#/g, '%23')}${folder}${queryTagId}${basePath}${keyword}${searchOpenFolder}`)
      // 改变拖拽目标
      this.rowDrop()
      // 画矩形选取
      this.drawRectangle()
      this.loadContextMenus()
      // 使列表滑到顶部
      if (!this.grid) {
        if (this.fileListScrollTop > 0) {
          this.$refs.fileListTable.pagingScrollTopLeft()
        }
      }
      this.fileListScrollTop = 0
    },
    // 请求之前的准备
    beforeLoadData(onLoad) {
      if (onLoad) {
        this.pagination.pageIndex++
      } else {
        this.pagination.pageIndex = 1
      }
      this.currentDirectory = decodeURIComponent(this.getQueryPath())
      this.pageLoadCompleteList[this.pagination.pageIndex] = false
      this.tableLoading = true
      this.finished = false
    },
    // 填充数据
    loadData(res, onLoad) {
      if (!this.$refs.fileListTable) {
        return
      }
      if (onLoad) {
        res.data.forEach((file, number) => {
          file['index'] =
            (this.pagination.pageIndex - 1) * this.pagination.pageSize + number
          this.fileList.push(file)
        })
      } else {
        this.fileList = res.data
        this.fileList.map((item, index) => {
          item.index = index
        })
        this.$refs.fileListTable.reloadData(this.fileList)
        setTimeout(() => {
          if (this.$refs.fileListTable) {
            this.$refs.fileListTable.reloadData(this.fileList)
          }
        }, 0)
      }
      // 数据全部加载完成
      if (this.fileList.length >= res.count) {
        this.finished = true
      }
      this.tableLoading = false
      this.clientHeight =
        document.documentElement.clientHeight - this.lessClientHeight
      this.listModeSearch = false
      this.pagination['total'] = res.count
      this.$nextTick(() => {
        this.containerResize()
        this.tableLoading = false
        this.pageLoadCompleteList[this.pagination.pageIndex] = true
      })
      // 加载菜单状态
      this.loadContextMenus()
      // 高亮新增的文件
      this.highlightNewFile()
      // 设置挂载文件的用户名(文件的所有者)
      this.fileUsername = ''
      this.setMountFileOwner(res.props)
      const path = this.$route.query.path ? this.$route.query.path : '/'
      const basePath = this.$route.query.basePath
        ? this.$route.query.basePath
        : '/'
      this.path = basePath + path
      this.path = this.path.replace(/\\/g, '/')
      this.path = this.path.replace(/\/\//g, '/')
      if (this.path === '/') {
        this.path = ''
      }
    },
    // 设置挂载文件的用户名(文件的所有者)
    setMountFileOwner(props) {
      localStorage.removeItem('mountFileOwner')
      if (this.$route.query.folder) {
        if (props && props.fileUsername && props.fileUsername !== this.$store.getters.name) {
          this.fileUsername = props.fileUsername
          localStorage.setItem('mountFileOwner', props.fileUsername)
        }
      }
    },
    // 高亮新增文件
    highlightNewFile() {
      if (this.onCreateFilename) {
        let index = this.fileList.findIndex(
          item => item.name === this.onCreateFilename
        )
        if (index > -1) {
          let row = this.fileList[index]
          setTimeout(() => {
            this.fileListTableClearSelection()
            this.$refs.fileListTable.toggleRowSelection([
              { row: row, selected: true },
            ])
          }, 0)
        }
      }
    },
    getFileListEnter(onLoad) {
      this.debounceGetFileList(onLoad)
    },
    getFileList(onLoad) {
      if (this.$route.query.keyword) {
        if (this.$route.query.keyword !== 'undefined') {
          this.searchFileName = this.$route.query.keyword
        }
        this.searchInputBlur()
        const searchPathIndex = this.pathList.findIndex(item => item.search)
        if (this.$route.query.searchOpenFolder && searchPathIndex > -1) {
          this.searchFileAndOpenDir(this.$route.query.searchOpenFolder, onLoad)
        } else {
          this.searchFile(this.searchFileName)
        }
      } else {
        this.searchFileName = ''
        this.getFileListed = true
        this.beforeLoadData(onLoad)
        api.fileList({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          currentDirectory: this.getQueryPath(),
          folder: this.$route.query.folder,
          queryFileType: this.queryFileType,
          sortableProp: this.sortable.prop,
          order: this.sortable.order,
          isFolder: this.queryCondition.isFolder,
          isFavorite: this.queryCondition.isFavorite,
          isMount: this.queryCondition.isMount,
          isTrash: this.queryCondition.isTrash,
          tagId: this.queryCondition.tagId,
          queryCondition: this.queryCondition,
          pageIndex: this.pagination.pageIndex,
          pageSize: this.pagination.pageSize,
        })
          .then(res => {
            this.loadData(res, onLoad)
          }).catch(() => {
          this.tableLoading = false
        })
      }
    },
    pinSelect(row, event) {
      if (event.shiftKey && this.selectOrigin > -1) {
        const origin = this.selectOrigin
        this.selectEnd = row.index
        let diff = this.selectEnd - origin
        // 先清除选中
        this.fileListTableClearSelection()
        if (diff === 0) {
          this.selectOrigin = -1
        }
        if (diff > 0) {
          for (let i = origin; i <= this.selectEnd; i++) {
            this.$refs.fileListTable.toggleRowSelection([{ row: this.fileList[i], selected: true }])
          }
        }
        if (diff < 0) {
          for (let i = this.selectEnd; i <= origin; i++) {
            this.$refs.fileListTable.toggleRowSelection([{ row: this.fileList[i], selected: true }])
          }
        }
      }
      this.changeSelectedStyle(this.$refs.fileListTable.tableSelectData)
    },
    //双击
    dblclick(row, column, cell, event) {
      this.fileClick(row, event)
    },
    // 单元格点击事件
    cellClick(row, column, cell, event) {
      if (this.selectFile) {
        this.fileClick(row, event)
        return
      }
      clearTimeout(this.Loop)
      if (this.editingIndex === -1) {
        const columnIndex = column.index
        if (columnIndex === 2) {
          if (this.selectRowData.length < 1) {
            if (row.index !== this.editingIndex) {
              this.editingIndex = -1
            }
          }
        }
        if (this.checkCmdKey(event)) {
          this.pinSelect(row, event)
          this.$refs.fileListTable.toggleRowSelection([{ row: row }])
          return
        }
        this.pinSelect(row, event)
      }
    },
  }
}
