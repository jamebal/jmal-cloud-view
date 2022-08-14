<template>
  <div>
<!--    <el-container v-loading="loading">-->
<!--    </el-container>-->
      <el-dialog
        class="jmal-message-dialog"
        :title="title"
        :visible.sync="visible"
        :modal="modal"
        v-loading="loading"
        top="0vh"
        :close-on-click-modal="false"
        @close="closeDialog">
          <svg-icon v-if="!loading" icon-class="warring"></svg-icon> <span class="dialog-msg">{{content}}</span>
          <span v-if="!loading" slot="footer" class="dialog-footer">
            <el-button :size="buttonSize" @click="operating">{{operatButtonText}}</el-button>
                <!--        <el-button :size="buttonSize" @click="cancel">{{cancelButtonText}}</el-button>-->
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
      modal: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      show: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      loading: {
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
  >>>.el-container {
    .el-loading-mask {
      position: fixed;
      height: 300px;
      width: 420px;
      margin: 0 auto;
      top: calc(50% - 175px);
      background: #FFFFFF;
    }
  }
  >>>.jmal-message-dialog {
    height: 200px;
    width: 420px;
    margin: 0 auto;
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
    .el-loading-mask {
      background: #FFFFFF;
    }
  }
</style>
