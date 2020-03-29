<template>
  <el-dialog :visible.sync="testDialog" title="测试弹框拖拽" dialogDragWidth v-dialogDrag="{ x: transformX, y: transformY }">

  </el-dialog>
</template>
<script>
  import '@/utils/directives.js'
  export default {
    name: "testDialog",
    data(){
      return{
        testDialog: true,
        transformX: (document.body.clientWidth-500)/2,
        transformY: 200,
      }
    },
    methods:{
      open:function () {
        this.testDialog=true
      }
    }
  }
</script>
<style>
  .el-dialog{
    margin: 0 !important;
    /*transform: translate(366px, 140px);*/
  }
</style>
