<template>
  <div>
    <show-file
      queryFileType="audio"
      :orderCustom="true"
      :defaultGrid="true"
      :sortable="sortable"
      :queryCondition="queryCondition"
      singleFileType="音乐"
      emptyStatus="还没有音乐呢~"
      :showUploadButton="false"
      :contextMenus="contextMenus"
    ></show-file>
  </div>
</template>

<script>
import ShowFile from "@/components/ShowFile/ShowFile";
import { createFiles, fileArrangements } from '@/utils/file-operations'

export default {
  components: {ShowFile},
  data() {
    return {
      sortable: {
        prop: 'updateDate', order: 'descending'
      },
      queryCondition: {
        isFolder:false,
        audio: true
      },
      contextMenus: [
        { label: '查看', operation: 'viewMode' ,child: [
            { iconClass: this.grid?'':'menu-point', label: '列表', operation: 'vmode-list'},
            { iconClass: this.grid?'menu-point':'', label: '缩略图', operation: 'vmode-grid'},
          ]
        },
        { label: '排列方式', operation: 'arrangement' ,child: fileArrangements
        },
        { label: '刷新', operation: 'refresh'},
        { divider: true, operation: 'divider' },
        { label: '新建', operation: 'create' , child: createFiles
        },
        { divider: true, operation: 'divider' },
        { label: '写文章', operation: 'createMarkdownFile'},
      ]
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

