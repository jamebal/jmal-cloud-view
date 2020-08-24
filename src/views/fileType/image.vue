<template>
  <div>
    <show-file
      queryFileType="image"
      :orderCustom="true"
      :sortable="sortable"
      :queryCondition="queryCondition"
      emptyStatus="还没有图片呢~"
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

