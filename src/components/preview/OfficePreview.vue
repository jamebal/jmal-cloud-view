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
    <div class="office-preview" v-if="show">
      <van-overlay :show="show">
        <div class="block">
          <div class="close-bar" @click="beforeClose">
            <svg-icon class="preview-close" icon-class="close"/>
          </div>
          <div class="wrapper">
            <only-office-editor ref="officeEditor" :file="file" :read-only="readOnly" @onEdit="onEdit" @manualSave="manualSave"></only-office-editor>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>

import OnlyOfficeEditor from "@/components/office/OnlyOfficeEditor";
import MessageDialog from "@/components/message/MessageDialog";
import Bus from "@/assets/js/bus";

export default {
  name: 'OfficePreview',
  components: {MessageDialog, OnlyOfficeEditor},
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
      pc: this.$pc,
      show: this.status,
      readOnly: true,
      isSaveDialogVisible: false,
      saved: true,
    }
  },
  watch: {
    status: function(visible){
      if(visible){
        this.show = true
        this.checkReadOnly(this.file.userId)
      }
    }
  },
  methods: {
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
      this.show = false
      this.$emit('update:status', false)
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
    },
  }
}
</script>

<style lang="scss" scoped>

.preview {
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

.block {
  .close-bar {
    z-index: 2006;
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
    z-index: 2009;
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
