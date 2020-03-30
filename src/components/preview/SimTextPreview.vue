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
    <div class="content">
      <vue-code-mirror
        :value="content"
        :options="options"
        ref="myEditor"
        @change="change"
        @save="save"
      >
      </vue-code-mirror>
    </div>
  </el-dialog>
</template>
<script>

  import { modeInfo,lineWrapping } from '@/utils/file-type'

  let CodeMirror = require('codemirror/lib/codemirror.js')

  import '@/utils/directives.js'
  import api from '@/api/file-api.js'
  import markdownApi from '@/api/markdown-api'
  import VueCodeMirror from '@/components/VueCodemirror/VueCodeMirror'

  export default {
    name: "SimTextPreview",
    components: {
      VueCodeMirror,
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
    computed: {
      options: function () {
        return {
          mode: this.codeMode,
          // tabSize: 2,
          styleActiveLine: true,
          lineNumbers: true,
          lineWrapping: this.lineWrapping,
          readOnly: this.readOnly,
          theme: 'idea',
          extraKeys: {'Ctrl-Z': 'autocomplete'},
        }
      }
    },
    data(){
      return{
        textPreviewVisible: false,
        transformX: (document.body.clientWidth-900)/2,
        transformY: 150,
        content: '',
        newContent: '',
        codeMode: 'javascript',
        previewMode: true,
        lineWrapping: false,
        readOnly: this.$store.state.user.token ? false : true,
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

        this.codeMode = 'javascript'
        let suffix = a.suffix
        const modeIndex =  modeInfo.findIndex(item => item.ext && item.ext.includes(suffix))
        if(modeIndex > -1){
          const mode = modeInfo[modeIndex].mode
          if(CodeMirror.modes.hasOwnProperty(mode)){
            this.codeMode = mode
          }else{
            this.$message.warning("暂不支持的文件类型:",modeInfo[modeIndex].mime)
          }
        }
        if(lineWrapping.includes(suffix)){
          this.lineWrapping = true
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
      closeDialog(done) {
        this.$emit('update:status', this.textPreviewVisible)
        this.isShowUpdateBtn = false
      },
      change(code) {
        this.isShowUpdateBtn = true
        this.newContent = code
      },
      save(code,q) {
        if(this.isShowUpdateBtn){
          this.newContent = code
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
      }
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
    .el-dialog__header {
      padding: 5px 20px 5px;
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
    }
    .content {
      border-top: 1px solid #ccc;
    }
  }
  /deep/.CodeMirror {
    height: 640px;
  }

</style>
