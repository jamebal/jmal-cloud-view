<template>
  <div>
    <el-dialog style="{'font-weight': 600}" :visible.sync="searchDialogVisible" @close="searchDialogClose">
      <div>
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
  max-width: 460px;

  .el-dialog__title {
    font-weight: 600;
  }
}
</style>
