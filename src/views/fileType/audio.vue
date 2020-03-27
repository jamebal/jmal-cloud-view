<template>
  <div>
    <show-file
      queryFileType="audio"
      :orderCustom="true"
      singleFileType="音乐"
    ></show-file>
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

