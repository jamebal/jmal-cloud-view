<template>
  <div>
    <el-tree
      ref="fileTree"
      :data="directoryTreeData"
      :node-key="localFileMode ? 'path' : 'id'"
      :props="directoryTreeProps"
      :load="localFileMode ? loadOfLocalFileMode : directoryTreeLoadNode"
      :highlight-current="true"
      :default-expanded-keys="defaultExpandedKeys"
      :render-content="renderContent"
      hight="100"
      lazy
      @node-click="treeNodeClick"
      @node-expand="treeNodeExpand"
    >
    </el-tree>
  </div>
</template>

<script>
import api from "@/api/file-api";
import IconFile from "@/components/Icon/IconFile";
import SimTextPreview from "@/components/preview/SimTextPreview";
import { iconClass } from "@/utils/file-type";

export default {
  name: "FileTree",
  components: { IconFile, SimTextPreview },
  props: {
    directoryTreeData: {
      type: Array,
      default: () => []
    },
    localFileMode: {
      //本地文件模式, true:通过文件路径加载, false: 通用文件Id加载
      type: Boolean,
      default: true
    },
    tempDir: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    hideMountFile: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      directoryTreeProps: {
        label: "name",
        children: "children",
        isLeaf: "isLeaf"
      }
    };
  },
  created() {
  },
  computed: {
    // 默认展开项
    defaultExpandedKeys() {
      if (!this.localFileMode) {
        return ["0"];
      } else {
        let keys = [];
        this.directoryTreeData.forEach(file => {
          if (!file.isLeaf) {
            if (keys.length < 1) {
              keys.push(file.path);
            }
          }
        });
        return keys;
      }
    }
  },
  methods: {
    // 文件树里新建文件夹
    fileTreeAndNewFolder(selectTreeNode) {
      let newNodeId = "newFolderNodeKey";
      let node = this.$refs.fileTree.getNode(newNodeId);
      if (node !== null) {
        this.$refs.fileTree.remove(node);
      }

      let childNodes = this.$refs.fileTree.store.currentNode.childNodes;
      let newFolderName = this.getNewFileName(childNodes, "新建文件夹");
      let newNode = {
        id: newNodeId,
        newFolder: true,
        name: newFolderName,
        showName: newFolderName,
        isLeaf: true
      };
      this.$refs.fileTree.append(newNode, selectTreeNode);
      setTimeout(function() {
        let treeInput = document.getElementById("treeInput");
        if (treeInput) {
          treeInput.value = newFolderName;
          treeInput.focus();
          treeInput.select();
        }
      }, 100);
    },
    getNewFileName(fileList, newFileName) {
      let append = 0;
      let filenameList = [];
      fileList.forEach(file => {
        let fileName = file.name || file.label;
        filenameList.push(fileName);
      });
      const newName = newFileName;
      while (filenameList.includes(newFileName)) {
        append += 1;
        if (newName.indexOf(".") > 0) {
          const name = newName.substring(0, newName.lastIndexOf("."));
          const suffix = newName.substring(newName.lastIndexOf("."));
          newFileName = `${name}${append}${suffix}`;
        } else {
          newFileName = `${newName}${append}`;
        }
      }
      return newFileName;
    },
    // 加载下一级文件树  localFileMode = true
    loadOfLocalFileMode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.directoryTreeData);
      }
      if (node.level > 0) {
        api
          .listfiles({
            username: this.$store.state.user.name,
            path: encodeURI(node.data.path),
            tempDir: this.tempDir
          })
          .then(res => {
            const nextNodes = res.data.map(data => {
              data.isLeaf = !data.isFolder;
              return data;
            });
            return resolve(nextNodes);
          });
      }
    },
    // 加载下一级文件树  localFileMode = false
    directoryTreeLoadNode(node, resolve) {
      let fileId = null;
      if (node.level === 0) {
        let data = [{ id: "0", name: "根目录" }];
        const that = this;
        setTimeout(function() {
          that.$refs.fileTree.setCurrentKey("0");
          that.$emit("treeNodeClick", data[0]);
        }, 0);
        return resolve(data);
      }
      if (node.level > 1) {
        fileId = node.data.id;
      }
      api.queryFileTree({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          hideMountFile: this.hideMountFile,
          fileId: fileId
        }).then(res => {
          const nextNodes = res.data;
          return resolve(nextNodes);
        });
    },
    // 点击文件树
    treeNodeClick(row) {
      this.$emit("treeNodeClick", row);
    },
    // 节点被展开时触发
    treeNodeExpand(row, node, event) {},
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
              <button type="button" on-click={() => {
                let path = '/'
                let parentData = node.parent.data
                if (parentData.path) {
                  path = parentData.path + parentData.name + path
                }
                let newFolderName = document.getElementById("treeInput").value
                api.newFolder({
                  isFolder: true,
                  filename: encodeURI(newFolderName),
                  currentDirectory: encodeURI(path),
                  username: this.$store.state.user.name,
                  userId: this.$store.state.user.userId
                }).then((res) => {
                  data.newFolder = false
                  data.isFolder = true
                  data.name = newFolderName
                  data.id = res.data
                }).catch(() => {
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
                  this.$refs.fileTree.remove(node);
                  window.event.preventDefault();
                  window.event.stopPropagation();
                }}
                class="el-button el-icon-close el-button--mini el-input-tree-button"
                element-loading-spinner="el-icon-loading"
                element-loading-background="#f6f7fa88"
              />
            </span>
          </span>
        );
      }
      if (node.expanded) {
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class="open-folder" />
            <span style="margin-left: 5px;">{node.label}</span>
            <span />
          </span>
        );
      } else {
        let iconClass = this.findIconClass(node.data);
        if (!this.localFileMode && node.data.id === "0") {
          iconClass = "folder";
        }
        return (
          <span class="custom-tree-node">
            <svg-icon icon-class={iconClass} />
            <span style="margin-left: 5px;">{node.label}</span>
            <span />
          </span>
        );
      }
    },
    findIconClass(file) {
      if (file.isFolder) {
        return "folder";
      }
      let suffix = file.suffix;
      if (!suffix && file.name) {
        suffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      }
      if (iconClass.has(suffix)) {
        return iconClass.get(suffix);
      }
      return "file";
    }
  }
};
</script>

<style lang="scss" scoped></style>
