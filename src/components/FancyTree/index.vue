<template>
  <div>
    <v-contextmenu ref="contextmenu" :theme="lightTheme?'default':'dark'" @contextmenu="contextmenu">
      <v-contextmenu-item v-for="item of menus" :key="item.operation" @click="contextmenuClick(item.operation)">
        <svg-icon :icon-class="item.iconClass"></svg-icon>
        {{item.label}}
      </v-contextmenu-item>
    </v-contextmenu>
    <div class="dir-tools" style="min-width: 272px;">
      <el-button-group>
        <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-arrow-left" @click="upperLeve">上一级</el-button>
        <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-plus">新建</el-button>
        <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-search">搜索</el-button>
      </el-button-group>
    </div>
    <div id="dir-tree" :style="{width: contentsWidth+'px',height: contentsHieght+'px'}">
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import 'v-contextmenu/dist/index.css'
  import { iconClass,suffix } from '@/utils/file-type'
  import 'jquery.fancytree/dist/skin-win8/ui.fancytree.less';
  import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
  import fancytree from 'jquery.fancytree';
  import Bus from '@/assets/js/bus'

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
        type: Array,
        default: () => []
      },
      lightTheme: {
        type: Boolean,
        default: true,
      }
    },
    data(){
      return {
        tree:{},
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
        newFileMenus: [
          { iconClass: 'add-file', label: '新建文件', operation: 'addFile' },
          { iconClass: 'folder-add', label: '新建目录', operation: 'addFolder' }
        ],
      }
    },
    watch: {
      directoryTreeData(newVal,oldVal) {
        this.directoryTreeData = newVal
        this.loadTreeData(newVal,true)
      }
    },
    mounted() {
      this.loadTreeData(this.directoryTreeData)
    },
    computed: {
    },
    methods: {
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
          this.menus = this.fileMenus
        }
      },
      // 菜单点击事件
      contextmenuClick(operation){
        switch (operation) {
          case 'openFolder':
            console.log('openFolder',this.contextData)
            this.enterDir(this.contextData)
            break
          case 'remove':
            console.log('remove',this.contextData)
            this.delFile(this.contextData)
            break
          case 'rename':
            console.log('rename',this.contextData)
            this.tree.getActiveNode().editStart()
            break
          default:
            console.log('default',this.contextData)
            break
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
            path: data.path
          }).then(()=>{
            let node = this.tree.getActiveNode()
            node.remove()
            this.$message.success("删除成功！")
          })
        })
      },
      // 上级目录
      upperLeve(){
        let path = this.tree.rootNode.children[0].key
        let title = this.tree.rootNode.children[0].title
        if(path.endsWith(title)){
          path = path.substring(0,path.length-title.length)
        }
        if(path.length === 0){
          return
        }
        api.upperLevelList({
          username: this.$store.state.user.name,
          path: path,
        }).then(res => {
          this.tree.reload(this.convert(res.data))
        })
      },
      // 刷新当前目录
      refresh(){
        api.upperLevelList({
          username: this.$store.state.user.name,
          path: this.tree.rootNode.children[0].key,
        }).then(res => {
          this.tree.reload(this.convert(res.data))
        })
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
          path: node.path,
        }).then(res => {
          loading.close()
          this.tree.reload(this.convert(res.data))
        }).catch(()=>{
          loading.close()
        })
      },
      loadTreeData(treeData,reLoad) {
        api.listfiles({
          userId: this.$store.state.user.userId,
          username: this.$store.state.user.name,
          path: treeData[0].path,
        }).then(res => {
          let oldname = treeData[0].name
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
            this.tree.reload(this.convert(data))
          }else{
            this.initTree(this.convert(data))
          }
        })
      },
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
              console.log(event.type, data);
            },
            edit: function(event, data){
              let intput = data.node.span.querySelector('.fancytree-title .fancytree-edit-input')
              let width = intput.style.width.substring(0,intput.style.width.length-2)
              intput.style.width = parseInt(width)+50+'px'
            },
            beforeClose: function(event, data){
            },
            save: function(event, data){
              that.nodeRename(data.input.val(), data.node.data, data.node)
              return true;
            },
            close: function(event, data){
              console.log(event.type, data);
              if( data.save ) {
              }
              return false
            }
          }
        });
        console.log(this.tree.getActiveNode(),fancytree._extensions)
      },
      // 重命名
      nodeRename(newFileName, row, node) {
        if (newFileName) {
          if(/[\/\\"<>\?\*]/gi.test(newFileName)){
            this.$message({
              message: '文件名不能包含以下字字符:<,>,|,*,?,,/',
              type: 'warning'
            });
            return;
          }
          let newExt = newFileName.replace(/.+\./,"");
          let strFileName = newFileName.substring(0,newFileName.length - newExt.length);
          if (!row.isFolder) {
            if (row.suffix !== newExt) {
              this.$confirm(`您确定要将扩展名“.${row.suffix}”更改为“.${newExt}”吗？`,'提示',{
                type: 'warning',
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
        }
      },
      rename(row,newFileName,node){
        // 重命名
        if(row.name === newFileName){
          node.setTitle(newFileName);
          return
        }
        const findIndex = node.parent.children.findIndex(item => {
          if(newFileName === item.data.name){
            return item
          }
        })
        if(findIndex > -1){
          let msg = '该文件已存在'
          if(row.isFolder){
            msg = '该文件夹已存在'
          }
          this.$message({
            message: msg,
            type: 'warning'
          });
          return
        }
        api.renameByPath({
          newFileName: newFileName,
          username: this.$store.state.user.name,
          path: node.data.path
        }).then(res => {
          if (res.data) {
            row.oldName = node.data.name
            row.name = newFileName
            row.suffix = newFileName.replace(/.+\./,"")
            Bus.$emit('renameRow',row)
            row.path = row.path.substring(0,row.path.length - row.oldName.length) + newFileName
            node.setTitle(newFileName);
            this.$message.success("修改成功！")
          }
        })
      },
      icon(event,data) {
        return { html: this.loadSvg(this.findIconClass(data.node.data)) }
      },
      findIconClass(file){
        if(!file || !file.contentType){
          return
        }
        if(file.isFolder){
          return 'folder'
        }
        if(file.contentType.indexOf('video') > -1){
          return 'video'
        }
        if(file.contentType.indexOf('image') > -1){
          return 'image'
        }
        if(file.contentType.indexOf('audio') > -1){
          return 'audio'
        }
        let suffix = file.suffix;
        if(!suffix && file.name){
          suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
        }
        if(iconClass.has(suffix)){
          return iconClass.get(suffix)
        }
        return 'file'
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
            path: data.path,
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
        if(data.node.key  !== '_1'){
          this.$refs.contextmenu.addRef({el:data.node.span,vnode: data.node.span})
        }else{
          data.node.span.querySelector('.fancytree-title').innerText = '无数据'
        }
      },
      convert(data){
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
  /deep/ul.fancytree-container {
    border: unset;
  }
  /deep/.tree-icon{
    position: relative;
    width: 20px;
    height: 20px;
    margin-top: -3px;
    margin-left: -2px;
    padding: 2px;
  }
</style>

