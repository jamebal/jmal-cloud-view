<template>
  <div>
    <show-file
      queryFileType="audio"
      :orderCustom="true"
      :defaultGrid="true"
      :sortable="sortable"
      :queryCondition="queryCondition"
      singleFileType="音乐"
      emptyStatus="还没有音乐呢~"
    ></show-file>
  </div>
</template>

<script>
import ShowFile from "@/components/ShowFile/ShowFile";

export default {
  components: {ShowFile},
  data() {
    return {
      sortable: {
        prop: 'updateDate', order: 'descending'
      },
      queryCondition: {
        isFolder:false
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

