<template>
  <div>
    <show-file
      :defaultGrid="true"
      :orderCustom="true"
      :sortable="sortable"
      :queryCondition="queryCondition"
      :showNavigation="true"
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

