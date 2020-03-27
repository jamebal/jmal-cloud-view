<template>
  <div>
    <show-file
      queryFileType="video"
      :orderCustom="true"
      emptyStatus="还没有视频文件呢~"
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

