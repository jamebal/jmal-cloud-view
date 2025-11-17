// 全局右键菜单操作
export default {
  props: {
    contextMenus: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      contextmenuDisabled: false,
    }
  },
  methods: {
    contextmenuClick(operation) {
      this.fileListTableClearSelection()
      if (operation.startsWith('order')) {
        const [prop, order] = operation.split('-')
        this.handleSortChange(prop, order)
        return
      }
      switch (operation) {
        case 'vmode-list':
          this.grid = true
          this.changeVmode()
          break
        case 'vmode-grid':
          this.grid = false
          this.changeVmode()
          break
        case 'refresh':
          this.getFileListEnter()
          break
        case 'createTextFile':
          this.newCreateFileDialogTitle = '新建文本文件'
          this.createNewFile('txt')
          break
        case 'createBurnNote':
          this.newCreateFileDialogTitle = '新建阅后即焚'
          this.createBurnNote()
          break
        case 'createFolder':
          this.newCreateFileDialogTitle = '新建文件夹'
          this.createNewFile('')
          break
        case 'createDrawioFile':
          this.newCreateFileDialogTitle = '新建流程图'
          this.createNewFile('drawio')
          break
        case 'createMinderFile':
          this.newCreateFileDialogTitle = '新建思维导图'
          this.createNewFile('mind')
          break
        case 'createWordFile':
          this.newCreateFileDialogTitle = '新建Word文档'
          this.createNewFile('docx')
          break
        case 'createExcalidrawFile':
          this.newCreateFileDialogTitle = '新建白板'
          this.createNewFile('excalidraw')
          break
        case 'createExcelFile':
          this.newCreateFileDialogTitle = '新建Excel工作表'
          this.createNewFile('xlsx')
          break
        case 'createPPTFile':
          this.newCreateFileDialogTitle = '新建PPT演示文档'
          this.createNewFile('pptx')
          break
        case 'createMarkdownFile':
          this.newDocument()
          break
        case 'clearTrash':
          this.clearTrash()
          break
      }
    },
    // 加载菜单查看状态
    loadContextMenus() {
      if (this.contextMenus.length < 1) {
        this.contextmenuDisabled = true
        return
      }
      let container = document.querySelector('.dashboard-container')
      if (this.$refs.homeContextmenu.references.length === 0) {
        this.$refs.homeContextmenu.addRef({ el: container, vnode: container })
      }
      const viewModeIndex = this.contextMenus.findIndex(
        item => item.operation === 'viewMode'
      )
      const arrangementModeIndex = this.contextMenus.findIndex(
        item => item.operation === 'arrangement'
      )
      if (viewModeIndex > -1) {
        const child = this.contextMenus[viewModeIndex].child
        if (this.grid) {
          child[0].iconClass = 'menu-empty'
          child[1].iconClass = 'menu-point'
        } else {
          child[0].iconClass = 'menu-point'
          child[1].iconClass = 'menu-empty'
        }
      }
      if (arrangementModeIndex > -1) {
        const child = this.contextMenus[arrangementModeIndex].child
        const prop = this.sortable.prop
        child.forEach(item => {
          const orderProp = item.orderProp
          if (orderProp === prop) {
            child.map(item => {
              if (orderProp === item.orderProp  && this.sortable.order === item.order) {
                item.iconClass = 'menu-' + this.sortable.order
              } else {
                item.iconClass = 'menu-null'
              }
              return item
            })
          }
        })
      }
    },
    // 新建文档
    newDocument() {
      window.open(`/setting/website/manager-articles?operation=new`, '_blank')
    },
    handleSortChange(command, order) {
      this.sortable.order = order
      switch (command) {
        case 'orderName':
          this.sortChangeOfMenu('name', 1)
          break
        case 'orderSize':
          this.sortChangeOfMenu('size', 2)
          break
        case 'orderUpdateDate':
          this.sortChangeOfMenu('updateDate', 3)
          break
        case 'orderUploadDate':
          this.sortChangeOfMenu('uploadDate', -1)
          break
      }
    },
  },
}
