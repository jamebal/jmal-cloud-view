<template>
  <div>
    <show-file
      queryFileType="trash"
      :defaultGrid="true"
      :orderCustom="true"
      :sortable="sortable"
      :queryCondition="queryCondition"
      :showNavigation="true"
      :show-search-button="false"
      :context-menus="contextMenus"
      :single-menus="singleMenus"
      :multiple-right-menus="multipleRightMenus"
      :show-upload-button="false"
    ></show-file>
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
        isFolder: false,
        isTrash: true
      },
      contextMenus: [
        {
          label: '查看', operation: 'viewMode', child: [
            { iconClass: this.grid ? '' : 'menu-point', label: '列表', operation: 'vmode-list' },
            { iconClass: this.grid ? 'menu-point' : '', label: '缩略图', operation: 'vmode-grid' }
          ]
        },
        {
          label: '排列方式', operation: 'arrangement', child: [
            { label: '名称', operation: 'orderName', orderProp: 'name' },
            { label: '大小', operation: 'orderSize', orderProp: 'size' },
            { label: '日期', operation: 'orderUpdateDate', orderProp: 'updateDate' },
          ]
        },
        { label: '刷新', operation: 'refresh' },
        { divider: true, operation: 'divider' },
        { label: '清空回收站', operation: 'clearTrash' },
      ],
      singleMenus: [
        {iconClass: 'huanyuan', label: '放回原处', operation: 'restore'},
        {iconClass: 'menu-remove', label: '彻底删除', operation: 'sweep'}
      ],
      multipleRightMenus: [
        {
          iconClass: 'menu-deselect',
          label: '取消选定',
          operation: 'deselect',
        },
        {iconClass: 'huanyuan', label: '放回原处', operation: 'restore'},
        { iconClass: 'menu-remove', label: '彻底删除', operation: 'sweep' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

