<template>
  <div>
    <show-file
      queryFileType="document"
      :orderCustom="true"
      :defaultGrid="false"
      emptyStatus="还没有文档呢~"
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
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

