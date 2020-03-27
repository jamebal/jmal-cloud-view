<template>
  <div>
    <show-file
      queryFileType="image"
      :orderCustom="true"
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
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

