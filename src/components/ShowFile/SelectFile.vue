<template>
  <div>
    <show-file
      query-file-type="image"
      :defaultGrid="true"
      :orderCustom="true"
      :show-upload-button="false"
      :show-search-button="false"
      :show-more-item="false"
      :show-share-item="false"
      :less-client-height="lessClientHeight"
      :sortable="sortable">
    </show-file>
  </div>
</template>

<script>
import ShowFile from "@/components/ShowFile/ShowFile";

export default {
  name: 'SelectFile',
  components: {ShowFile},
  data() {
    return {
      sortable: {
        prop: 'updateDate', order: 'descending'
      },
      lessClientHeight: document.body.clientHeight * 0.15 + 150
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
