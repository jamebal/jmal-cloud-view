<template>
  <div class="container">
    <el-table v-if="this.shareList.length > 0">

    </el-table>
    <empty-file
      v-if="this.shareList.length < 1"
      emptyStatus="您还没有分享历史哦~"
      :emptyShare="true"
    >
    </empty-file>
  </div>
</template>

<script>
  import ShowFile from "@/components/ShowFile/ShowFile";
  import EmptyFile from "@/components/EmptyFile";
  export default {
    components: {ShowFile,EmptyFile},
    data() {
      return {
        shareList:[]
      }
    },
  }
</script>

<style lang="scss" scoped>
</style>

