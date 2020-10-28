<template>
  <div class="app-container" v-wechat-title="title">
    <el-card class="box-card">
      同步网盘
      <el-button type="primary" :loading="syncLoading" @click="sync"><i class="el-icon-upload el-icon--right"></i></el-button>
    </el-card>
  </div>
</template>

<script>

import settingApi from "@/api/setting-api";

export default {



  data() {
    return {
      title: '网盘管理',
      syncLoading: false
    }
  },
  methods: {
    sync() {
      this.syncLoading = true
      settingApi.sync({username: this.$store.state.user.name}).then(() => {
        this.syncLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
