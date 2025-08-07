export default {
  props: {
    lessClientHeight: {
      type: Number,
      default: 106,
    },
    showSearchButton: {
      type: Boolean,
      default: true,
    },
    isCollectView: {
      type: Boolean,
      default: false,
    },
    showNavigation: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedRowIndices: new Set()
    }
  },
  methods: {
    sortChangeOfMenu(prop, headerIndex) {
      let tableHeader = document.querySelector('.el-table__header thead tr')
      // 去掉table-header上所有排序高亮
      tableHeader.childNodes.forEach(el => {
        if (el.className.indexOf('is-sortable') > -1) {
          this.removeClass(el, 'descending')
          this.removeClass(el, 'ascending')
        }
      })
      // 重新加上排序高亮
      let order = this.sortable.order
      if (headerIndex > -1) {
        this.addClass(tableHeader.children[headerIndex], order)
      }
      this.orderCustom = true
      this.sortChange({ prop: prop, order: order })
    },
    sortChange(column) {
      let { prop, order } = column
      if (this.orderCustom || this.listModeSearch) {
        this.sortable.prop = prop
        this.sortable.order = order
        this.pagination.pageIndex = 1
        if (this.listModeSearch) {
          this.searchFile(this.searchFileName)
        } else {
          this.getFileListEnter()
        }
      }
    },
    removeClass(el, className) {
      const str = el.className
      if (str.indexOf(className) > -1) {
        el.className = str.replace(className, '')
      }
    },
    addClass(el, className) {
      if (el) {
        el.classList.add(className)
      }
    },
    // 收集选中的index值作为数组 传递给rowRed判断变换样式
    handleSelectionChange(rows) {
      // 起点
      if (rows.length > 0) {
        this.selectOrigin = rows[0].index
        this.rowContextData = rows[0]
      }
      this.selectedRowIndices = new Set(rows.map(row => row.index));
      this.$refs.fileListTable.tableSelectData = rows
      this.selectRowData = rows
      this.changeSelectedStyle(rows)
    },
    changeSelectedStyle(rows) {
      if (this.stopSortChange) {
        return
      }
      let selectTotalSize = 0
      rows.forEach(item => {
        selectTotalSize += item.size
      })
      const item_name = this.tableHead[2]
      const item_size = this.tableHead[3]
      const item_date = this.tableHead[4]
      if (rows.length > 0) {
        const sumFileAndFolder = this.getShowSumFileAndFolder(rows)
        const sizeSum = this.getShowSumSize(selectTotalSize)
        item_name.label = sumFileAndFolder
        item_name.sortable = false
        item_size.label = sizeSum
        item_size.sortable = false
        item_date.label = ''
        item_date.sortable = false
      } else {
        item_name.label = '名称'
        item_name.sortable = true
        item_size.label = '大小'
        item_size.sortable = true
        item_date.label = '修改日期'
        item_date.sortable = true
      }
    },
    // cell-style 通过返回值可以实现样式变换利用传递过来的数组index循环改变样式
    rowStyle({ row, column, rowIndex, columnIndex }) {
      if (this.selectedRowIndices.has(rowIndex)) {
        if (columnIndex === 0) {
          return {
            backgroundColor: '#e0f3fc !important',
            borderRadius: '12px 0 0 12px',
            borderLeft: 'solid 1px var(--apple-shadow-color)',
            borderTop: 'solid 1px var(--apple-shadow-color)',
            borderBottom: 'solid 1px var(--apple-shadow-color)',
          }
        }
        if (columnIndex === 3) {
          return {
            backgroundColor: '#e0f3fc !important',
            borderRadius: '0 12px 12px 0',
            borderRight: 'solid 1px var(--apple-shadow-color)',
            borderTop: 'solid 1px var(--apple-shadow-color)',
            borderBottom: 'solid 1px var(--apple-shadow-color)',
          }
        }
        return {
          backgroundColor: '#e0f3fc !important',
          borderTop: 'solid 1px var(--apple-shadow-color)',
          borderBottom: 'solid 1px var(--apple-shadow-color)',
        }
      } else {
        if (columnIndex === 0) {
          return {
            borderRadius: '12px 0 0 12px',
          }
        }
        if (columnIndex === 3) {
          return {
            borderRadius: '0 12px 12px 0',
          }
        }
      }
    },
    // 选择某行预备数据
    preliminaryRowData(row) {
      if (row) {
        this.rowContextData = row
      }
      const isFavorite = this.rowContextData.isFavorite
      this.highlightFavorite(isFavorite, false)
    },
    // 是否高亮收藏图标
    highlightFavorite(isFavorite, isHover) {
      const item_menu = this.menus.find(item => {
        if (item.operation === 'favorite' || item.operation === 'unFavorite') {
          return item
        }
      })
      if (item_menu) {
        if (isFavorite) {
          item_menu.label = '取消收藏'
          item_menu.iconClass = 'menu-unfavorite-hover'
          item_menu.operation = 'unFavorite'
        } else {
          if (isHover) {
            item_menu.iconClass = 'menu-favorite-hover'
          } else {
            item_menu.iconClass = 'menu-favorite'
          }
          item_menu.label = '收藏'
          item_menu.operation = 'favorite'
        }
      }
    },
  }
}
