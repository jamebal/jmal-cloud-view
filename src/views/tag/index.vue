<template>
  <div>
    <show-file
      :defaultGrid="true"
      :sortable="sortable"
      :orderCustom="true"
      :defaultSort="sortable"
      :queryCondition="queryCondition"
    >
    </show-file>
  </div>
</template>

<script>
import ShowFile from "@/components/ShowFile/ShowFile";
import Bus from "@/assets/js/bus";

export default {
  components: {ShowFile},
  data() {
    return {
      sortable: {
        prop: 'updateDate', order: 'descending'
      },
      queryCondition: {
        tagId: undefined,
      }
    }
  },
  mounted() {
    if (this.$route.query.tagId) {
      this.queryCondition.tagId = this.$route.query.tagId
    }
  },
  destroyed() {
  }
}
</script>

<style lang="scss" scoped>

</style>

