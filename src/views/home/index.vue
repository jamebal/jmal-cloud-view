<template>
  <div>
    <show-file
      :defaultGrid="false"
      :orderCustom="true"
      :contextMenus="contextMenus"
      :sortable="sortable">
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
      contextMenus: [ // contextmenuClick
        { label: '查看', operation: 'viewMode' ,child: [
            { iconClass: this.grid?'':'menu-point', label: '列表', operation: 'vmode-list'},
            { iconClass: this.grid?'menu-point':'', label: '缩略图', operation: 'vmode-grid'},
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
        { label: '新建文件', operation: 'createTextFile'},
        { label: '新建文档', operation: 'createMarkdownFile'},
      ]
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

