<template>
  <div>
    <show-file
      :isCollectView="true"
      :defaultGrid="true"
      :sortable="sortable"
      :orderCustom="true"
      :defaultSort="sortable"
      :queryCondition="queryCondition"
      :singleMenus="singleMenus"
      :singleMenusEdit="singleMenusEdit"
      :multipleMenus="multipleMenus"
      :multipleRightMenus="multipleRightMenus"
      :contextMenus="contextMenus"
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
          prop: 'name', order: 'ascending'
        },
        queryCondition: {
          isFavorite: true
        },
        contextMenus: [
          { label: '查看', operation: 'viewMode' ,child: [
              { iconClass: this.grid?'':'menu-point', label: '列表', operation: 'vmode-list'},
              { iconClass: this.grid?'menu-point':'', label: '缩略图', operation: 'vmode-grid'},
              { label: '显示文件夹大小', operation: 'show-folder-size'},
            ]
          },
          { label: '排列方式', operation: 'arrangement' ,child: [
              { label: '名称', operation: 'orderName', orderProp: 'name'},
              { label: '大小', operation: 'orderSize', orderProp: 'size'},
              { label: '日期', operation: 'orderUpdateDate', orderProp: 'updateDate'},
            ]
          },
          { label: '刷新', operation: 'refresh'},
          { divider: true, operation: 'divider' },
          { label: '新建', operation: 'create' , homeDisable: true ,child: [
              { label: '文件夹', operation: 'createFolder', iconClass: 'folder'},
              { divider: true, operation: 'divider' },
              { label: '文本', operation: 'createTextFile', iconClass: 'file-txt'},
              { label: '思维导图', operation: 'createMinderFile', iconClass: 'file-mind'},
              { label: '流程图', operation: 'createDrawioFile', iconClass: 'file-drawio'},
              { label: 'Word', operation: 'createWordFile', iconClass: 'file-word'},
              { label: 'Excel', operation: 'createExcelFile', iconClass: 'file-excel'},
              { label: 'PPT', operation: 'createPPTFile', iconClass: 'file-ppt'},
            ]
          },
          { divider: true, operation: 'divider' },
          { label: '写文章', operation: 'createMarkdownFile'},
        ],
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

