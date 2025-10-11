<template>
  <div>
    <message-dialog
      title="确认信息"
      content="是否在关闭前保存修改？"
      :show.sync="isSaveDialogVisible"
      operatButtonText="放弃修改"
      confirmButtonText="保存"
      @operating="closeDialog"
      @confirm="saveAndClose"
    >
    </message-dialog>
    <div class="office-preview" v-if="show" v-loading="!readyShow">
        <div class="preview-block" v-show="readyShow">
<!--          <div class="close-bar" @click="beforeClose">-->
<!--            <svg-icon class="preview-close" icon-class="close"/>-->
<!--          </div>-->

         <div class="close-container" :style="closeStyle">
           <div class="close-bar" @click="beforeClose">
             <el-button round icon="el-icon-close" type="info" size="mini" title="关闭" circle></el-button>
           </div>
         </div>

          <div class="wrapper">
            <CADPreview v-if="fileType === 'cad'" :file="file" :shareId="shareId" :file-url="fileUrl" @onReady="onReady" @loadFileFailed="loadFileFailed"></CADPreview>
            <pdf-preview v-else-if="fileType === 'pdf'" :file="file" :shareId="shareId" :file-url="fileUrl" @onReady="onReady"></pdf-preview>
            <drawio v-else-if="fileType === 'drawio'" v-show="fileReady" :file="file" :shareId="shareId" :read-only="readOnly" @onEdit="onEdit" @onReady="onReady" @onClose="close" @update-style="updateCloseStyle"></drawio>
            <excalidraw-editor v-else-if="fileType === 'excalidraw'" v-show="fileReady" :file="file" :shareId="shareId" :read-only="readOnly" @onEdit="onEdit" @onReady="onReady" @onClose="close" @update-style="updateCloseStyle"></excalidraw-editor>
            <my-mind-editor v-else-if="fileType === 'mind'" :file="file" :shareId="shareId" :read-only="readOnly" @onEdit="onEdit" @onReady="onReady" @onClose="close"></my-mind-editor>
            <model-preview v-else-if="fileType === 'glTF/GLB'" :file="file" :file-url="fileUrl" :shareId="shareId" @onReady="onReady"></model-preview>
            <only-office-editor ref="officeEditor" v-else-if="fileType === 'office'" :file="file" :file-url="fileUrl" :shareId="shareId" :sharer="sharer" :read-only="readOnly" @onEdit="onEdit" @manualSave="manualSave" @onClose="close" @onReady="onReady" @update-style="updateCloseStyle"></only-office-editor>
            <iframe-content-preview v-else :file="file" :fileHandler="fileHandler" :file-url="fileUrl" @onReady="onReady" @loadFileFailed="loadFileFailed"></iframe-content-preview>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

import ExcalidrawEditor from '@/components/office/ExcalidrawEditor.vue'
import ModelPreview from '@/components/office/ModelPreview.vue'
import OnlyOfficeEditor from "@/components/office/OnlyOfficeEditor";
import MessageDialog from "@/components/message/MessageDialog";
import Artplayer from '@/components/preview/Artplayer.vue'
import IframeContentPreview from '@/components/preview/IframeContentPreview.vue'
import fileConfig from "@/utils/file-config";
import PdfPreview from "@/components/office/PdfPreview";
import Drawio from "@/components/office/Drawio";

export default {
  name: 'IframePreview',
  components: {
    Artplayer,
    ExcalidrawEditor, IframeContentPreview, ModelPreview, Drawio, PdfPreview, MessageDialog, OnlyOfficeEditor,
    MyMindEditor: () => import('@/components/Minder/minder'),
    CADPreview: () => import('@/components/preview/CADPreview.vue')
  },
  props: {
    id: {
      type: String,
      default: () => {
        return "office_" + Math.round(Math.random() * 10000)
      }
    },
    file: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fileHandler: {
      type: Object,
      default: {}
    },
    shareId: {
      type: String,
      default: undefined
    },
    sharer: {
      type: String,
      default: undefined
    },
    status: {
      type: Boolean,
      default: false
    },
    specifyPreviewer: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileUrl: '',
      pc: this.$pc,
      show: this.status,
      readyShow: false,
      readOnly: true,
      isSaveDialogVisible: false,
      saved: true,
      previewDocument: {},
      delayClosing: {},
      fileReady: false,
      closeStyle: {
        height: '40px', width: '40px'
      }
    }
  },
  computed: {
    fileType() {
      if (this.specifyPreviewer === 'office') {
        return 'office'
      }
      return this.getType(this.file.suffix)
    },
  },
  mounted() {
    document.addEventListener('keyup', this.escape)
  },
  destroyed() {
    document.removeEventListener('keyup', this.escape)
  },
  watch: {
    status: function(visible){
      if(visible){
        this.show = true
        this.$nextTick(() => {
          this.previewDocument = document.querySelector('.preview-block')
        })
        this.checkReadOnly(this.file)
        // 12秒后还没加载出来视为加载失败
        let that = this
        this.delayClosing = setTimeout(function () {
          if (!that.readyShow) {
            that.loadFileFailed()
          }
        },12000)
      }
    }
  },
  methods: {
    updateCloseStyle(newStyle) {
      this.closeStyle = { ...this.closeStyle, ...newStyle }
    },
    /**
     * 按esc键
     */
    escape(event) {
      // 监听ESC键
      if (event.code === 'Escape') {
        this.beforeClose()
      }
    },
    getType(suffix) {
      if (Object.keys(this.fileHandler).length > 0) {
        return 'other'
      }
      if (this.file.contentType.indexOf('office') > -1) {
        return 'office'
      }
      switch (suffix) {
        case 'drawio':
          return 'drawio'
        case 'excalidraw':
          return 'excalidraw'
        case 'pdf':
          return 'pdf'
        case 'mind':
          return 'mind'
        case 'gltf':
        case 'glb':
          return 'glTF/GLB'
        case 'office':
        case 'csv':
          return 'office'
        case 'dwg':
          return 'cad'
        default:
          return 'other'
      }
    },
    /**
     * 加载失败
     */
    loadFileFailed(msg) {
      this.close()
      this.$store.dispatch('updateMessage', { event: 'loadFileFailed', msg: msg})
      this.readyShow = true
    },
    /**
     * 点击关闭按钮
     */
    beforeClose() {
      if (!this.saved) {
        this.isSaveDialogVisible = true
      } else {
        this.close()
      }
    },
    /**
     * 执行关闭预览窗口
     */
    close() {
      clearTimeout(this.delayClosing)
      this.show = false
      this.readyShow = false
      this.$emit('update:status', false)
      this.updateCloseStyle({ height: '40px', width: '40px', marginRight: '0' })
    },
    /**
     * 文件内容已经加载好了
     */
    onReady() {
      this.saved = true
      this.readyShow = true
      this.fileReady = true
      if (['drawio', 'office'].includes(this.fileType)) {
        this.previewDocument.style.zIndex = 9999
        this.$nextTick(() => {
          let that = this
          setTimeout(function () {
            that.previewDocument.style.zIndex = 2001
          },200)
        })
      }
    },
    /**
     * 编辑回调
     * @param saved 是否已经保存
     */
    onEdit(saved) {
      this.saved = saved
      if(saved){
        window.addEventListener('onbeforeunload', this.onbeforeunload)
      } else {
        window.removeEventListener('onbeforeunload', this.onbeforeunload)
      }
    },
    onbeforeunload(event) {
      event.returnValue=("文件未保存, 确定退出吗?");
    },
    /**
     * 放弃修改
     */
    closeDialog() {
      this.isSaveDialogVisible = false
      this.close()
    },
    /**
     * 保存并退出
     */
    saveAndClose() {
      // 通知插件保存
      this.$store.dispatch('updateMessage', { event: 'previewSaveAndClose'})
      this.isSaveDialogVisible = false
    },
    /**
     * 手动保存提醒，有些组件没有自动保存
     */
    manualSave() {
      this.$message.info('请手动保存')
    },
    /**
     * 检查要预览的文件是否为只读
     * @param file userId
     */
    checkReadOnly(file){
      if(this.$store.state.user.token && this.$store.state.user.userId === file.userId){
        this.readOnly = false
      }
      if (this.$store.state.user.token && file.operationPermissionList && file.operationPermissionList.indexOf('PUT') > -1) {
        this.readOnly = false
      }
      this.fileUrl = window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
      if(this.readOnly && window.shareId){
        this.fileUrl = window.location.origin + fileConfig.publicPreviewUrl(this.file, window.shareId, this.$store.getters.shareToken)
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.office-preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1002;
  width: 100%;
  height: 100%;

}

.close-container {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  align-items: center;
}

.preview-block {
  //position: fixed;
  //top: 0;
  //left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.7);
  z-index: 1998;

  .close-bar {
    position: relative;
    float: right;
    //font-size: 18px;
    //color: #fff0f0;
    z-index: 2002;
    ////background: #d4d4d475;
    //border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #69696975;
    //>>> .el-button {
    //  background: #d4d4d475;
    //}
  }

}

.wrapper {

  >>> .component-only-office {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
