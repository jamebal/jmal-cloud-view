<template>
  <div>
    <v-contextmenu ref="clickContextmenu" :theme="lightTheme?'default':'dark'" event-type="click">
      <v-contextmenu-item v-for="item of menus" :key="item.operation" @click="contextmenuClick(item.operation)">
        <svg-icon :icon-class="item.iconClass"></svg-icon>
        {{item.label}}
      </v-contextmenu-item>
    </v-contextmenu>

    <v-contextmenu ref="contextmenu" :theme="lightTheme?'default':'dark'" @contextmenu="contextmenu">
      <v-contextmenu-item v-for="item of menus" :key="item.operation" @click="contextmenuClick(item.operation)">
        <svg-icon :icon-class="item.iconClass"></svg-icon>
        {{item.label}}
      </v-contextmenu-item>
    </v-contextmenu>

    <div class="dir-tools" style="min-width: 272px;">
      <el-button-group>
        <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-arrow-left" :disabled="this.currentPath.length === 0 || this.currentPath === '/'" @click="upperLeve">上一级</el-button>
        <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-plus" @click="newFileAndFolder" v-contextmenu:clickContextmenu>新建</el-button>
        <el-popover
          placement="bottom"
          width="250"
          trigger="click">
          <el-input placeholder="请输入内容" size="small">
            <el-button slot="append" size="small" icon="el-icon-search"></el-button>
          </el-input>
        </el-popover>

      </el-button-group>
    </div>
    <div id="dir-tree" :style="{width: contentsWidth+'px',height: contentsHieght+'px'}">
    </div>
  </div>
</template>
<script>
  import { findIconClass,suffix } from '@/utils/file-type'
  import 'jquery.fancytree/dist/skin-win8/ui.fancytree.less';
  import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
  import fancytree from 'jquery.fancytree';
  import store from '@/store'

  import api from '@/api/file-api'
  export default {
    name: "FancyTree",
    props: {
      contentsWidth: {
        type: Number,
        default: 250
      },
      contentsHieght: {
        type: Number,
        default: 500
      },
      directoryTreeData: {
        type: Object,
        default: () => {}
      },
      lightTheme: {
        type: Boolean,
        default: true,
      },
      editableTabs: {
        type: Array,
        default: () => []
      },
      editableTabsValue: {
        type: String,
        defalut: '1'
      }
    },
    data(){
      return {
        tree:{},
        currentPath: '/',
        contextData: {},
        rightClicking: false,
        menus: [],
        folderMenus: [
          { iconClass: 'open-folder', label: '进入该目录', operation: 'openFolder'},
          { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
        ],
        fileMenus: [
          { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
          { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
        ],
        fileMenus1: [
          { iconClass: 'menu-addtab', label: '在新的标签打开', operation: 'openFileOfNewTab' },
          { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
          { iconClass: 'menu-remove', label: '删除', operation: 'remove' }
        ],
        newFileMenus: [
          { iconClass: 'add-file', label: '新建文件', operation: 'addFile' },
          { iconClass: 'folder-add', label: '新建目录', operation: 'addFolder' }
        ],
      }
    },
    mounted() {
      this.loadTreeData(this.directoryTreeData)
    },
    watch: {
      directoryTreeData(newVal){
        this.directoryTreeData = newVal
        this.loadTreeData(this.directoryTreeData,true)
      }
    },
    computed: {
    },
    methods: {
      initTree(treeData){
        const that = this
        this.tree = fancytree.createTree('#dir-tree', {
          extensions: ["edit"],
          icon: (event,data)=> this.icon(event,data),
          source: this.convert(treeData),
          lazyLoad: (event,data)=> this.lazyLoad(event,data),
          click: (event,data)=> this.click(event,data),
          dblclick: (event,data)=> this.dblclick(event,data),
          activate: (event,data)=> this.activate(event,data),
          createNode: (event,data)=> this.createNode(event,data),
          edit: {
            triggerStart: ["f2", "mac+enter"],
            beforeEdit: function(event, data){
              const isModifying = that.editableTabs.some(item => {
                return data.node.data.path === item.name && 'Modifying' === item.status;
              })
              if(isModifying){
                that.$message.warning('不能对正在修改的文件重命名')
              }
              return !isModifying
            },
            edit: function(event, data){
              let input = data.node.span.querySelector('.fancytree-title .fancytree-edit-input')
              let width = input.style.width.substring(0,input.style.width.length-2)
              input.style.width = parseInt(width)+50+'px'
              if(input.value && input.value.length -1 > data.node.data.suffix.length){
                input.selectionStart = 0
                input.selectionEnd = input.value.length - 1 - data.node.data.suffix.length
              }
            },
            beforeClose: function(event, data){
              if(data.originalEvent.type === "mousedown") {
                 data.originalEvent.preventDefault();
                 return false
              }
              if(data.node.data.path){
                return that.nameValid(data.input.val(), data.node.data, data.node)
              }else{
                return true
              }
            },
            save: function(event, data){
              if(data.node.data.path){
                that.nodeRename(data.input.val(), data.node.data, data.node)
              }else{
                that.createFile(data.input.val(), data.node.data, data.node)
              }
              return true;
            },
            close: function(event, data){
              if(data.node) {
                that.addRef(data.node)
              }
              return false
            }
          }
        });
      },
      addRef(node){
        this.$refs.contextmenu.addRef({el:node.span,vnode: node.span})
      },
      contextmenu(vnode){
        this.rightClicking = true
        const that = this
        setTimeout(function () {
          that.rightClicking = false
        },200)
        this.contextData = fancytree.getNode(vnode).data
        // 触发节点的点击事件
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent('click',true,true,window,1,12,345,7,220,false,false,true,false,0,null);
        vnode.dispatchEvent(evObj);
        if(this.contextData.isFolder){
          this.menus = this.folderMenus
        }else{
          if(this.contextData.isFolder === undefined){

          }else{
            this.menus = this.fileMenus
            const tabExist = this.editableTabs.some(item => item.name === this.contextData.path)
            if(!tabExist && suffix.simText.includes(this.contextData.suffix)){
              this.menus = this.fileMenus1
            }
          }
        }
      },
      // 菜单点击事件
      contextmenuClick(operation){
        let node = this.tree.getActiveNode()
        switch (operation) {
          case 'openFolder':
            this.enterDir(this.contextData)
            break
          case 'remove':
            this.delFile(this.contextData)
            break
          case 'rename':
            this.tree.getActiveNode().editStart()
            break
          case 'addFile':
            this.editCreateNode(node,false)
            break
          case 'addFolder':
            this.editCreateNode(node,true)
            break
          case 'openFileOfNewTab':
            this.contextData.isAddTab = true
            this.$emit('treeNodeClick',this.contextData)
            break
          default:
            break
        }
      },
      editCreateNode(node,isFolder){
        if(node === null || node === undefined){
          this.tree.getRootNode().editCreateNode("child",{title:'',folder:isFolder})
          return
        }
        if(node.folder){
          node.editCreateNode("child",{title:'',folder:isFolder})
        }else{
          node.editCreateNode("after",{title:'',folder:isFolder})
        }
      },
      // 删除文件/文件夹
      delFile(data){
        this.$confirm('此操作将永久删除' + data.name + '，' +
          '\n 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.delFile({
            username: this.$store.state.user.name,
            path: encodeURI(data.path)
          }).then(()=>{
            this.$emit('removeFile', data.path)
            let node = this.tree.getActiveNode()
            node.remove()
            this.$message.success("删除成功！")
          })
        })
      },
      upperLeve(){
        if(this.currentPath.length === 0){
          return
        }
        let pathList = this.currentPath.split('/')
        let title = pathList[pathList.length-2]
        let path = this.currentPath.substring(0,this.currentPath.length-title.length)
        api.upperLevelList({
          username: this.$store.state.user.name,
          path: encodeURI(path),
        }).then(res => {
          this.tree.reload(this.convert(res.data))
        })
      },
      // 刷新当前目录
      refresh(){
        api.listfiles({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          path: encodeURI(this.currentPath),
        }).then(res => {
          this.tree.reload(this.convert(res.data))
        })
      },
      newFileAndFolder(){
        this.menus = this.newFileMenus
      },
      //进入目录
      enterDir(node){
        let loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          offset: document.body.clientHeight/3,
          message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
        })
        api.listfiles({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          path: encodeURI(node.path),
        }).then(res => {
          loading.close()
          if(res.data.length === 0){
            this.currentPath = node.path+'/'
          }
          this.tree.reload(this.convert(res.data))
        }).catch(()=>{
          loading.close()
        })
      },
      loadPath(data){
        data.name = data.title
        this.loadTreeData(data,true)
      },
      loadTreeData(treeData,reLoad,activeNodeData) {
        api.listfiles({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          path: encodeURI(treeData.path),
        }).then(res => {
          let oldname = treeData.name
          let data = res.data.map(doc => {
            if(oldname === doc.name){
              doc.active = true
            }
            doc.key = doc.path
            doc.title = doc.name
            doc.folder = doc.isFolder
            doc.lazy = doc.isFolder
            return doc
          })
          if(reLoad){
            this.$nextTick(() => {
              this.tree.reload(this.convert(data))
              if(activeNodeData){
                this.$emit('treeNodeClick', activeNodeData)
              }
            })
          }else{
            this.initTree(this.convert(data))
          }
        })
      },
      // 新建文件
      createFile(fileName,row,node){
        let parentPath = '/'
        if(node.parent.folder){
          parentPath = node.parent.data.path
        }else{
          let parent = node.parent.children[0].data
          if(parent.path){
            parentPath += parent.path.substring(0,parent.path.length-parent.name.length)
          }else{
            parentPath += this.currentPath
          }
        }
        api.addFile({
          fileName: encodeURI(fileName),
          isFolder: node.folder,
          username: this.$store.state.user.name,
          parentPath: encodeURI(parentPath)
        }).then((res)=>{
          let str = node.folder?'文件夹':'文件'
          this.$message.success(`新建${str}成功`)
          let activeNodeData = res.data
          let path = '/'+ activeNodeData.path.substring(0,activeNodeData.path.length-activeNodeData.name.length)
          this.loadTreeData({name: activeNodeData.name,path: path},true,activeNodeData)
        }).catch(()=>{
          node.remove()
        })
      },
      nameValid(newFileName,row,node){
        if(newFileName){
          if(newFileName === row.name){
            return true
          }
          if (/[\[\]\/\\"<>\?\*]/gi.test(newFileName)){
            this.$message({
              message: '文件名不能包含以下字符:<,>,|,*,?,,/,[,]',
              type: 'warning'
            });
            return false
          }
          const findIndex = node.parent.children.findIndex(item => newFileName === item.data.name)
          if(findIndex > -1){
            let msg = '该文件已存在'
            if(row.isFolder){
              msg = '该文件夹已存在'
            }
            this.$message({
              message: msg,
              type: 'warning'
            });
            return false
          }
          return true
        }
        return false
      },
      // 重命名
      nodeRename(newFileName, row, node) {
        if (newFileName) {
          let newExt = newFileName.replace(/.+\./,"");
          let strFileName = newFileName.substring(0,newFileName.length - newExt.length);
          if (!row.isFolder){
            if (row.suffix !== newExt) {
              this.$confirm(`您确定要将扩展名“.${row.suffix}”更改为“.${newExt}”吗？`,'提示',{
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                confirmButtonText: `保持.${row.suffix}`,
                cancelButtonText: `使用.${newExt}`,
              }).then(()=>{
                newFileName = strFileName + '.' + row.suffix
              }).catch(()=>{
              }).then(()=>{
                this.rename(row,newFileName,node)
              })
            }else{
              this.rename(row,newFileName,node)
            }
          }else{
            this.rename(row,newFileName,node)
          }
          return true
        }
      },
      rename(row,newFileName,node){
        // 重命名
        if(row.name === newFileName){
          node.setTitle(newFileName);
          return
        }
        api.renameByPath({
          newFileName: newFileName,
          username: this.$store.state.user.name,
          path: encodeURI(node.data.path)
        }).then(res => {
          row.oldName = node.data.name
          row.name = newFileName
          row.suffix = newFileName.replace(/.+\./,"")
          store.dispatch('updateMessage', {
            event: 'renameRow',
            data: row
          })
          row.oldPath = row.path
          row.path = row.path.substring(0,row.path.length - row.oldName.length) + newFileName
          node.setTitle(newFileName)
          this.addRef(node)
          this.$message.success("修改成功！")
          this.$emit('onRename', row)
          if(this.editableTabsValue === row.oldPath){
            this.$emit('update:editableTabsValue', row.path)
          }
        })
      },
      icon(event,data) {
        return { html: this.loadSvg(findIconClass(data.node.data)) }
      },
      loadSvg(svgName){
        if(svgName){
          let src = require(`@/icons/svg/${svgName}.svg`)
          return `<svg class="tree-icon">${src.default.render()}<use xlink:href="#icon-${svgName}"/></svg>`
        }
      },
      lazyLoad(event, data){
        let nodeData = data.node.data
        data.result = this.lazyLoadData(nodeData)
      },
      lazyLoadData(data){
        const that = this
        return new Promise(function(resolve) {
          api.listfiles({
            username: that.$store.state.user.name,
            path: encodeURI(data.path),
          }).then(res => {
            resolve(that.convert(res.data))
          })
        })
      },
      click(event, data){
        if(!this.rightClicking){
          this.$emit('treeNodeClick',data.node.data)
        }
      },
      dblclick(event, data){
      },
      activate(event, data){
      },
      createNode(event, data){
        if(data.node.statusNodeType  !== 'nodata'){
          this.addRef(data.node)
        }else{
          data.node.span.querySelector('.fancytree-title').innerText = '无数据'
        }
      },
      convert(data){
        if(data && data.length >0){
          this.currentPath = data[0].path.substring(0,data[0].path.length - data[0].name.length)
        }
        if(this.currentPath.length === 0){
          this.currentPath = '/'
        }
        this.$emit('onLoadTreePath', this.currentPath)
        return data.map(doc => {
          doc.key = doc.path
          doc.title = doc.name
          doc.folder = doc.isFolder
          doc.lazy = doc.isFolder
          return doc
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #dir-tree{
    >>>span.fancytree-custom-icon {
      margin-top: 3px;
      margin-left: 0;
    }
  }
  >>>ul.fancytree-container {
    border: unset;
  }
  >>>.tree-icon{
    position: relative;
    width: 20px;
    height: 20px;
    padding: 2.5px 0 0 0;
  }
</style>

