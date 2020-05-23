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
    <div v-else-if="item.contentType.indexOf('audio') > -1" v-on:mousedown="noDrag($event)">
      <div v-if="item.music !== undefined">
        <div v-if="item.music.name !== null">
          <el-image v-if="grid" :style="{'width':details?'110px':'80px','height':details?'110px':'80px'}" fit="contain" :src="item.fileId ? (audioCoverUrl+item.fileId) : (audioCoverUrl+item.id)">
          <div slot="error" class="image-slot">
            <svg-icon class="avatar-default-image" icon-class="audio"/>
          </div>
        </el-image>
        <el-avatar v-if="!grid" shape="square" :src="item.fileId ? (audioCoverUrl+item.fileId) : (audioCoverUrl+item.id)">
          <div slot="default">
            <svg-icon class="avatar-default-image" icon-class="audio"/>
          </div>
        </el-avatar>
        </div>
      </div>
      <svg-icon v-else icon-class="audio"/>
    </div>
    <!--<svg-icon v-else-if="item.contentType.indexOf('text') > -1" icon-class="file-txt"/>-->
    <div v-else-if="item.contentType.indexOf('image') > -1" v-on:mousedown="noDrag($event)">
      <el-image v-if="grid || grid === 'details'" :style="{'width':details?'110px':'80px','height':details?'110px':'80px'}" fit="contain" :src="item.fileId ? (imageUrl+item.fileId) : (imageUrl+item.id)">
        <div slot="error" class="image-slot">
          <svg-icon icon-class="loading-image-error"/>
        </div>
      </el-image>

      <el-avatar v-if="!grid" shape="square" :src="item.fileId ? (imageUrl+item.fileId) : (imageUrl+item.id)"></el-avatar>
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
      audioCoverUrl: {
        type: String,
        default: ''
      },
      grid: {
        type: Boolean,
        default: false
      },
      details: {
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
        if(!suffix && this.item.fileName){
          suffix = this.item.fileName.substring(this.item.fileName.lastIndexOf('.') + 1);
        }
        if(iconClass.has(suffix)){
          return iconClass.get(suffix)
        }
        return 'file'
      },
    },
    methods: {
      noDrag(e) {
        // console.log('noDrag',e)
        // e.preventDefault()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .avatar-default-image{
    height: 35px;
    width: 35px;
    line-height: 35px;
  }
</style>
