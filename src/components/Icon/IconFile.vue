<template>
  <span>
            <svg-icon v-if="pc && item.isFavorite" icon-class="menu-favorite-hover" style="font-size: 1rem;float: right;margin-left: 1rem;position: absolute;" />
            <svg-icon v-if="!pc && item.isFavorite" icon-class="menu-favorite-hover" style="font-size: 0.5rem;float: right;margin-left: 2rem;position: absolute;" />
            <svg-icon v-if="item.isFolder" icon-class="folder" />
            <svg-icon v-else-if="item.contentType.indexOf('video') > -1" icon-class="video" />
            <svg-icon v-else-if="item.contentType.indexOf('audio') > -1" icon-class="audio" />
            <svg-icon v-else-if="item.contentType.indexOf('text') > -1" icon-class="file-txt" />
            <el-avatar v-else-if="item.contentType.indexOf('image') > -1" shape="square" :src="imageUrl+item.id"></el-avatar>
            <svg-icon v-else-if="item.contentType.indexOf('application/pdf') > -1" icon-class="file-pdf" />
            <svg-icon v-else-if="item.contentType.indexOf('word') > -1" icon-class="file-word" />
            <svg-icon v-else-if="item.contentType.indexOf('excel') > -1" icon-class="file-excel" />
            <svg-icon v-else-if="item.contentType.indexOf('zip') > -1" icon-class="zip" />
            <svg-icon v-else icon-class="file" />
  </span>
</template>
<script>
  export default {
    name: 'IconFile',
    props: {
      imageUrl: {
        type: String,
        default: ''
      },
      item: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        pc: window.pc
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>

</style>
