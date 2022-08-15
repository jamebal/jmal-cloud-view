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
          <div class="close-bar" @click="beforeClose">
            <svg-icon class="preview-close" icon-class="close"/>
          </div>
          <div class="wrapper">
            <pdf-preview v-if="fileType === 'pdf'" :file="file" :file-url="fileUrl" @onReady="onReady"></pdf-preview>
            <only-office-editor ref="officeEditor" v-else :file="file" :file-url="fileUrl" :read-only="readOnly" @onEdit="onEdit" @manualSave="manualSave" @onClose="close" @onReady="onReady"></only-office-editor>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

import OnlyOfficeEditor from "@/components/office/OnlyOfficeEditor";
import MessageDialog from "@/components/message/MessageDialog";
import Bus from "@/assets/js/bus";
import fileConfig from "@/utils/file-config";
import PdfPreview from "@/components/office/PdfPreview";

export default {
  name: 'OfficePreview',
  components: {PdfPreview, MessageDialog, OnlyOfficeEditor},
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
    shareId: {
      type: String,
      default: undefined
    },
    status: {
      type: Boolean,
      default: false
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
      delayClosing: {}
    }
  },
  computed: {
    fileType() {
      return this.getType(this.file.suffix)
    },
  },
  watch: {
    status: function(visible){
      if(visible){
        this.show = true
        this.$nextTick(() => {
          this.previewDocument = document.querySelector('.preview-block')
        })
        this.checkReadOnly(this.file.userId)
        if (this.file.suffix === 'pdf') {
          this.readyShow = true
        }
        // 3秒后还没加载出来视为加载失败
        let that = this
        this.delayClosing = setTimeout(function () {
          if (!that.readyShow) {
            that.readyShow = true
            Bus.$emit('loadFileFaild')
          }
        },3000)
      }
    }
  },
  methods: {
    getType(suffix) {
      switch (suffix) {
        case 'pdf':
          return 'pdf'
        default:
          return 'office'
      }
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
    },
    /**
     * 文件内容已经加载好了
     */
    onReady() {
      this.saved = true
      if (this.fileType === 'office') {
        this.previewDocument.style.zIndex = 9999
        this.readyShow = true
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
      console.log('onEdit', saved)
      this.saved = saved
      if(saved){
        window.onbeforeunload = function(e){
          e.returnValue=("文件未保存, 确定退出吗?");
        }
      } else {
        window.onbeforeunload = null
      }
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
      console.log('saveAndClose')
      Bus.$emit('previewSaveAndClose')
      this.isSaveDialogVisible = false
    },
    /**
     * 手动保存提醒，有些组件没有自动保存
     */
    manualSave() {
      this.$message.info('请手动保存')
    },
    /**
     * 检查要预览调文件是否为只读
     * @param fileUserId userId
     */
    checkReadOnly(fileUserId){
      if(this.$store.state.user.token && this.$store.state.user.userId === fileUserId){
        this.readOnly = false
      }
      if (!this.$pc) {
        this.readOnly = true
        this.$nextTick(() => {
          const closeBar = document.querySelector('.office-preview .close-bar');
          closeBar.style.right = '2.5rem'
          closeBar.style.float = 'left'
          closeBar.style.transform = 'rotate(225deg)'
        })
      }
      this.fileUrl = window.location.origin + fileConfig.previewUrl(this.$store.state.user.name, this.file, this.$store.getters.token)
      if(this.readOnly){
        this.fileUrl = window.location.origin + fileConfig.publicPreviewUrl(this.file.id, window.shareId);
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

.van-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1003;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.7);
}

.preview-block {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.7);
  z-index: 2001;

  .close-bar {
    background-color: rgba(0,0,0,.5);
    position: relative;
    top: -2.5rem;
    right: -2.5rem;
    float: right;
    width: 0;
    height: 0;
    border-radius: 2.5rem;
    border-width: 2.5rem;
    border-style: solid;
    border-color: transparent transparent transparent #d4d4d475;
    line-height: 2.5rem;
    opacity: 1;
    transform: rotate(-45deg);
  }

  .close-bar:hover {
    cursor: pointer;
    border-color: transparent transparent transparent #69696975;
  }

  .preview-close {
    transform: rotate(-45deg);
    position: absolute;
    font-size: 1.25rem;
    top: -8px;
    right: 13px;
  }
}

.wrapper {

  >>> .component-only-office {
    position: absolute;
    top: 2.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
