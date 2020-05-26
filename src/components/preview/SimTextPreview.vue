<template>
  <el-dialog v-bind="$attrs" v-on="$listeners"
             :visible.sync="textPreviewVisible"
             :title="file.name"
             :close-on-click-modal="false"
             @close="closeDialog"
             :before-close="handleClose"
             v-dialogDrag="{ x: transformX, y: transformY }">
    <div slot="title" class="header-title">
          <span class="title-name">{{file.name}}</span>
        <div class="title-extension">
          <el-button v-if="isShowUpdateBtn" @click="update" :loading="updating">Ctrl-S 保存</el-button>
          <!-- <el-button @click="changePreviewMode">{{previewMode?'预览模式':'源码模式'}}</el-button> -->
        </div>
    </div>
    <div class="content" @keydown="onKeyDown">
      <div class="editor_main_storey"></div>
      <MonacoEditor
        v-if="textPreviewVisible"
        ref="monacoEditor"
        width="900"
        height="640"
        theme="vs-dark"
        :language="language"
        :diffEditor="diffEditor"
        original="..."
        :value="content"
        :options="options"
        @change="change"
      ></MonacoEditor>
    </div>
  </el-dialog>
</template>
<script>

  import '@/utils/directives.js'
  import api from '@/api/file-api.js'
  import markdownApi from '@/api/markdown-api'

  import { lineWrapping } from '@/utils/file-type'

  import MonacoEditor from '../MonacoEditorVue'
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

  export default {
    name: "SimTextPreview",
    components: {
      MonacoEditor
    },
    props: {
      file: {
        type: Object,
        default: function () {
          return {}
        }
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
        transformX: (document.body.clientWidth-900)/2,
        transformY: (document.body.clientHeight-640)/2,
        content: '',
        newContent: '',
        previewMode: true,
        isShowUpdateBtn: false,
        updating: false,
        loading: {},
      }
    },
    watch: { //监听file的变化，进行相应的操作即可
      file: function (a) {
        this.loading = this.$message({
          iconClass: 'el-icon-loading',
          type: 'info',
          duration: 0,
          dangerouslyUseHTMLString: true,
          message: '<span>&nbsp;&nbsp;正在加载数据...</span>'
        })
        let suffix = a.suffix

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
        api.previewText({
          id: a.id,
          username: this.$store.state.user.name
        }).then((res)=>{
            this.loading.close()
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
            this.$message({
              message: "更新成功",
              type: 'success',
              duration : 1000
            });
          })
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
    width: 900px;
    margin: 0 !important;
    /*.content {*/
      /*height: 600px;*/
      /*overflow: scroll;*/
    /*}*/

    /deep/.content {
      border-top: unset!important;
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
      background-color: #292929;
      color: #fff;
      .el-dialog__headerbtn {
        top: 16px;
        right: 16px;
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
      }
    }
    .el-dialog__body {
      padding: 0;
      word-break: normal;
    }
    .content {
      border-top: 1px solid #ccc;
    }
  }
  /deep/.CodeMirror {
    height: 640px;
  }

</style>
