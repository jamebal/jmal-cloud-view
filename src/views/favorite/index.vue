<template>
  <div>
    <show-file
      :isCollectView="true"
      :defaultGrid="false"
      :sortable="sortable"
      :orderCustom="true"
      :defaultSort="sortable"
      :queryCondition="queryCondition"
      :singleMenus="singleMenus"
      :singleMenusEdit="singleMenusEdit"
      :multipleMenus="multipleMenus"
      :multipleRightMenus="multipleRightMenus"
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
        sortable: {
          prop: 'updateDate', order: 'descending'
        },
        queryCondition: {
          isFavorite: true
        },
        singleMenus: [
          { iconClass: 'menu-open', label: '打开', operation: 'open' },
          { iconClass: 'share', label: '分享', operation: 'share' },
          { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
          { iconClass: 'menu-details', label: '详细信息', operation: 'details' },
          { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
          { iconClass: 'menu-copy', label: '移动或复制', operation: 'copy' },
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          // { iconClass: 'menu-favorite-hover', label: '取消收藏', operation: 'unFavorite' }
        ],
        singleMenusEdit: [
          { iconClass: 'menu-open', label: '打开', operation: 'open' },
          { iconClass: 'share', label: '分享', operation: 'share' },
          { iconClass: 'menu-favorite', label: '收藏', operation: 'favorite' },
          { iconClass: 'menu-edit1', label: '编辑', operation: 'edit' },
          { iconClass: 'menu-details', label: '详细信息', operation: 'details' },
          { iconClass: 'menu-rename', label: '重命名', operation: 'rename' },
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          // { iconClass: 'menu-favorite-hover', label: '取消收藏', operation: 'unFavorite' }
        ],
        multipleMenus: [
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          { iconClass: 'menu-favorite-hover', label: '取消收藏', operation: 'unFavorite' }
        ],
        multipleRightMenus: [
          { iconClass: 'menu-download', label: '下载', operation: 'download' },
          { iconClass: 'menu-favorite-hover', label: '取消收藏', operation: 'unFavorite' }
        ],
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>

