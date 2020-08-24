<template>
  <div>
    <!--移动或复制弹出框-->
    <el-dialog
      :title="selectTreeNode.showName"
      :visible.sync="visible"
      @close="clearTreeNode"
    >
      <el-tree
        ref="directoryTree"
        :data="directoryTreeData"
        node-key="id"
        :props="directoryTreeProps"
        :load="directoryTreeLoadNode"
        :highlight-current="true"
        :default-expanded-keys="['0']"
        :render-content="renderContent"
        hight="100"
        lazy
        @node-click="treeNodeClick"
        @node-expand="treeNodeExpand"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="fileTreeAndNewFolder"><i class="el-icon-folder-add"></i>&nbsp;&nbsp;新建文件夹</el-button>
        <span class="dialog-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </span>
        <el-button size="small" @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/file-api";

export default {
  name: "DirTree",
  props: {
    currentDir: {
      type: String,
      default: '/'
    },
    unzip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      directoryTreeData: [],
      selectTreeNode: {},
      directoryTreeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      }
    }
  },
  methods: {
    show() {
      this.visible = true
      const that = this
      setTimeout(function (){
        if(!that.selectTreeNode.showName){
          that.selectTreeNode = that.$refs.directoryTree.getCurrentNode()
          that.selectTreeNode.showName = that.selectTreeNode.name
        }
      },100)
    },
    hide() {
      this.visible = false
    },
    getSelectTreeNode() {
      return this.selectTreeNode
    },
    clearTreeNode() {
      let rootNode = this.$refs.directoryTree.getNode('0')
      rootNode.loaded = false
      rootNode.expanded = false
    },
    // 加载下一级文件树
    directoryTreeLoadNode(node, resolve) {
      let fileId = null
      if (node.level === 0) {
        const that = this
        setTimeout(function () {
          that.$refs.directoryTree.setCurrentKey('0')
        }, 0)
        return resolve([{'id': "0", 'name': '全部文件'}])
      }
      if (node.level > 1) {
        fileId = node.data.id
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
      this.selectTreeNode = row
      this.selectTreeNode.showName = row.name
    },
    // 节点被展开时触发
    treeNodeExpand(row, node, event) {
    },
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
        isLeaf: true
      }
      this.$refs.directoryTree.append(newNode, this.selectTreeNode)
      const that = this
      setTimeout(function () {
        let treeInput = document.getElementById("treeInput")
        if (treeInput) {
          treeInput.value = newFolderName
          treeInput.focus()
          treeInput.select()
        }
      }, 100)
    },
    getNewFileName(fileList, newFolderName) {
      let append = 0
      let filenameList = []
      fileList.forEach(file => {
        filenameList.push(file.name || file.label)
      })
      const newName = newFolderName
      while (filenameList.includes(newFolderName)) {
        append += 1
        newFolderName = newName + append
      }
      return newFolderName
    },
    renderContent(h, {node, data, store}) {
      if (data.newFolder) {
        return (
          <span class="custom-tree-node">
            <span><svg-icon icon-class="folder"/></span>
            <span>
            <div class="el-input el-input--mini el-input-tree">
            <input type="text" autocomplete="on" value="新建文件夹" id="treeInput" class="el-input__inner"></input>
            </div>
            <button type="button" on-click={() => {
              let path = '/'
              let parentData = node.parent.data
              if (parentData.path) {
                path = parentData.path + parentData.name + path
              }
              api.newFolder({
                isFolder: true,
                filename: data.name,
                currentDirectory: path,
                username: this.$store.state.user.name,
                userId: this.$store.state.user.userId
              }).then((res) => {
                data.newFolder = false
                data.id = res.data.id
              }).catch(() => {
                window.event.preventDefault()
                window.event.stopPropagation()
              })
            }}
                    class="el-button el-icon-check el-button--mini el-input-tree-button"
                    element-loading-spinner="el-icon-loading" element-loading-background="#f6f7fa88"></button>
            <button type="button" on-click={() => {
              this.$refs.directoryTree.remove(node)
              window.event.preventDefault()
              window.event.stopPropagation()
            }}
                    class="el-button el-icon-close el-button--mini el-input-tree-button"
                    element-loading-spinner="el-icon-loading" element-loading-background="#f6f7fa88"></button>
            </span>
            </span>);
      }
      if (node.expanded) {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="open-folder"/>
            <span style="margin-left: 5px;">{node.label}</span>
            <span>
            </span>
            </span>);
      } else {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="folder"/>
            <span style="margin-left: 5px;">{node.label}</span>
            <span>
            </span>
            </span>);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/index";
@import "src/styles/home-index";
</style>
