<template>
  <div>
    <el-dialog
      class="jmal-message-dialog"
      :title="title"
      :visible.sync="visible"
      top="0vh"
      :close-on-click-modal="false"
      @close="closeDialog">
      <svg-icon icon-class="warring"></svg-icon> <span class="dialog-msg">{{content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button :size="buttonSize" @click="operating">{{operatButtonText}}</el-button>
        <el-button :size="buttonSize" @click="cancel">{{cancelButtonText}}</el-button>
        <el-button :size="buttonSize" type="primary" @click=confirm>{{confirmButtonText}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "MessageDialog",
    props: {
      title: {
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      content: {
        type: String,
        default: ''
      },
      buttonSize: {
        type: String,
        default: 'small'
      },
      operatButtonText: {
        type: String,
        default: ''
      },
      cancelButtonText: {
        type: String,
        default: '取 消'
      },
      confirmButtonText: {
        type: String,
        default: '确 定'
      }
    },
    data () {
      return {
        visible: false
      }
    },
    watch: {
      show: function(visible) {
         this.visible = visible
      }
    },
    methods: {
      closeDialog(){
        this.$emit('update:show', this.visible)
      },
      operating(){
        this.$emit('operating')
      },
      cancel(){
        this.visible = false
        this.$emit('update:show', this.visible)
        this.$emit('cancel')
      },
      confirm(){
        this.$emit('confirm')
      }
    }
  }
</script>
<style lang="scss" scoped>
  >>>.jmal-message-dialog {
    height: 200px;
    top: calc(50% - 100px);
    .el-dialog {
      width: 420px;
    }
    .svg-icon {
      font-size: 20px;
    }
    .dialog-msg {
      margin-left: 10px;
    }
  }
</style>
