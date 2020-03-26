<template>
  <div>
    <show-file :defaultGrid="false" :sortable="sortable" :queryCondition="queryCondition" :orderCustom="true"></show-file>
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
          isFavorite: false
        }
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>

