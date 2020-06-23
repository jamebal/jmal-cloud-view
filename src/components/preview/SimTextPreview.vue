<template>
  <el-dialog
              ref="simTextDialog"
              v-bind="$attrs" v-on="$listeners"
             :fullscreen="fullscreen"
             :visible.sync="textPreviewVisible"
             :title="file.name"
             :close-on-click-modal="false"
             @close="closeDialog"
             :before-close="handleClose"
             :width="dialogWidth*100+'%'"
             v-resize="containerResize"
             class="simtext-dialog"
             v-dialogDrag="{ dialogWidth: dialogWidth}">
      <div slot="title" class="simtext-header-title">
            <span class="title-name">{{file.name}}</span>
          <div class="title-extension">
            <el-button v-if="isShowUpdateBtn" @click="update" :class="lightTheme?'':'dark-button'" size="small" :loading="updating">保存所有</el-button>
            <!-- <el-button @click="changePreviewMode">{{previewMode?'预览模式':'源码模式'}}</el-button> -->
            <el-button @click="skinning" :class="lightTheme?'':'dark-button'" size="small" :icon="lightTheme?'el-icon-moon':'el-icon-sunny'" circle></el-button>
            <button class="title-extension-button" @click="fullScreen" size="small">
              <svg-icon :icon-class="fullscreen?'normalscreen':'fullscreen'"></svg-icon>
            </button>
          </div>
      </div>
    <div class="content">
      <!--<div class="editor_main_storey"></div>-->
      <div class="file-contents" :style="{width: contentsWidth+'px',height: editorHieght+31+'px'}">
        <div class="dir-tools" :style="{width: contentsWidth+2+'px',minWidth: 272+'px'}">
          <el-button-group>
            <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-arrow-left" @click="upperLeve">上一级</el-button>
            <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-plus">新建</el-button>
            <el-button :class="lightTheme?'light-button':'dark-button'" size="small" icon="el-icon-search">搜索</el-button>
          </el-button-group>
        </div>
        <div class="content-tree" :style="{width: contentsWidth+'px',height: editorHieght+'px'}">
          <fancy-tree ref="fancTree" v-if="directoryTreeData.length > 0" :lightTheme="lightTheme" :directoryTreeData="directoryTreeData" @treeNodeClick="treeNodeClick"></fancy-tree>
        </div>
      </div>
      <div class="editor-resize" style="width: 3px;cursor: col-resize;"></div>
      <div :style="{width: editorWidth-3+'px'}">
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
          <el-tab-pane
            v-for="(item,index) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <div class="editor">
              <MonacoEditor
                v-if="textPreviewVisible"
                ref="monacoEditor"
                :width="editorWidth"
                :height="editorHieght"
                :theme="lightTheme?'vs':'vs-dark'"
                :language="language"
                :diffEditor="diffEditor"
                original="..."
                :value="item.content"
                :options="options"
                @change="change($event,index)"
                @save="save($event,index)"
              ></MonacoEditor>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-dialog>
</template>
<script>

  import '@/utils/directives.js'
  import api from '@/api/file-api'
  import markdownApi from '@/api/markdown-api'

  import { lineWrapping,suffix } from '@/utils/file-type'

  import MonacoEditor from '../MonacoEditorVue'
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

  import FileTree from"@/components/FileTree"
  import FancyTree from"@/components/FancyTree"

  export default {
    name: "SimTextPreview",
    components: {
      MonacoEditor,FileTree,FancyTree
    },
    props: {
      file: {
        type: Object,
        default: function () {
          return {}
        }
      },
      shareId: {
        type: String,
        default: undefined
      },
      filepath: {
        type: String,
        default: undefined
      },
      status: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data(){
      return{
        lightTheme: true,
        defalutLanguage: 'redis',
        language: this.defalutLanguage,
        lineWrapping: false,
        options: {
          fontSize: 14,
          contextmenu: true,
          readOnly: !this.$store.state.user.token,
          // 换行
          wordWrap: this.lineWrapping ? 'wordWrapColumn':'',
          wordWrapMinified: true,
          wrappingIndent: "indent"
        },
        diffEditor: false,
        textPreviewVisible: false,
        fullscreen: false,
        dialogWidth: 0.7,
        lastTransform: undefined,
        contentsWidth: 273,
        editorWidth: 1035,
        editorHieght: 640,
        content: '',
        newContent: '',
        previewMode: true,
        isShowUpdateBtn: false,
        updating: false,
        loading: {},
        darkButton: {
          background: '#565656!important',
          border: '1px solid #565656!important',
          color: '#ffffff!important'
        },
        directoryTreeData: [],
        editableTabsValue: '1',
        editableTabs: [],
      }
    },
    mounted() {
    },
    directives: {
      resize: { // 指令的名称
        bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
          let width = '', height = '';
          function isReize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
              binding.value();  // 关键
            }
            width = style.width;
            height = style.height;
          }
          el.__vueSetInterval__ = setInterval(isReize, 0);
        },
        unbind(el) {
          clearInterval(el.__vueSetInterval__);
        }
      }
    },
    watch: { //监听file的变化，进行相应的操作即可
      file: function (file) {
        this.editableTabs = []
        this.editorWidth = document.body.clientWidth * this.dialogWidth - this.contentsWidth
        this.editorHieght = document.body.clientHeight * this.dialogWidth - 50

        this.loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          offset: 100,
          message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
        })
        let languages = monaco.languages.getLanguages();
        const languagesIndex = languages.findIndex(item => item.extensions && item.extensions.includes('.'+file.suffix))
        if(languagesIndex > -1){
          this.language = languages[languagesIndex].id
        }else{
          this.language = this.defalutLanguage
        }
        if(lineWrapping.includes(file.suffix)) {
          this.options.wordWrap = 'wordWrapColumn'
          this.lineWrapping = true
        }else{
          this.options.wordWrap = ''
        }
        let request = 'previewText'
        if(this.shareId){
          request = 'sharePreviewText'
          this.options.readOnly = true
        }
        if(this.filepath){
          request = 'previewTextByPath'
          this.options.readOnly = true
        }
        api[request]({
          shareId: this.shareId,
          fileId: file.id,
          id: file.id,
          path: this.filepath,
          username: this.$store.state.user.name
        }).then((res)=>{
          this.loading.close()
          this.directoryTreeData = [{name: res.data.name, isFolder: true, isLeaf: false, id: res.data.id, path: res.data.path}]
          this.textPreviewVisible = true
          this.content = res.data.contentText

          // 加载tabs
          this.editableTabs.push({
            title: res.data.name,
            copyTitle: res.data.name,
            name: res.data.path.substring(1,res.data.path.length)+res.data.name,
            content: res.data.contentText
          })
          this.editableTabsValue = res.data.path.substring(1,res.data.path.length)+res.data.name

          // 界面的渲染后的初始化工作
          this.$nextTick(()=>{
            this.dragControllerDiv()
            this.setTheme()
          })
        }).catch(() => {
          this.loading.close()
        })
      },
      status: function(visible) {
        if(visible && this.loading.closed){
          this.textPreviewVisible = true
        }
      }
    },
    methods:{
      upperLeve(){
        this.$refs.fancTree.upperLeve()
      },
      refresh(){
        this.$refs.fancTree.refresh()
      },
      dragControllerDiv() {
        let resize = document.querySelector('.el-dialog__body .content .editor-resize');
        let left = document.querySelector('.file-contents');
        let leftTools = document.querySelector('.file-contents .dir-tools');
        let leftTree = document.querySelector('.file-contents .content-tree');
        if(resize){
          // 鼠标按下事件
          const that = this
          resize.onmousedown = function (e) {
            let startX = e.clientX;
            let contentsStartWidth = left.offsetWidth + 10
            // 鼠标拖动事件
            document.onmousemove = function (e) {
              let endX = e.clientX;
              // 移动的距离。负数向左移动,正数向右移动
              let moveLen = endX - startX
              // left.style.width = (contentsStartWidth + moveLen)+'px'
              // leftTree.style.width = (contentsStartWidth + moveLen)+'px'
              console.log(leftTools.style.minWidth.split('\px')[0])
              if((contentsStartWidth + moveLen) > leftTools.style.minWidth.split('\px')[0]){
                that.contentsWidth = contentsStartWidth + moveLen
                that.editorWidth = document.body.clientWidth * that.dialogWidth - (contentsStartWidth + moveLen)
              }
            }
            // 鼠标松开事件
            document.onmouseup = function (evt) {
              document.onmousemove = null;
              document.onmouseup = null;
              resize.releaseCapture && resize.releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
            }
            resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
            return false;
          }
        }
      },
      treeNodeClick(row) {
        if(row.isFolder){
          return
        }
        if(!suffix.simText.includes(row.suffix)){
          return
        }
        this.loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          offset: document.body.clientHeight/3,
          message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
        })
        let languages = monaco.languages.getLanguages();
        const languagesIndex = languages.findIndex(item => item.extensions && item.extensions.includes('.'+row.suffix))
        if(languagesIndex > -1){
          this.language = languages[languagesIndex].id
        }else{
          this.language = this.defalutLanguage
        }
        if(lineWrapping.includes(row.suffix)) {
          this.options.wordWrap = 'wordWrapColumn'
          this.lineWrapping = true
        }else{
          this.options.wordWrap = ''
        }
        api.previewTextByPath({
          path: row.path,
          username: this.$store.state.user.name
        }).then((res)=>{
          this.loading.close()
          if(this.editableTabs.findIndex(tab=> tab.name===row.path) < 0){
            console.log('添加一个tab')
            // 添加一个tab
            this.editableTabs.push({
              title: row.name,
              copyTitle: row.name,
              name: row.path,
              content: res.data.contentText
            })
          }
          this.editableTabsValue = row.path
        }).catch(() => {
          this.loading.close()
        })
      },
      containerResize() {
        this.editorWidth = document.body.clientWidth * this.dialogWidth - this.contentsWidth
        this.editorHieght = document.body.clientHeight * this.dialogWidth - 50
      },
      handleClose(done) {
        if(this.isShowUpdateBtn){
          this.$confirm('是否保存修改？')
          .then(_ => {
            done();
            this.update()
          })
          .catch(_ => {
            done();
          });
        }else{
          done()
        }
      },
      closeDialog() {
        this.$emit('update:status', this.textPreviewVisible)
        this.isShowUpdateBtn = false
      },
      change(value,index) {
        if(value === this.editableTabs[index].content){
          if(this.editableTabs[index].copyTitle !== this.editableTabs[index].title){
            this.editableTabs[index].title = this.editableTabs[index].copyTitle
            // 没有任何改变
            if(this.editableTabs.findIndex(tab=>tab.title !== tab.copyTitle) < 0){
              this.isShowUpdateBtn = false
            }
          }
        }else{
          if(this.editableTabs[index].copyTitle === this.editableTabs[index].title){
            this.editableTabs[index].title += '*'
            this.isShowUpdateBtn = true
          }
        }
        // this.isShowUpdateBtn = true
        // this.newContent = code
        // if(code === this.content){
        //   this.isShowUpdateBtn = false
        // }
      },
      save(value,index) {
        if(value !== this.editableTabs[index].content && this.isShowUpdateBtn){

          this.update(value,this.editableTabs[index].name)
        }
      },
      update(value,path) {
        this.updating = true
        markdownApi.editMarkdownByPath({
            relativePath: path,
            username: this.$store.state.user.name,
            contentText: value
          }).then(() => {
            this.updating = false
            this.isShowUpdateBtn = false
            this.content = this.newContent
            this.$message({
              message: "更新成功",
              type: 'success',
              duration : 1000
            });
          })
      },
      // 全屏
      fullScreen() {
        this.fullscreen = !this.fullscreen
        const dragDom = document.querySelector('.simtext-dialog .el-dialog');
        if(this.fullscreen){
          this.lastTransform = dragDom.style.transform
          this.dialogWidth = 1
          dragDom.style.transform="translate("+0+"px,"+0+"px)";
        }else{
          this.dialogWidth = 0.7
          let dialogWidth = document.body.clientWidth * this.dialogWidth
          let x = (document.body.clientWidth - dialogWidth)/2
          let y = (document.body.clientHeight - document.body.clientHeight * this.dialogWidth)/2
          if(this.lastTransform){
            dragDom.style.transform=this.lastTransform
          }else{
            dragDom.style.transform="translate("+x+"px,"+y+"px)"
          }
        }
        this.containerResize()
      },
      // 换肤
      skinning() {
        this.lightTheme = !this.lightTheme
        this.setTheme()
      },
      setTheme(){
        let header = document.querySelector('.simtext-dialog .el-dialog .el-dialog__header')
        let fileContests = document.querySelector('.content');
        if(this.lightTheme){
          header.style.background = '#FFF'
          header.style.color = '#181818'
          if(fileContests){
            fileContests.setAttribute('data-theme', 'light')
          }
        }else{
          header.style.background = '#292929'
          header.style.color = '#fff'
          if(fileContests){
            fileContests.setAttribute('data-theme', 'dark')
          }
        }
      },
      changePreviewMode() {
        this.previewMode = !this.previewMode
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "src/styles/markdown";

  $bg-color: #1e1e1e;
  $tree-title-bg-color: #3e3e3e;

  @mixin scrollBarLightStyle() {
    &::-webkit-scrollbar {
      width: 7px!important;
      height: 10px!important;
    }
    &::-webkit-scrollbar-thumb {
      border: unset!important;
      background-color: #c1c1c1 !important;
      -webkit-border-radius: unset!important;
    }
    &::-webkit-scrollbar-track-piece {
      background-color: unset!important;
      -webkit-border-radius: 3px;
    }
  }

  @mixin scrollBarDarkStyle() {
    &::-webkit-scrollbar {
      width: 7px!important;
      height: 10px!important;
    }
    &::-webkit-scrollbar-thumb {
      border: unset!important;
      background-color: #4b4b4b !important;
      -webkit-border-radius: unset!important;
    }
    &::-webkit-scrollbar-track-piece {
      background-color: unset!important;
      -webkit-border-radius: 3px;
    }
  }

  /deep/.el-dialog {
    /*width: 1035px;*/
    margin: 0 !important;
    overflow: hidden;

    .el-button--small.is-circle {
      padding: 9px 10px;
    }

    .light-button {
      background: #ececec;
      border: 1px solid #ececec;
    }

    .dark-button {
      background: #565656;
      border: 1px solid #565656;
      color: #ffffff;
    }
    .el-button:focus{
      background: #FFF;
      border: 1px solid #DCDFE6;
      color: #606266;
    }
    .dark-button:focus{
      background: #565656;
      border: 1px solid #565656;
      color: #ffffff;
    }
    .dark-button:hover {
      color: #409EFF;
      background-color: $bg-color;
    }

    .el-dialog__header {
      padding: 5px 20px 5px;

      .el-dialog__headerbtn {
        top: 12px;
        right: 16px;
        .el-dialog__close {
          font-size: 26px;
        }
      }
      .title-name {
        line-height: 40px;
      }
      .title-extension {
        float: right;
        margin-right: 30px;
        margin-top: 3px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: end;
        -ms-flex-pack: end;
        justify-content: flex-end;

        .title-extension-button {
          padding: 5px;
          margin-left: 15px;
          background: 0 0;
          border: none;
          outline: 0;
          cursor: pointer;
          color: #909399;
          .svg-icon {
            font-size: 18px;
          }
          .svg-icon:hover {
            color: #409EFF;
          }
        }

      }
    }
    .el-dialog__body {
      padding: 0;
      word-break: normal;
    }
    .content {
      border-top: unset!important;
      display: inline-flex;

      .el-tabs__header {
        margin: 0 0 0;
        .el-tabs__item {
          height: 31px;
          line-height: 31px;
        }
      }

      .editor_main_storey {
        display: inline-block;
        position: absolute;
        z-index: 999;
        width: 100%;
        height: 5px;
        background: linear-gradient(rgba(221,221,221,1), rgba(255, 255, 255, 0));
      }

      .el-tabs__nav-wrap {
        margin-left: -1px;
      }

      .el-tabs--card>.el-tabs__header .el-tabs__nav {
        border-radius: 0 0 0 0;
      }

      .el-tabs__nav-next, .el-tabs__nav-prev {
        line-height: 31px;
      }

      .file-contents{
        .content-tree{
          overflow-y: scroll;
          overflow-x: hidden;

          @include scrollBarLightStyle;
          background: #fff;
          box-shadow: inset #ececec -7px 0px;

          #dir-tree {
            ul.fancytree-container{
              padding: 3px 0 0 0;
            }
          }
          .svg-icon {
            font-size: 18px;
          }
          #dir-tree {
            .fancytree-plain span.fancytree-active span.fancytree-title{
              background-color: #409eff30;
              border-color: #ffffff;
            }

            .fancytree-plain span.fancytree-node:hover span.fancytree-title{
              background-color: #409eff30;
              border-color: #ffffff;
            }

            .fancytree-plain.fancytree-container.fancytree-treefocus span.fancytree-active span.fancytree-title{
              background-color: #409eff30;
              border-color: #ffffff;
            }
          }
        }

        .dir-tools {
          background: #ececec;
          border-right: 5px solid #fff;
          .el-button--small {
            padding: 9px 10px;
          }
        }

      }

      &[data-theme=dark] {

        .editor-resize {
          background: $bg-color;
        }

        .file-contents{

          background: #565656;

          .dir-tools {
            background: #565656;
          }

          .content-tree {
            @include scrollBarDarkStyle;
            background: $bg-color;
            box-shadow: inset #2d2d2d -7px 0px;
            #dir-tree {
              span.fancytree-title {
                color: #dedede;
              }
              ul.fancytree-container {
                background: #1e1e1e;
              }
              .fancytree-plain span.fancytree-active span.fancytree-title{
                background-color: $tree-title-bg-color;
                border-color: $bg-color;
              }

              .fancytree-plain span.fancytree-node:hover span.fancytree-title{
                background-color: $tree-title-bg-color;
                border-color: $bg-color;
              }

              .fancytree-plain.fancytree-container.fancytree-treefocus span.fancytree-active span.fancytree-title{
                background-color: $tree-title-bg-color;
                border-color: $bg-color;
              }
            }
          }
        }
        .editor_main_storey {
          background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0));
        }
      }

      /*.monaco-editor {*/
        /*padding: 3px 0 0 0;*/

        /*.scroll-decoration{*/
          /*box-shadow: unset!important;*/
        /*}*/
      /*}*/

    }
  }

</style>
