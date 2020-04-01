<template>
  <span>
      <div v-if="item.isFavorite && !public">
      <div v-if="pc">
        <svg-icon v-if="!grid" icon-class="menu-favorite-hover"
                  style="font-size: 1rem;float: right;margin-left: 1rem;position: absolute;"/>
        <svg-icon v-if="grid" icon-class="menu-favorite-hover"
                  style="font-size: 1.5rem;right: 0;top: -1rem;position: absolute;z-index: 1;"/>
      </div>
      <div v-else>
        <svg-icon v-if="!grid" icon-class="menu-favorite-hover"
                  style="font-size: 0.5rem;float: right;margin-left: 0.5rem;position: absolute;"/>
        <svg-icon v-if="grid" icon-class="menu-favorite-hover"
                  style="font-size: 1rem;right: 0;top: -1rem;position: absolute;z-index: 1;"/>
      </div>
    </div>
    <svg-icon v-if="item.isFolder" icon-class="folder"/>
    <svg-icon v-else-if="item.contentType.indexOf('video') > -1" icon-class="video"/>
    <svg-icon v-else-if="item.contentType.indexOf('audio') > -1" icon-class="audio"/>
    <!--<svg-icon v-else-if="item.contentType.indexOf('text') > -1" icon-class="file-txt"/>-->
    <div v-else-if="item.contentType.indexOf('image') > -1">
      <el-image v-if="grid" style="width: 80px;height: 80px;" fit="contain" :src="item.fileId ? (imageUrl+item.fileId) : (imageUrl+item.id)">
        <div slot="error" class="image-slot">
          <svg-icon icon-class="loading-image-error"/>
        </div>
      </el-image>
      <el-avatar v-if="!grid" shape="square" :src="item.fileId ? (imageUrl+item.fileId) : ('data:image/png;base64,'+item.content)"></el-avatar>
    </div>
    <!--<svg-icon v-else-if="item.contentType.indexOf('application/pdf') > -1" icon-class="file-pdf"/>-->
    <!--<svg-icon v-else-if="item.contentType.indexOf('word') > -1" icon-class="file-word"/>-->
    <!--<svg-icon v-else-if="item.contentType.indexOf('zip') > -1" icon-class="zip"/>-->
    <!--<svg-icon v-else-if="item.contentType.indexOf('excel') > -1" icon-class="file-excel"/>-->
    <svg-icon v-else :icon-class="findIconClass"/>
  </span>
</template>
<script>
  import { iconClass } from '@/utils/file-type'
  export default {
    name: 'IconFile',
    props: {
      imageUrl: {
        type: String,
        default: ''
      },
      grid: {
        type: Boolean,
        default: false
      },
      public: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        pc: window.pc,
      }
    },
    mounted() {
    },
    computed: {
      findIconClass(){
        let suffix = this.item.suffix;
        if(iconClass.has(suffix)){
          return iconClass.get(suffix)
        }
        return 'file'
      }
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>

</style>
