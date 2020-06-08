<template>
  <el-dialog v-bind="$attrs" v-on="$listeners"
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
            <el-button v-if="isShowUpdateBtn" @click="update" :class="lightTheme?'':'dark-button'" :loading="updating">Ctrl-S 保存</el-button>
            <!-- <el-button @click="changePreviewMode">{{previewMode?'预览模式':'源码模式'}}</el-button> -->
            <el-button @click="skinning" :class="lightTheme?'':'dark-button'">{{lightTheme?'暗色':'亮色'}}</el-button>
            <button class="title-extension-button" @click="fullScreen">
              <svg-icon :icon-class="fullscreen?'normalscreen':'fullscreen'"></svg-icon>
            </button>
          </div>
      </div>
    <div class="content" @keydown="onKeyDown">
      <div class="file-contents">
        <file-tree :directoryTreeData="directoryTreeData" :localFileMode="true" @treeNodeClick="treeNodeClick"></file-tree>
      </div>
      <div class="editor">
        <div class="editor_main_storey"></div>
        <MonacoEditor
          v-if="textPreviewVisible"
          ref="monacoEditor"
          :width="editorWidth"
          :height="editorHieght"
          :theme="lightTheme?'vs':'vs-dark'"
          :language="language"
          :diffEditor="diffEditor"
          original="..."
          :value="content"
          :options="options"
          @change="change"
        ></MonacoEditor>
      </div>
    </div>
  </el-dialog>
</template>
<script>

  import '@/utils/directives.js'
  import api from '@/api/file-api'
  import markdownApi from '@/api/markdown-api'

  import { lineWrapping } from '@/utils/file-type'

  import MonacoEditor from '../MonacoEditorVue'
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

  import FileTree from"@/components/FileTree"

  export default {
    name: "SimTextPreview",
    components: {
      MonacoEditor,FileTree
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
        lightTheme: false,
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
        directoryTreeData: []
      }
    },
    mounted() {
      this.setTheme()
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
        this.editorWidth = document.body.clientWidth * this.dialogWidth - 250
        this.editorHieght = document.body.clientHeight * this.dialogWidth - 50

        this.loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
        })
        let suffix = file.suffix

        let languages = monaco.languages.getLanguages();
        const languagesIndex = languages.findIndex(item => item.extensions && item.extensions.includes('.'+suffix))
        if(languagesIndex > -1){
          this.language = languages[languagesIndex].id
        }else{
          this.language = this.defalutLanguage
        }
        if(lineWrapping.includes(suffix)) {
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
          this.directoryTreeData = [{name: res.data.name, isFolder: true, isLeaf: false, path: res.data.path}]
          this.textPreviewVisible = true
          this.content = res.data.contentText
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
      treeNodeClick(row) {
        this.loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
        })
        let suffix = row.suffix

        let languages = monaco.languages.getLanguages();
        const languagesIndex = languages.findIndex(item => item.extensions && item.extensions.includes('.'+suffix))
        if(languagesIndex > -1){
          this.language = languages[languagesIndex].id
        }else{
          this.language = this.defalutLanguage
        }
        if(lineWrapping.includes(suffix)) {
          this.options.wordWrap = 'wordWrapColumn'
          this.lineWrapping = true
        }else{
          this.options.wordWrap = ''
        }
        console.log(row)
        api.previewTextByPath({
          path: row.path,
          username: this.$store.state.user.name
        }).then((res)=>{
          this.loading.close()
          // this.directoryTreeData = [{name: res.data.name, isFolder: true, isLeaf: false, path: res.data.path}]
          // this.textPreviewVisible = true
          this.content = res.data.contentText
        }).catch(() => {
          this.loading.close()
        })
      },
      containerResize() {
        this.editorWidth = document.body.clientWidth * this.dialogWidth - 250
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
      change(code) {
        this.isShowUpdateBtn = true
        this.newContent = code
        if(code === this.content){
          this.isShowUpdateBtn = false
        }
      },
      save() {
        if(this.isShowUpdateBtn){
          this.update()
        }
      },
      update() {
        this.updating = true
        markdownApi.editMarkdown({
            fileId: this.file.id,
            userId: this.$store.state.user.userId,
            username: this.$store.state.user.name,
            filename: this.file.name,
            contentText: this.newContent
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
          this.dialogWidth = 1
          dragDom.style.transform="translate("+0+"px,"+0+"px)";
        }else{
          this.dialogWidth = 0.7
          let dialogWidth = document.body.clientWidth * this.dialogWidth;
          let x = (document.body.clientWidth - dialogWidth)/2
          let y = (document.body.clientHeight - document.body.clientHeight * this.dialogWidth)/2
          dragDom.style.transform="translate("+x+"px,"+y+"px)";
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
        if(this.lightTheme){
          header.style.background = '#FFF'
          header.style.color = '#181818'
        }else{
          header.style.background = '#292929'
          header.style.color = '#fff'
        }
      },
      changePreviewMode() {
        this.previewMode = !this.previewMode
      },
      onKeyDown(event) {
        const isMac = navigator.platform.startsWith('Mac');
        const {key, code, keyCode, ctrlKey, metaKey} = event;
        const isCmd = isMac && metaKey || !isMac && ctrlKey;
        if (!isCmd) {
          return;
        }
        const isS = key === 's' || code === 'KeyS' || keyCode === 83;
        if (isS && this.textPreviewVisible) {
          if(this.newContent !== ''){
            this.save()
          }
          event.stopPropagation();
          event.preventDefault();
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "src/styles/markdown";

  /deep/.el-dialog {
    /*width: 1035px;*/
    margin: 0 !important;
    overflow: hidden;
    /*.content {*/
      /*height: 600px;*/
      /*overflow: scroll;*/
    /*}*/

    /deep/.content {
      border-top: unset!important;
      /*background-color: #1e1e1e;*/
      background-color: #fff;
      .editor_main_storey {
        display: inline-block;
        position: absolute;
        z-index: 999;
        width: 100%;
        height: 5px;
        background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0));
      }
    }

    .el-dialog__header {
      padding: 5px 20px 5px;
      /*background-color: #292929;*/
      /*color: #fff;*/

      /*.svg-icon {*/
        /*font-size: 20px;*/
        /*margin-top: 10px;*/
        /*margin-left: 20px;*/
        /*margin-right: 5px;*/
      /*}*/

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
        background-color: #1e1e1e;
      }

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
      border-top: 1px solid #ccc;
      display: flex;
      .file-contents{
        width: 300px;
        height: 500px;
        overflow-y: scroll;
        overflow-x: hidden;
        .svg-icon {
          font-size: 18px;
        }
        /deep/.el-tree-node>.el-tree-node__children{
          overflow: unset;
        }
      }

    }
  }


</style>
