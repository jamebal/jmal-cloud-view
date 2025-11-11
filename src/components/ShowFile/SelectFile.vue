<template>
  <div>
    <el-dialog
      class="select-file-dialog"
      :title="title"
      :visible.sync="dialogVisible"
      top="7.5vh"
      width="70%"
      :append-to-body="true"
      @close="handleClose"
    >
      <show-file
        v-if="dialogVisible"
        select-file
        query-file-type="image"
        :defaultGrid="true"
        :orderCustom="true"
        :show-upload-button="false"
        :show-search-button="false"
        :show-more-item="false"
        :show-share-item="false"
        :less-client-height="lessClientHeight"
        :show-change-vmode-btn="false"
        :sortable="sortable"
        @selectedFile="selectedFile"
      >
      </show-file>
      <div slot="footer" class="dialog-footer">
        <el-button round :disabled="!selectedFileRow.size" type="primary" @click="select">选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  components: { ShowFile: () => import("@/components/ShowFile/ShowFile"), },
  name: 'SelectFile',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择文件'
    }
  },
  data() {
    return {
      dialogVisible: false,
      sortable: {
        prop: 'updateDate', order: 'descending'
      },
      selectedFileRow: {},
      lessClientHeight: document.body.clientHeight * 0.15 + 150
    }
  },
  watch: {
    visible: function(vlaue) {
      if(vlaue){
        this.dialogVisible = true
      }
    },
  },
  methods: {
    selectedFile(row){
      this.selectedFileRow = row
    },
    select(){
      this.handleClose()
      this.$emit("select", this.selectedFileRow)
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/index';
.select-file-dialog {
  >>>.el-dialog__body {
    padding: 0;
  }
  >>>.el-dialog__header {
    padding: 16px 20px 10px;
  }
}
>>> .share-empty {
  padding-bottom: 20%;
}
@media screen and (max-width: 768px) {
  >>> .el-dialog {
    width: 100% !important;
  }
}
</style>
