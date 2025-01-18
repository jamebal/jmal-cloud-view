<template>
  <div>
    <show-file
      :defaultGrid="true"
      :orderCustom="true"
      :contextMenus="contextMenus"
      :showClipboard="true"
      :sortable="sortable">
    </show-file>
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
        prop: 'name', order: 'ascending'
      },
      contextMenus: [
        { label: '查看', operation: 'viewMode' ,child: [
            { iconClass: this.grid?'':'menu-point', label: '列表', operation: 'vmode-list'},
            { iconClass: this.grid?'menu-point':'', label: '缩略图', operation: 'vmode-grid'},
            { label: '显示文件夹大小', operation: 'show-folder-size'},
          ]
        },
        { label: '排列方式', operation: 'arrangement' ,child: fileArrangements
        },
        { label: '刷新', operation: 'refresh'},
        { divider: true, operation: 'divider' },
        { label: '新建', operation: 'create' ,child: createFiles
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

