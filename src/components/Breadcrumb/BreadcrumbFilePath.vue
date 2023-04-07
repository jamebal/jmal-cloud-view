<template>
  <span>
    <svg-icon v-if="item.shareBase" class="share-dir" icon-class="share"/>
    <a v-if="strLength(item.folder) > maxNameLength">
      <el-tooltip class="item" effect="dark" :content="item.folder" placement="top">
        <a v-if="pathList.length >= maxPathCount">
          <span v-if="index === pathList.length-maxPathCount-1" class="redirect" >&nbsp;</span>
          <a v-if="index === pathList.length-maxPathCount-1" class="redirect" v-on:click.prevent="handleLink(item,index)">…<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
          <a v-if="index >= pathList.length-maxPathCount-1 && index < pathList.length-1 && strLength(item.folder) <= maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
          <span v-if="index >= pathList.length-maxPathCount-1 && index < pathList.length-1 && strLength(item.folder) > maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring(item.folder,maxNameLength) }}…<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
        </a>
        <a v-if="pathList.length < maxPathCount">
          <a v-if="index < pathList.length-1 && strLength(item.folder) <= maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
          <span v-if="index < pathList.length-1 && strLength(item.folder) > maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring(item.folder,maxNameLength) }}…<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
        </a>
        <a v-if="index===pathList.length-1">
          <span v-if="strLength(item.folder) <= 20" class="no-redirect">{{ item.folder }}</span>
          <span v-if="strLength(item.folder) > 20 && strLength(item.folder) <= maxNameLengthOfLast && item.searchKey" class="no-redirect">{{ item.folder }}</span>
          <span v-if="strLength(item.folder) > maxNameLengthOfLast && item.searchKey" class="no-redirect">{{ substring(item.folder,maxNameLength) }}…</span>
          <span v-if="strLength(item.folder) > 20 && !item.searchKey" class="no-redirect">{{ substring(item.folder,20) }}…</span>
        </a>
      </el-tooltip>
    </a>
    <a v-if="strLength(item.folder) <= maxNameLength">
      <a v-if="pathList.length >= maxPathCount">
        <span v-if="index === pathList.length-maxPathCount-1" class="redirect" >&nbsp;</span>
        <a v-if="index === pathList.length-maxPathCount-1" class="redirect" v-on:click.prevent="handleLink(item,index)">…<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
        <a v-if="index > pathList.length-maxPathCount-1 && index < pathList.length-1 && strLength(item.folder) <= maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
        <span v-if="index >= pathList.length-maxPathCount-1 && index < pathList.length-1 && strLength(item.folder) > maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring(item.folder,maxNameLength) }}…<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
      </a>
      <a v-if="pathList.length < maxPathCount">
        <a v-if="index < pathList.length-1 && strLength(item.folder) <= maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
        <span v-if="index < pathList.length-1 && strLength(item.folder) > maxNameLength" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring(item.folder,maxNameLength) }}…<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
      </a>
      <a v-if="index===pathList.length-1">
        <span v-if="strLength(item.folder) <= maxNameLength" class="no-redirect">{{ item.folder }}</span>
        <span v-if="strLength(item.folder) > maxNameLength && strLength(item.folder) <= maxNameLengthOfLast && item.searchKey" class="no-redirect">{{ item.folder }}</span>
        <span v-if="strLength(item.folder) > maxNameLengthOfLast && item.searchKey" class="no-redirect">{{ substring(item.folder,maxNameLength) }}…</span>
        <span v-if="strLength(item.folder) > maxNameLength && !item.searchKey" class="no-redirect">{{ substring(item.folder,maxNameLength) }}…</span>
      </a>
    </a>
  </span>
</template>
<script>
  import { strlen,substring } from '@/utils/number'
  export default {
    name: 'BreadcrumbFilePath',
    props: {
      pathList: {
        type: Array,
        default: () => [
          // { 'folder': '', index: 0 },
          // { 'folder': '+', index: 1 }
        ]
      },
      maxNameLength: {
        type: Number,
        default: 10
      },
      maxPathCount: {
        type: Number,
        default: 7
      },
      maxNameLengthOfLast: {
        type: Number,
        default: 50
      },
      index: {
        type: Number,
        default: 0
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
      }
    },
    methods: {
      strLength(str) {
        return strlen(str)
      },
      substring(str,n){
        return substring(str,n)
      },
      handleLink(item, index) {
        this.$emit('clickLink',item, index)
      },
    }
  }
</script>
<style lang="scss" scoped>
  .share-dir {
    color: #52c41a;
    margin-right: -0.5rem;
    font-size: 1.2rem !important;
  }
  .redirect {
    color: #97a8be;
  }
  .no-redirect {
    color: #000000;
    cursor: text;
    margin-right: 10px;
  }

  >>> .el-breadcrumb__separator {
    margin: 0 0;
    font-weight: 700;
    color: #C0C4CC;
  }

  .el-breadcrumb {
    font-size: 1rem;
    line-height: 46px;
  }
</style>
