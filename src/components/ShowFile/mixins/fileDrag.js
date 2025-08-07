import { getElementToPageLeft } from '@/utils/dom'

export default {
  data() {
    return {
      dragElementList: [],
      drawFlag: false,
      draging: 0, // 是否正在拖拽中，0：没有拖拽，1：拖拽中,
      selectRowData: [],
      selectOrigin: -1, // 选择起点(主要用于按住shift键多选)
      selectEnd: -1, // 选择终点
      inputting: false, // 是否正在输入
      fileListScrollTop: 0,
      initFileListScrollTop: 0,
    }
  },
  methods: {
    // 画矩形选区
    drawRectangle() {
      let scrollDiv = this.$refs.fileListTableContainer.querySelector('.el-table__body-wrapper')
      if (this.grid) {
        scrollDiv = this.$refs.gridDiv.querySelector('.van-grid')
      }
      // 添加scroll事件
      scrollDiv.onscroll = e => {
        this.tableBodyScroll(null, e)
      }

      if (this.selectFile) {
        return
      }
      const _this = this
      let $$ = function(id) {
        return document.getElementById(id)
      }
      let draw = $$('v-draw-rectangle')
      let wId = 'rectangle1'
      let startX = 0,
        startY = 0
      let retcLeft = 0,
        retcTop = 0,
        retcHeight = 0,
        retcWidth = 0
      _this.drawFlag = false
      let itemClassName = 'el-table__row'
      if (_this.grid) {
        itemClassName =
          'grid-item van-grid-item__content van-grid-item__content--center van-grid-item__content--square'
      }
      draw.onmousedown = null
      draw.onmousedown = function(e) {
        let evt = window.event || e
        const elPath = e.path || (e.composedPath && e.composedPath())
        // 列表模式下点击表头，阻止点击事件
        if (!_this.grid && _this.selectRowData.length > 0) {
          const findIndex = elPath.findIndex(path => {
            if (path.className === 'el-table__header-wrapper') {
              return path
            }
          })
          if (findIndex > -1) {
            _this.stopSortChange = true
          }
        }
        // 点击的区域是否为文件, throughRow 不为空就证明点到了文件
        let throughRow = elPath.find(path => {
          if (path.className === itemClassName || path.className === 'el-table__row el-table__row--striped') {
            return path
          }
        })
        if (throughRow) {
          // 鼠标按下时就选中文件
          if (!_this.selectRowData.includes(_this.fileList[throughRow.rowIndex])) {
            _this.editingIndex = -1
            if (!_this.checkCmdKey(e) && !e.shiftKey) {
              _this.fileListTableClearSelection()
              _this.$refs.fileListTable.toggleRowSelection([
                { row: _this.fileList[throughRow.rowIndex], selected: true },
              ])
            }
          }
          return
        } else {
          _this.editingIndex = -1
        }
        if (evt.button !== 0) {
          return
        }
        if (!_this.checkCmdKey(e) && !e.shiftKey) {
          const index = elPath.findIndex(
            el =>
              el.className === itemClassName ||
              el.className === 'el-table__row el-table__row--striped'
          )
          if (index < 0) {
            _this.fileListTableClearSelection()
          }
        }
        let scrollTop = draw.scrollTop
        let scrollLeft = draw.scrollLeft || draw.scrollLeft
        startX = evt.clientX + scrollLeft
        startY = evt.clientY + scrollTop

        let div = document.createElement('div')
        div.id = wId
        div.className = 'draw-rectangle'
        div.style.left = startX + 'px'
        div.style.top = startY + 'px'
        div.style.position = 'fixed'
        div.style.border = '1px dashed #2898ff'
        div.style.width = '0px'
        div.style.height = '0px'
        div.style.left = '0px'
        div.style.top = '0px'
        div.style.overflow = 'hidden'
        draw.appendChild(div)
        document.onmousemove = function(e) {
          let evt = window.event || e
          let scrollTop =
            document.body.scrollTop || document.documentElement.scrollTop
          let scrollLeft =
            document.body.scrollLeft || document.documentElement.scrollLeft
          retcLeft =
            startX - evt.clientX - scrollLeft > 0
              ? evt.clientX + scrollLeft
              : startX
          retcTop =
            startY - evt.clientY - scrollTop > 0
              ? evt.clientY + scrollTop
              : startY
          retcHeight = Math.abs(startY - evt.clientY - scrollTop)
          retcWidth = Math.abs(startX - evt.clientX - scrollLeft)
          _this.drawFlag = true
          if (retcHeight + retcWidth < 4) {
            return
          }
          const drawRectangle = document.getElementById(wId)
          if (drawRectangle) {
            drawRectangle.style.left = retcLeft + 'px'
            drawRectangle.style.top = retcTop + 'px'
            drawRectangle.style.width = retcWidth + 'px'
            drawRectangle.style.height = retcHeight + 'px'
            drawRectangle.style.backgroundColor = '#f2f5fa55'
          }
          if (_this.drawFlag && retcHeight + retcWidth > 4) {
            if (!drawSelecting) {
              drawSelect({
                x: retcLeft,
                y: retcTop + _this.fileListScrollTop,
                w: retcWidth,
                h: retcHeight,
              })
            }
          }
        }
        document.onmouseup = function(e) {
          document.onmousemove = null
          document.onmouseup = null
          if (_this.stopSortChange) {
            _this.stopSortChange = false
            setTimeout(() => {
              _this.changeSelectedStyle(_this.selectRowData)
            }, 200)
          }
          setTimeout(function() {
            _this.drawFlag = false
          }, 50)
          const rectangle = document.getElementById(wId)
          if (rectangle) {
            draw.removeChild(rectangle)
          }
          if (!_this.grid) {
            draw = document.getElementById('drag-table')
          }
          const dragingDivs = Array.prototype.slice.call(
            draw.getElementsByClassName('dragingDiv')
          )
          dragingDivs.forEach(el => draw.removeChild(el))
        }
      }

      let drawSelecting = false
      let drawSelect = function(drawNode) {
        drawSelecting = true
        _this.dragElementList.forEach(element => {
          if (checkTouch(element, drawNode)) {
            _this.$refs.fileListTable.toggleRowSelection([
              { row: _this.fileList[element.rowIndex], selected: true },
            ])
          } else {
            _this.$refs.fileListTable.toggleRowSelection([
              { row: _this.fileList[element.rowIndex], selected: false },
            ])
          }
        })
        setTimeout(() => (drawSelecting = false), 10)
      }
      //检查两个DIV是否有接触
      let checkTouch = function(item, draw) {
        //得到左上角的绝对坐标
        let x1 = item.x
        let y1 = item.y
        let x2 = draw.x
        let y2 = draw.y
        let w1 = item.w
        let h1 = item.h
        let w2 = draw.w
        let h2 = draw.h
        return (
          ((x1 - x2 <= 0 && x2 - x1 < w1) || (x1 - x2 >= 0 && x1 - x2 < w2)) &&
          ((y1 - y2 <= 0 && y2 - y1 < h1) || (y1 - y2 >= 0 && y1 - y2 < h2))
        )
      }
    },
    // 行拖拽
    rowDrop() {
      if (this.selectFile) {
        return
      }
      // 目标元素的背景颜色
      let dragEnterBackCorlor = null
      // 被拖拽元素的背景色
      let dragBackCorlor = null
      const _this = this
      // 被拖动的元素
      let dragged = null
      // 被拖动的元素的索引
      let draggedIndex = -1

      let parentClassName = 'van-grid'
      let itemClassName = 'van-grid-item van-grid-item--square'
      let gridItemChildenClassName =
        'grid-item van-grid-item__content van-grid-item__content--center van-grid-item__content--square'
      if (!_this.grid) {
        itemClassName = 'el-table__row'
        parentClassName = 'el-table__body'
      }

      // 正在拖动的元素
      let dragingDiv = null

      let container = document.querySelector('.dashboard-container')

      // 目标元素
      let target = document.querySelector('.el-table__body-wrapper tbody')
      if (this.grid) {
        target = document.querySelector('.van-checkbox-group .van-grid')
      }
      let draw = document.getElementById('v-draw-rectangle')
      if (!this.grid) {
        draw = document.getElementById('drag-table')
      }
      let rows = 0 //行数

      let drawOffsetLeft = getElementToPageLeft(draw)

      let firstOver = 0 // 是否刚开始拖动
      let moveTitle = ''

      this.$nextTick(() => {
        rows = target.childElementCount
        _this.dragElementList = []
        for (let i = 0; i < target.childElementCount; i++) {
          let child = target.children[i]
          // 设置索引,表格自带rowIndex,这里我们设置grid的
          if (_this.grid) {
            if (child.rowIndex !== i) {
              child.rowIndex = i
            }
            child.children[0].children[0].rowIndex = i
            child = child.children[0].children[0]
          }
          // 为画矩形选取准备数据
          let pos = getObjPos(child)
          child.w = child.offsetWidth
          child.h = child.offsetHeight
          child.x = pos.x
          child.y = pos.y
          pos.rowIndex = child.rowIndex
          _this.dragElementList.push(child)

          // 使元素可拖动
          child.draggable = true
          // 给能拖动的元素加上标识,只有加上此标识才能被拖动,否则即使draggable = true,也无法拖动(在全局的ondragstart里拦截)
          child.slot = 'jmal'
          let childOfImg = child.querySelector('.el-avatar > img')
          if (_this.grid) {
            childOfImg = child.querySelector('.el-image > img')
          }
          if (childOfImg) {
            childOfImg.draggable = false
          }
        }
      })


      // 被拖动的元素正在那个容器里
      let dragIndex = -1

      // 判断经过了那个元素
      let judgThroughDom = function(e, d) {
        const elPath = e.path || (e.composedPath && e.composedPath())
        if (d === 'enter') {
          // 这里进入其他容器后 清除上次进入的容器的状态
          let node = null
          const className = e.toElement.className
          if (_this.grid) {
            if (className === itemClassName) {
              node = e.toElement
            }
            if (className === parentClassName) {
              node = e.fromElement
            }
          } else {
            // 列表模式
            if (
              elPath[0].id === 'v-draw-rectangle' ||
              elPath[0].className === 'el-table__virtual-wrapper'
            ) {
              // 超出列表底部
              node = e.toElement
            } else {
              // 超出列表顶部
              node = elPath.find(path => {
                if (path.className === 'el-table__header-wrapper') {
                  return path
                }
              })
            }
          }
          if (node) {
            // console.log(d,e,node,node.rowIndex)
            if (dragIndex > -1) {
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex]
              clearClass(last)
            }
            dragIndex = -1
          }
        }
        let throughRow = null
        if (_this.grid) {
          if (elPath[0].className === gridItemChildenClassName) {
            // throughRow 表示被拖动的元素正在哪一行上
            return throughRow
          } else {
            throughRow = elPath.find(path => {
              if (path.className === gridItemChildenClassName) {
                return path
              }
            })
          }
          return throughRow
        } else {
          if (elPath[0].tagName === 'TD') {
            // throughRow 表示被拖动的元素正在哪一行上
            throughRow = elPath.find(path => {
              if (
                path.className === 'el-table__row el-table__row--striped' ||
                path.className === 'el-table__row'
              ) {
                return path
              }
            })
          }
          return throughRow
        }
      }

      /***
       * 复原拖拽的dom
       * @param animation 是否显示动画
       */
      let recoverDragDom = function(animation) {
        if (animation) {
          _this.selectRowData.forEach(row => {
            let dragingDiv = document.getElementById('dragingDiv' + row.index)
            dragingDiv.style.transition = 'all 0.3s'
            dragingDiv.style.top =
              dragingDiv.original.top -
              (_this.fileListScrollTop - _this.initFileListScrollTop) +
              'px'
            dragingDiv.style.left = dragingDiv.original.left
          })
          setTimeout(() => {
            _this.selectRowData.forEach(row => {
              draw.removeChild(
                document.getElementById('dragingDiv' + row.index)
              )
            })
          }, 300)
        } else {
          _this.selectRowData.forEach(row => {
            draw.removeChild(document.getElementById('dragingDiv' + row.index))
          })
        }
        setTimeout(() => {
          if (!_this.grid) {
            document
              .getElementsByClassName('el-table')[0]
              .classList.add('el-table--enable-row-hover')
          } else {
            target.querySelectorAll('.grid-hover-back').forEach(e => {
              e.classList.add('grid-hover')
            })
          }
        }, 350)
        _this.draging = 0
      }

      container.ondragend = function(e) {
        _this.$store.dispatch('updateMessage', {
          event: 'onDragStart',
          data: false,
        })
        e.dataTransfer.effectAllowed = 'none'
        // 清除上次进入的容器的状态
        const last = target.children[dragIndex]
        clearClass(last)
        dragged.style.cursor = 'default'
        e.target.parentNode.parentNode.title = moveTitle
      }
      // 开始拖拽
      container.ondragstart = e => {
        if (this.queryFileType === 'trash') {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
        // 正在选区获取按住关键键时禁止拖拽
        if (_this.drawFlag || _this.checkCmdKey(e) || e.shiftKey) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        // 判断被拖拽dom是否有slot属性并且等于'jmal'
        if (!e.target.slot || e.target.slot !== 'jmal') {
          return true
        }
        // 该文件正在重命名
        if (e.target.rowIndex === _this.editingIndex) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        e.target.style.cursor = 'no-drop'
        // 复制被拖拽dom的title, 拖拽过程中移除, 拖拽完后还原
        moveTitle = e.target.parentNode.parentNode.title
        e.target.parentNode.parentNode.title = ''
        // 创建拖拽时的dom, 克隆自被拖拽dom
        _this.selectRowData.forEach((row, index) => {
          const element = _this.dragElementList[row.index]
          const rowIndex = element.rowIndex
          dragingDiv = element.cloneNode(true)
          dragingDiv.id = 'dragingDiv' + rowIndex
          dragingDiv.classList.add('dragingDiv')
          dragingDiv.classList.remove('el-table_row')
          dragingDiv.style.transition = 'all 0.3s'
          dragingDiv.style.zIndex = -1
          dragingDiv.style.position = 'absolute'
          const pos = _this.dragElementList[rowIndex]
          dragingDiv.style.width = pos.w + 'px'
          dragingDiv.style.height = pos.h + 'px'
          dragingDiv.style.left = pos.x - drawOffsetLeft + 'px'
          let dragingDivStyleTop = 0
          if (!_this.grid) {
            dragingDiv.firstChild.style.textAlign = 'center'
            let tds = Array.prototype.slice.call(dragingDiv.childNodes)
            tds.forEach((node, index) => {
              if (index === 0) {
                node.firstChild.style.margin = '0 20px'
              }
              if (index === 1) {
                node.firstChild.style.width = '280px'
                node.firstChild.style.marginRight = '20px'
              }
              if (index === 2) {
                node.style.borderRadius = '0 12px 12px 0'
                node.style.borderRight = 'solid 1px var(--apple-shadow-color)'
                node.firstChild.style.height = '44px'
                node.firstChild.style.lineHeight = '44px'
                node.firstChild.style.width = '80px'
                return true
              }
              if (index === 3) {
                dragingDiv.removeChild(node)
              }
            })
            dragingDivStyleTop = pos.y - _this.fileListScrollTop - 51.5
          } else {
            dragingDivStyleTop = pos.y - _this.fileListScrollTop - pos.h / 2 + 10
          }
          dragingDiv.style.top = dragingDivStyleTop + 'px'
          if (index === 0) {
            let numberFilesCopy = document
              .getElementById('numberFiles')
              .cloneNode(true)
            numberFilesCopy.id = 'numberFilesCopy'
            numberFilesCopy.querySelector('.number').innerHTML =
              _this.selectRowData.length + '个文件'
            dragingDiv.appendChild(numberFilesCopy)
          }
          dragingDiv.original = {
            top: dragingDivStyleTop,
            left: dragingDiv.style.left,
          }
          _this.initFileListScrollTop = _this.fileListScrollTop
          draw.appendChild(dragingDiv)
        })
        firstOver = 0
        let dragImage = document.getElementById('dragImage')
        e.dataTransfer.setDragImage(dragImage, 10, 10)
        _this.$store.dispatch('updateMessage', {
          event: 'onDragStart',
          data: true,
        })
        // 避免和画矩形选区冲突
        _this.drawFlag = false
        let rectangle = document.getElementById('rectangle1')
        if (rectangle) {
          document.getElementById('v-draw-rectangle').removeChild(rectangle)
        }
        dragged = e.target
        draggedIndex = dragged.rowIndex
        // 只有选中的才能拖拽
        _this.cellMouseIndex = -1
        dragBackCorlor = dragged.style.backgroundColor

        if (!_this.grid) {
          document
            .getElementsByClassName('el-table--enable-row-hover')[0]
            .classList.remove('el-table--enable-row-hover')
        } else {
          target.querySelectorAll('.grid-hover-back').forEach(e => {
            e.classList.remove('grid-hover')
          })
        }
        _this.draging = 1
      }
      container.ondragenter = function(e) {
        clearTimeout(loop)
        // 由于被拖动的元素 经过区域内中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
        let throughRow = judgThroughDom(e, 'enter')
        if (throughRow) {
          if (dragIndex !== throughRow.rowIndex) {
            if (dragIndex > -1) {
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex]
              clearClass(last)
            }
            // console.log('拖动进入目标元素'+throughRow.rowIndex,'dragIndex:',dragIndex);
            // 不是自己或为文件夹时才改变状态
            if (
              draggedIndex !== throughRow.rowIndex &&
              _this.fileList[throughRow.rowIndex].isFolder &&
              _this.selectRowData.findIndex(
                item => item.index === throughRow.rowIndex
              ) === -1
            ) {
              // 改变本次进入的容器的状态
              dragged.style.cursor = 'copy'

              let numberFilesCopy = document.getElementById('numberFilesCopy')
              numberFilesCopy.style.backgroundColor = '#40a9ffc9'
              numberFilesCopy.querySelector('.number').style.display = 'none'
              numberFilesCopy.querySelector('.icon').style.display = 'inline'
              numberFilesCopy.querySelector('.operate').style.display = 'inline'
              let targetFolder = numberFilesCopy.querySelector(
                '.target .folder'
              )
              targetFolder.style.display = 'inline'
              targetFolder.innerHTML = _this.fileList[throughRow.rowIndex].name

              dragEnterBackCorlor = throughRow.style.backgroundColor
              // 当拖拽文件夹上时，文件夹当背景色
              const color = '#9fcdfc99'
              if (_this.grid) {
                throughRow.style.backgroundColor = color
              } else {
                throughRow.childNodes.forEach(
                  node => (node.style.backgroundColor = color)
                )
              }
            }
            dragIndex = throughRow.rowIndex
          }
          leaveIndex = -1
        }
      }

      container.ondragover = function(e) {
        _this.selectRowData.forEach((row, index) => {
          const drawRectangle = document.getElementById(
            'dragingDiv' + row.index
          )
          if (drawRectangle) {
            drawRectangle.style.left =
              e.clientX - drawOffsetLeft + index * 3 + 10 + 'px'
            drawRectangle.style.top = e.clientY - 50 + index * 3 + 10 + 'px'
            if (firstOver === 0) {
              drawRectangle.style.zIndex = 999
              setTimeout(() => {
                drawRectangle.style.transition = ''
              }, 300)
            }
          }
        })
        e.preventDefault()
        leaveIndex = -1
        firstOver++
      }

      let loop = null
      let leaveIndex = -1 // 是否拖出了整个table, -1表示还在table内

      container.ondragleave = function(e) {
        clearTimeout(loop)
        let throughRow = judgThroughDom(e, 'leave')
        if (throughRow) {
          if (!_this.grid) {
            if (throughRow.rowIndex === 0 || throughRow.rowIndex === rows - 1) {
              // 离开第一行或最后一行
              leaveIndex = throughRow.rowIndex
              loop = setTimeout(function() {
                if (leaveIndex > -1) {
                  const leave = target.children[leaveIndex]
                  clearClass(leave)
                  dragIndex = -1
                }
              }, 100)
            }
          }
        }
      }
      container.ondrop = function() {
        const form = _this.fileList[draggedIndex]
        const to = _this.fileList[dragIndex]
        if (
          form &&
          to &&
          form.id !== to.id &&
          to.isFolder &&
          !_this.selectRowData.includes(to)
        ) {
          // 移动文件/文件夹
          let forms = []
          _this.selectRowData.forEach(row => {
            forms.push(row.id)
          })
          _this
            .$confirm(
              `是否将选中的${_this.selectRowData.length}项移动到 ${to.name}?`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
              }
            )
            .then(() => {
              _this.checkCopyOrMoveApi('move', forms, to.id, to.name)
              recoverDragDom(false)
            })
            .catch(() => {
              recoverDragDom(true)
            })
        } else {
          recoverDragDom(true)
        }
      }
      // 清除之前的样式
      let clearClass = function(node) {
        if (!dragged) {
          return
        }
        if (node) {
          if (_this.grid) {
            node = node.children[0].children[0]
            // #9fcdfc99
            if (node.style.backgroundColor === 'rgba(159, 205, 252, 0.6)') {
              node.style.backgroundColor = null
            }
          } else {
            // #9fcdfc99
            if (
              node.firstChild.style.backgroundColor ===
              'rgba(159, 205, 252, 0.6)'
            ) {
              node.childNodes.forEach(node => {
                node.style.backgroundColor = null
              })
            }
          }
          dragged.style.cursor = 'default'

          let numberFilesCopy = document.getElementById('numberFilesCopy')
          if (numberFilesCopy) {
            numberFilesCopy.style.backgroundColor = '#d2eefa66'
            numberFilesCopy.querySelector('.number').style.display = 'inline'
            numberFilesCopy.querySelector('.icon').style.display = 'none'
            numberFilesCopy.querySelector('.operate').style.display = 'none'
            numberFilesCopy.querySelector('.target .folder').style.display =
              'none'
          }
        }
        dragged.style.backgroundColor = dragBackCorlor
      }

      function getObjPos(obj) {
        let pos = { x: 0, y: 0 }
        while (obj) {
          pos.x += obj.offsetLeft
          pos.y += obj.offsetTop
          obj = obj.offsetParent
        }
        return pos
      }
    },
    tableBodyScroll(table, e) {
      this.fileListScrollTop = e.target.scrollTop
      let scrollBottom = e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
      if (scrollBottom < (e.target.scrollHeight * 0.2)) {
        if (!this.finished) {
          if (!this.pageLoadCompleteList[this.pagination.pageIndex]) {
            return
          }
          if (this.listModeSearch) {
            if (this.listModeSearchOpenDir) {
              this.searchFileAndOpenDir(this.listModeSearchOpenDir, true)
            } else {
              this.searchFile(this.searchFileName, true)
            }
          } else {
            this.getFileListEnter(true)
          }
        }
      }
    },
  }
}
