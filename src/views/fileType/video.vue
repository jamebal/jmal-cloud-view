<template>
  <div>
    <show-file
      queryFileType="video"
      :orderCustom="true"
      :defaultGrid="true"
      :sortable="sortable"
      :queryCondition="queryCondition"
      emptyStatus="还没有视频呢~"
    >
    </show-file>
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
        isFolder: false
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

