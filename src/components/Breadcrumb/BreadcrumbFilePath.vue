<template>
  <span>
    <a v-if="strLength(item.folder) > 10">
      <el-tooltip class="item" effect="dark" :content="item.folder" placement="top">
        <a v-if="pathList.length >= 7">
          <span v-if="index === pathList.length-6" class="redirect" >&nbsp;</span>
          <a v-if="index === pathList.length-6" class="redirect" v-on:click.prevent="handleLink(item,index)">...<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
          <a v-if="index >= pathList.length-6 && index < pathList.length-2 && strLength(item.folder) <= 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
          <span v-if="index >= pathList.length-6 && index < pathList.length-2 && strLength(item.folder) > 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring10(item.folder) }}...<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
        </a>
        <a v-if="pathList.length < 7">
          <a v-if="index < pathList.length-2 && strLength(item.folder) <= 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
          <span v-if="index < pathList.length-2 && strLength(item.folder) > 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring10(item.folder) }}...<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
        </a>
        <a v-if="index===pathList.length-2">
          <span v-if="strLength(item.folder) <= 10" class="no-redirect">{{ item.folder }}</span>
          <span v-if="strLength(item.folder) > 10 && strLength(item.folder) <= 50 && item.searchKey" class="no-redirect">{{ item.folder }}</span>
          <span v-if="strLength(item.folder) > 50 && item.searchKey" class="no-redirect">{{ substring10(item.folder) }}...</span>
          <span v-if="strLength(item.folder) > 10 && !item.searchKey" class="no-redirect">{{ substring10(item.folder) }}...</span>
        </a>
      </el-tooltip>
    </a>
    <a v-if="strLength(item.folder) <= 10">
      <a v-if="pathList.length >= 7">
        <span v-if="index === pathList.length-6" class="redirect" >&nbsp;</span>
        <a v-if="index === pathList.length-6" class="redirect" v-on:click.prevent="handleLink(item,index)">...<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
        <a v-if="index >= pathList.length-6 && index < pathList.length-2 && strLength(item.folder) <= 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
        <span v-if="index >= pathList.length-6 && index < pathList.length-2 && strLength(item.folder) > 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring10(item.folder) }}...<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
      </a>
      <a v-if="pathList.length < 7">
        <a v-if="index < pathList.length-2 && strLength(item.folder) <= 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ item.folder }}<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></a>
        <span v-if="index < pathList.length-2 && strLength(item.folder) > 10" class="redirect" v-on:click.prevent="handleLink(item,index)">{{ substring10(item.folder) }}...<svg-icon style="font-size: 1rem;" icon-class="breadcrumb-right" /></span>
      </a>
      <a v-if="index===pathList.length-2">
        <span v-if="strLength(item.folder) <= 10" class="no-redirect">{{ item.folder }}</span>
        <span v-if="strLength(item.folder) > 10 && strLength(item.folder) <= 50 && item.searchKey" class="no-redirect">{{ item.folder }}</span>
        <span v-if="strLength(item.folder) > 50 && item.searchKey" class="no-redirect">{{ substring10(item.folder) }}...</span>
        <span v-if="strLength(item.folder) > 10 && !item.searchKey" class="no-redirect">{{ substring10(item.folder) }}...</span>
      </a>
    </a>
  </span>
</template>
<script>
  import { strlen, substring10 } from '@/utils/number'
  export default {
    name: 'BreadcrumbFilePath',
    props: {
      pathList: {
        type: Array,
        default: () => [
          { 'folder': '', index: 0 },
          { 'folder': '+', index: 1 }
        ]
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
      substring10(str) {
        return substring10(str)
      },
      handleLink(item, index) {
        this.$emit('clickLink',item, index)
      },
    }
  }
</script>
<style lang="scss" scoped>
  .redirect {
    color: #97a8be;
  }
  .no-redirect {
    color: #000000;
    cursor: text;
    margin-right: 10px;
  }

  /deep/ .el-breadcrumb__separator {
    margin: 0 0;
    font-weight: 700;
    color: #C0C4CC;
  }

  .el-breadcrumb {
    font-size: 1rem;
    line-height: 46px;
  }
</style>
