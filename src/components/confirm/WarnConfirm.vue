<template>
  <div>
    <el-dialog
      class="open-file-dialog"
      :title="title"
      top="35vh"
      :visible.sync="visible"
      @close="closeDialog">
      <svg-icon icon-class="warring"></svg-icon> <span class="dialog-msg">{{content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button :size="buttonSize" @click="operating">{{operatButtonName}}</el-button>
        <el-button :size="buttonSize" @click="cancel">{{cancelButtonName}}</el-button>
        <el-button :size="buttonSize" type="primary" @click=confirm>{{confirmButtonName}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "WarnConfirm",
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
      operatButtonName: {
        type: String,
        default: ''
      },
      cancelButtonName: {
        type: String,
        default: '取 消'
      },
      confirmButtonName: {
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
