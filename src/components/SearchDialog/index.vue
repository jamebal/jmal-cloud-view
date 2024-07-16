<template>
  <div>
    <el-dialog style="{'font-weight': 600}" :show-close="false" :visible.sync="searchDialogVisible" @close="searchDialogClose">
      <div class="search-container">
        <div class="header column">
          header
        </div>
        <div class="operation column">
          operation
        </div>
        <div class="content column">
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div>
          <div>
            content1
          </div><div>
          content1
        </div><div>
          content1
        </div>
          <div>
            content1
          </div>


        </div>
        <div class="footer column">
          footer
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import IconFile from "@/components/Icon/IconFile";
import Icon from "@/components/Icon/Icon.vue";


export default {
  name: "SearchDialog",
  components: {
    Icon,
    IconFile
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: `${process.env.VUE_APP_BASE_API}/view/thumbnail?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}&id=`,
      audioCoverUrl: `${process.env.VUE_APP_BASE_API}/view/cover?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}&id=`,
      searchDialogVisible: false,
    }
  },
  computed: {
  },
  watch: {
    status(visible) {
      if (visible) {
        this.searchDialogVisible = true
      }
    }
  },
  methods: {
    searchDialogClose() {
      this.$emit('update:status', this.searchDialogVisible)
    }
  }
}
</script>

<style lang="scss" scoped>

>>> .el-dialog {
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__header {
    display: none;
  }
  max-width: 460px;

  .el-dialog__title {
    font-weight: 600;
  }
}

.search-container {
  display: flex;
  flex-direction: column;
  .column {
    padding: 20px;
  }
}
</style>
