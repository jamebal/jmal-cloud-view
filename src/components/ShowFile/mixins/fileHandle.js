import api from '@/api/file-api'
import fileConfig from '@/utils/file-config'
export default {
  props: {
    showUploadButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      newCreateFileDialog: false,
      newCreateFileName: '',
      newCreateFileDialogTitle: '',
      createFileLoading: false,
      renameFileName: '',
      newFolderLoading: false,
      renameLoading: false,
      cellMouseIndex: -1,
      editingIndex: -1,
      titlePrefix: '',
      unzipOperating: false,
      dialogMoveOrCopyVisible: false,
      fileTreeAndNewFolderDisabled: false,
      directoryTreeData: [],
      compressedFileVisible: false,
      compressedFileData: [],
      compressedFileName: '',
      compressedFileTempDir: false,
      selectTreeNode: {},
      directoryTreeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
      },
      existsFileList: [], // 移动或复制存在的文件列表
      copyOrMoveConfirmVisible: false, // 移动或复制警告弹出框
      copyOrMoveParams: {
        operating: 'copy',
        froms: [],
        to: '',
        targetPath: ''
      }, // 移动或复制要传递的参数
      copyOrMoveToName: '', // 移动或复制到的文件夹名称
      deleteConfirmVisible: false, // 删除确认弹窗
      permanentDelete: false, // 是否永久删除
      permanentDeleteDisable: false, // 是否禁用永久删除选项
    }
  },
  methods: {
    // 新建文件夹
    newFolderNameClick() {
      if (this.newFolderName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(this.newFolderName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning',
          })
          return
        }
        this.newFolderLoading = true
        this.createFileLoading = true
        api.uploadFolder({
            isFolder: true,
            filename: encodeURIComponent(this.newFolderName),
            currentDirectory: this.getQueryPath(),
            folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
            username: this.$store.state.user.name,
            userId: this.$store.state.user.userId,
          })
          .then(res => {
            if (res.data === 1) {
              this.newFolderLoading = false
              this.$message({
                message: '该文件夹已存在',
                type: 'warning',
              })
            } else {
              this.createFileLoading = false
              this.newCreateFileDialog = false
              this.newFolderLoading = false
              this.showNewFolder = false
              this.isShowNewFolder = false
              this.$notify({
                title: '新建文件夹成功',
                type: 'success',
                duration: 1000,
              })
              this.getFileListEnter()
            }
          })
          .catch(() => {
            this.newFolderLoading = false
            this.createFileLoading = false
          })
      } else {
        this.newFolderLoading = false
        this.$message({
          message: '请输入文件夹名称',
          type: 'warning',
        })
      }
    },
    // 新建文件
    createFile(newFileName) {
      if (this.newCreateFileDialogTitle === '新建文件夹') {
        this.newFolderName = newFileName
        this.newFolderNameClick()
        return
      }
      if (newFileName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning',
          })
          return
        }
        this.createFileLoading = true
        let parentPath = '/'
        if (this.path) {
          if (this.path.length > 0) {
            parentPath = this.path
          }
        }
        let suffix = newFileName.substring(newFileName.lastIndexOf('.') + 1)
        api.addFile({
            fileName: encodeURIComponent(newFileName),
            isFolder: false,
            folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
            username: this.$store.state.user.name,
            parentPath: encodeURIComponent(parentPath),
          })
          .then(res => {
            this.createFileLoading = false
            switch (suffix && !this.$route.query.folder) {
              case 'txt':
                // 打开编辑器
                this.textPreviewRow = res.data
                this.textPreviewVisible = true
                break
              case 'drawio':
              case 'mind':
              case 'docx':
              case 'xlsx':
              case 'pptx':
                this.iframePreviewRow = res.data
                this.iframePreviewVisible = true
                break
            }
            const that = this
            this.setOnCreateFilename(newFileName)
            setTimeout(function() {
              that.newCreateFileDialog = false
            }, 200)
          })
          .catch(() => {
            this.createFileLoading = false
          })
      }
    },
    // 新建文件
    createNewFile(suffix) {
      if (this.newCreateFileDialogTitle === '新建文件夹') {
        this.newCreateFileName = `新建文件夹`
      } else {
        this.newCreateFileName = `未命名文件.${suffix}`
      }
      this.newCreateFileName = this.getNewFileName(
        this.fileList,
        this.newCreateFileName
      )
      this.newCreateFileDialog = true
      this.$nextTick(() => {
        let newFileNameInput = this.$refs.newCreateFileName.$el.querySelector(
          '.el-input__inner'
        )
        this.renameInputFocus(newFileNameInput, suffix)
      })
    },
    newFolder() {
      this.newFolderName = this.getNewFileName(this.fileList, '新建文件夹')
      this.showNewFolder = true
      this.$nextTick(() => {
        this.$refs.newFolderName.focus()
        this.$refs.newFolderName.select()
      })
    },
    // 统计文件和文件夹
    getShowSumFileAndFolder(fileList) {
      let folderSize = 0
      let fileSize = 0
      fileList.forEach(fileInfo => {
        if (fileInfo.isFolder) {
          folderSize += 1
        } else {
          fileSize += 1
        }
      })
      let folderSum = ''
      if (folderSize > 0) {
        folderSum = folderSize + '个文件夹'
      }
      let fileSum = ''
      if (fileSize > 0) {
        fileSum = fileSize + '个文件'
      }
      const stand = folderSize > 0 && fileSize > 0 ? '、' : ''
      return folderSum + stand + fileSum
    },
    // 计算总大小
    getShowSumSize(totalSize) {
      let sizeSum = ''
      if (totalSize < 1024) {
        sizeSum += totalSize + 'B'
      } else if (totalSize >= 1024 && totalSize < 1024 * 1024) {
        sizeSum += (totalSize / 1024).toFixed(2) + 'K'
      } else if (totalSize >= 1024 * 1024 && totalSize < 1024 * 1024 * 1024) {
        sizeSum += (totalSize / (1024 * 1024)).toFixed(2) + 'M'
      } else {
        sizeSum += (totalSize / (1024 * 1024 * 1024)).toFixed(2) + 'G'
      }
      return sizeSum
    },
    // 重命名
    rowRename(newFileName, row) {
      //去掉回车换行
      newFileName = newFileName.replace(/[\r\n]/g, '')
      if (newFileName) {
        if (/[\[\]\/\\"<>\?\*]/gi.test(newFileName)) {
          this.$message({
            message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
            type: 'warning',
          })
          return
        }
        let strFileName = newFileName.replace(/(.*\/)*([^.]+).*/gi, '$2')
        let newExt = newFileName.replace(/.+\./, '')
        if (!row.isFolder) {
          if (row.suffix !== newExt) {
            this.$confirm(
              `您确定要将扩展名“.${row.suffix}”更改为“.${newExt}”吗？`,
              '提示',
              {
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                confirmButtonText: `保持.${row.suffix}`,
                cancelButtonText: `使用.${newExt}`,
              }
            ).then(() => {
              const finalFileName = strFileName + '.' + row.suffix
              this.rename(row, finalFileName)
            }).catch(() => {
              this.rename(row, newFileName)
            })
          } else {
            this.rename(row, newFileName)
          }
        } else {
          this.rename(row, newFileName)
        }
      } else {
        this.editingIndex = -1
      }
    },
    rename(row, newFileName) {
      if (row.name === newFileName) {
        this.editingIndex = -1
        return
      }
      this.renameLoading = true
      const findIndex = this.fileList.findIndex(item => {
        if (newFileName === item.name) {
          return item
        }
      })
      if (findIndex > -1) {
        let msg = '该文件已存在'
        if (row.isFolder) {
          msg = '该文件夹已存在'
        }
        this.$message({
          message: msg,
          type: 'warning',
        })
        this.renameLoading = false
        return
      }
      api.rename({
        newFileName: encodeURIComponent(newFileName),
        username: this.$store.state.user.name,
        folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
        id: row.id,
      }).then(() => {
          this.renameLoading = false
          row.name = newFileName
          row.suffix = newFileName.replace(/.+\./, '')
          this.fileList[row.index] = row
          this.editingIndex = -1
        }).then(() => {
        this.fileListTableClearSelection()
          this.setOnCreateFilename(newFileName)
        }).catch(() => {
          this.renameLoading = false
          this.editingIndex = -1
        })
    },
    // 选取输入框部分内容
    renameInputFocus(doc, suffix) {
      this.setInputFocus()
      doc.focus()
      doc.selectionStart = 0
      doc.selectionEnd = doc.value.length
      if (suffix) {
        doc.selectionEnd -= suffix.length + 1
      }
    },
    setOnCreateFilename(newFileName) {
      if (this.$route.query.folder) {
        this.onCreateFilename = newFileName
        this.getFileListEnter()
        this.clearOnCreateFilename()
      }
    },
    removeOperation() {
      this.permanentDelete = false
      this.selectFileList = this.getSelectFileList()
      this.deleteConfirmVisible = true
    },
    onCopy(fileIdList, targetPath, targetFolder) {
      this.checkCopyOrMoveApi('copy', fileIdList, targetFolder, undefined, targetPath)
    },
    onMove(fileIdList, targetPath, targetFolder) {
      this.checkCopyOrMoveApi('move', fileIdList, targetFolder, undefined, targetPath)
    },
    copyOperation() {
      this.$store.dispatch('updateFileClipboard', this.getSelectFileList())
    },
    // 加载下一级文件树
    directoryTreeLoadNode(node, resolve) {
      let fileId = null
      if (node.level === 0) {
        const that = this
        setTimeout(function() {
          that.$refs.directoryTree.setCurrentKey('0')
        }, 0)
        return resolve([{ id: '0', name: '根目录' }])
      }
      if (node.level > 1) {
        fileId = node.data.mountFileId || node.data.id
      }
      api.queryFileTree({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        fileId: fileId,
      }).then(res => {
        const nextNodes = res.data
        return resolve(nextNodes)
      })
    },
    // 点击文件树
    treeNodeClick(row, node, event) {
      this.fileTreeAndNewFolderDisabled = row.hasOwnProperty('newFolder')
      this.selectTreeNode = row
      this.selectTreeNode.showName = ' "' + row.name + '"'
    },
    // 节点被展开时触发
    treeNodeExpand(row, node, event) {},
    // 文件树里新建文件夹
    fileTreeAndNewFolder() {
      let newNodeId = 'newFolderNodeKey'
      let node = this.$refs.directoryTree.getNode(newNodeId)
      if (node !== null) {
        this.$refs.directoryTree.remove(node)
      }

      let childNodes = this.$refs.directoryTree.store.currentNode.childNodes
      let newFolderName = this.getNewFileName(childNodes, '新建文件夹')
      let newNode = {
        id: newNodeId,
        newFolder: true,
        name: newFolderName,
        showName: newFolderName,
        isLeaf: true,
      }
      this.$refs.directoryTree.append(newNode, this.selectTreeNode)
      setTimeout(function() {
        let treeInput = document.getElementById('treeInput')
        if (treeInput) {
          treeInput.value = newFolderName
          treeInput.focus()
          treeInput.select()
        }
      }, 100)
    },
    // 移动文件
    moveFileTree() {
      this.copyOrMove('move')
    },
    // 复制文件
    copyFileTree() {
      this.copyOrMove('copy')
    },
    // 解压文件
    confirmUnzip() {
      this.unzip(this.openingFile, this.selectTreeNode.id, false)
    },
    showDialogMoveOrCopyVisible() {
      this.dialogMoveOrCopyVisible = true
    },
    /**
     * 创建副本
     */
    duplicate() {
      const newFilename = this.getDuplicateFileName(
        this.fileList,
        this.rowContextData.name
      )
      api
        .duplicateFile({
          fileId: this.rowContextData.id,
          newFilename: newFilename,
        })
        .then(() => {
          this.$message.success('创建副本成功')
          this.setOnCreateFilename(newFilename)
        })
    },
    moveOrCopy() {
      this.showDialogMoveOrCopyVisible()

      this.titlePrefix = '移动或复制到: '
      this.unzipOperating = false
      const that = this
      setTimeout(function() {
        that.selectTreeNode = that.$refs.directoryTree.getCurrentNode()
        that.selectTreeNode.showName = ' "' + that.selectTreeNode.name + '"'
      }, 100)
    },
    copyOrMove(operating) {
      let operation = '复制'
      if (operating === 'move') {
        operation = '移动'
      }
      let selectNodePath = '/'
      if (this.selectTreeNode.path) {
        selectNodePath =
          this.selectTreeNode.path + this.selectTreeNode.name + '/'
      }

      let fileIds = []
      if (this.menusIsMultiple || this.selectRowData.length > 1) {
        const exits = this.$refs.fileListTable.tableSelectData.some(value => {
          fileIds.push(value.id)
          const thisParentPath = value.path
          if (thisParentPath === selectNodePath) {
            this.$message({
              message: '不能将文件' + operation + '到自身或其子目录下',
              type: 'warning',
            })
            return true
          }
        })
        if (exits) {
          return
        }
      } else {
        if (this.rowContextData.id) {
          fileIds.push(this.rowContextData.id)
        } else {
          fileIds.push(this.rowContextData[0].id)
        }
      }
      this.checkCopyOrMoveApi(operating, fileIds, this.selectTreeNode.id, this.selectTreeNode.name)
    },
    checkCopyOrMoveApi(operating, froms, to, toName, targetPath) {
      if (!to && !targetPath) {
        to = '0'
        toName = '根目录'
      }
      if (targetPath) {
        toName = path.basename(targetPath)
      }
      api['checkMoveOrCopy']({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        froms: froms,
        to: to,
        targetPath: targetPath
      }).then((res) => {
        if (res.count > 0) {
          this.copyOrMoveConfirmVisible = true
          this.copyOrMoveParams = {operating: operating, froms: froms, to: to, targetPath: targetPath}
          this.copyOrMoveToName = `${(operating === 'copy' ? '复制' : '移动')}到: "${toName}"`
          this.existsFileList = res.data
        } else {
          this.copyOrMoveApi(operating, froms, to, false, targetPath)
        }
      })
    },
    copyOrMoveApi(operating, froms, to, isOverride, targetPath) {
      this.copyOrMoveConfirmVisible = false
      let operation = '复制'
      if (operating === 'move') {
        operation = '移动'
      }
      let copying = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: operation + '中...',
      })
      this.dialogMoveOrCopyVisible = false
      api[operating]({
        userId: this.$store.state.user.userId,
        username: this.$store.state.user.name,
        froms: froms,
        to: to,
        targetPath: targetPath,
        isOverride: isOverride
      }).then(() => {
        this.$refs.fileClipboard.clear()
        copying.iconClass = null
        copying.type = 'success'
        copying.message = operation + '中...'
        if (this.rowContextData.isFolder) {
          this.$refs.directoryTree.append(this.rowContextData, to)
        }
        if (operating === 'move') {
          // 移除列表
          this.getFileListEnter()
        }
        setTimeout(function() {
          copying.close()
        }, 1000)
      }).catch(() => {
        copying.close()
      })
    },
    renderContent(h, { node, data, store }) {
      if (data.newFolder) {
        return (
          <span class="custom-tree-node">
            <span>
              <svg-icon icon-class="folder" />
            </span>
            <span>
              <div class="el-input el-input--mini el-input-tree">
                <input
                  type="text"
                  autocomplete="on"
                  value="新建文件夹"
                  id="treeInput"
                  class="el-input__inner"
                />
              </div>
              <button
                type="button"
                on-click={() => {
                  let path = '/'
                  let parentData = node.parent.data
                  if (parentData.path) {
                    path = parentData.path + parentData.name + path
                  }
                  let newFolderName = document.getElementById('treeInput').value
                  api
                    .newFolder({
                      isFolder: true,
                      filename: encodeURIComponent(newFolderName),
                      currentDirectory: this.getQueryPath(),
                      folder: this.$route.query.searchOpenFolder || this.$route.query.folder,
                      username: this.$store.state.user.name,
                      userId: this.$store.state.user.userId,
                    })
                    .then(res => {
                      data.newFolder = false
                      data.name = newFolderName
                      data.id = res.data
                    })
                    .catch(() => {
                      window.event.preventDefault()
                      window.event.stopPropagation()
                    })
                }}
                class="el-button el-icon-check el-button--mini el-input-tree-button"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#f6f7fa88"
              />
              <button
                type="button"
                on-click={() => {
                  this.$refs.directoryTree.remove(node)
                  window.event.preventDefault()
                  window.event.stopPropagation()
                }}
                class="el-button el-icon-close el-button--mini el-input-tree-button"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#f6f7fa88"
              />
            </span>
          </span>
        )
      }
      if (node.expanded) {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="open-folder" />
            <span style="margin-left: 5px;">{node.label}</span>
            <span />
          </span>
        )
      } else {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="folder" />
            <span style="margin-left: 5px;">{node.label}</span>
            <span />
          </span>
        )
      }
    },
    allocateTag() {
      // 将this.$refs.fileListTable.tableSelectData拷贝给tagDialogObjectList而不是赋值
      this.tagDialogObjectList = JSON.parse(
        JSON.stringify(this.$refs.fileListTable.tableSelectData)
      )
      this.tagDialogVisible = true
    },
    allocateTagSuccess() {
      this.getFileListEnter()
    },
    share(row) {
      if (!row || !row.id) {
        if (this.rowContextData.id) {
          row = this.rowContextData
        } else {
          row = this.$refs.fileListTable.tableSelectData[0]
        }
      }
      this.shareDialogObject = row
      this.shareDialogObject.fileId = row.id
      this.shareDialogObject.shareBase = row.shareBase
      this.shareDialogObject.subShare = row.subShare
      this.shareDialogVisible = true
    },
    shareSuccess(shareBase, subShare) {
      this.updateRowContextData()
      this.rowContextData.shareBase = shareBase
      this.rowContextData.subShare = subShare
      this.rowContextData.isShare = true
    },
    onCancelShare() {
      this.updateRowContextData()
      delete this.rowContextData.shareBase
      delete this.rowContextData.subShare
      delete this.rowContextData.isShare
    },
    updateRowContextData() {
      // 这3行代码是为了让vue刷新数据
      const isFavorite = this.rowContextData.isFavorite
      this.rowContextData.isFavorite = !isFavorite
      this.rowContextData.isFavorite = isFavorite
    },
    downloadFile() {
      let fileIds = []
      if (this.$refs.fileListTable.tableSelectData.length > 0) {
        this.$refs.fileListTable.tableSelectData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileIds.push(this.rowContextData.id)
      }
      if (fileIds.length > 1 || this.rowContextData.isFolder) {
        fileConfig.packageDownload(fileIds)
        return
      }
      fileConfig.download(
        this.$store.state.user.name,
        this.rowContextData,
        this.$store.getters.token
      )
    },
    // 收藏/取消收藏
    favoriteOperating(isFavorite) {
      const fileIds = this.getSelectIdList()
      this.rowContextData.isFavorite = isFavorite
      this.highlightFavorite(isFavorite, true)
      api
        .favoriteUrl({
          fileIds: fileIds,
          isFavorite: isFavorite,
        })
        .then(() => {
          // 收藏页面
          const homePage =
            !this.$route.query.path || this.$route.query.length <= 1
          if (!isFavorite && this.isCollectView && homePage) {
            // 移除列表
            this.removeSelectItem()
          }
        })
        .catch(() => {
          this.rowContextData.isFavorite = !isFavorite
        })
    },
    // 移动至回收站
    moveToRecycle() {
      this.permanentDelete = false
      this.deleteFile()
    },
    // 彻底删除
    sweepDeleteFile() {
      this.permanentDelete = true
      this.deleteFile()
    },
    // 删除
    deleteFile() {
      // 提取出selectFileList中的id
      const fileIds = this.selectFileList.map(item => item.id)
      this.deleteLoading = true
      api.delete({
        currentDirectory: this.getQueryPath(),
        username: this.$store.state.user.name,
        fileIds: fileIds,
        sweep: this.permanentDelete,
      }).then(() => {
        this.deleteLoading = false
        this.deleteConfirmVisible = false
        // 刷新列表
        if (this.$route.query.folder) {
          this.getFileListEnter()
        }
      }).catch(() => {
        this.deleteLoading = false
        this.deleteConfirmVisible = false
      })
    },
    restoreFile() {
      const fileIds = this.getSelectIdList()
      api.restore({fileIds: fileIds}).then()
    },
    sweepFile() {
      const fileIds = this.getSelectIdList()
      this.$confirm(`此操作将永久删除 ${fileIds.length}个文件, 是否继续?`, '提示', {
        confirmButtonText: '彻底删除',
        confirmButtonClass: 'el-button--danger',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.sweep({fileIds: fileIds}).then()
      })
    },
    clearTrash() {
      this.$confirm(`是否清空回收站? 此操作将无法还原!!!`, '提示', {
        confirmButtonText: '清空',
        confirmButtonClass: 'el-button--danger',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.clearTrash().then()
      })
    },
    // 移除选中项
    removeSelectItem() {
      let removeFileIndexList = []
      if (this.$refs.fileListTable.tableSelectData.length > 0) {
        this.$refs.fileListTable.tableSelectData.forEach(item => {
          let fileIndex = this.fileList.findIndex(file => file.id === item.id)
          if (fileIndex > -1) {
            removeFileIndexList.push(fileIndex)
          }
        })
      }
      // 先清空之前选择的数据
      this.$refs.fileListTable.doLayout()
      this.fileListTableClearSelection()
      this.$refs.fileListTable.tableSelectData = []
      // 倒序
      removeFileIndexList = removeFileIndexList.sort((a, b) => b - a)
      setTimeout(() => {
        // 再执行移除
        for (let i = 0; i < removeFileIndexList.length; i++) {
          this.fileList.splice(removeFileIndexList[i], 1)
        }
        this.fileList.map((item, index) => {
          item.index = index
        })
        // 改变拖拽目标
        this.rowDrop()
        // 画矩形选取
        this.drawRectangle()
      }, 300)
    },
    // 获取选中项id列表
    getSelectIdList() {
      const fileIds = []
      if (this.selectRowData.length > 1 || this.menusIsMultiple) {
        this.$refs.fileListTable.tableSelectData.forEach(value => {
          fileIds.push(value.id)
        })
      } else {
        fileIds.push(this.rowContextData.id)
      }
      return fileIds
    },
    getSelectFileList() {
      const fileList = [];
      this.permanentDeleteDisable = false;
      const addFileToList = ({ id, suffix, name, mountFileId, contentType, isFolder, music, video }) => {
        fileList.push({ id, suffix, name, mountFileId, contentType, isFolder, music, video });
      };
      if (this.selectRowData.length > 1 || this.menusIsMultiple) {
        this.$refs.fileListTable.tableSelectData.forEach(value => addFileToList(value));
      } else {
        addFileToList(this.rowContextData);
      }
      if (fileList.length > 0) {
        this.checkPermanentDelete(fileList[0]);
      }
      return fileList;
    },
    checkPermanentDelete(file) {
      if (/\//.test(file.id) || file.mountFileId) {
        this.permanentDeleteDisable = true
        this.permanentDelete = true
      }
    },
    // 解压文件
    unzip(file, destFileId, tempDir) {
      let status = '解压'
      let decompressing = this.$message({
        iconClass: 'el-icon-loading',
        type: 'info',
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<span>&nbsp;&nbsp;正在' + status + '</span>',
      })
      api.unzip({
        fileId: file.id,
        destFileId: destFileId,
      })
        .then(res => {
          decompressing.iconClass = null
          decompressing.type = 'success'
          decompressing.message = status + '成功'

          if (tempDir) {
            this.compressedFileData = res.data
            this.compressedFileVisible = true
            this.compressedFileName = file.name
            this.compressedFileTempDir = tempDir
          }

          const that = this
          setTimeout(function() {
            decompressing.close()
            that.openCompressionVisible = false
            if (file.id === destFileId) {
              that.getFileListEnter()
            }
            if (destFileId && file.id !== destFileId && !tempDir) {
              that.dialogMoveOrCopyVisible = false
            }
          }, 1000)
        })
        .catch(() => {
          decompressing.close()
        })
    },
  },
  mounted() {
  },
  beforeDestroy() {
  },
}
