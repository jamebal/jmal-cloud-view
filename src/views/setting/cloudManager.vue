<template>
  <div class="app-container" v-wechat-title="title">
    <el-card class="box-card">
      <div class="box-card-header">
        <div class="clearfix card-header-back">
          <span>同步网盘</span>
          <el-button class="card-button" size="mini" :loading="syncLoading" type="primary" @click="sync()"><i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
      </div>
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

<style lang="scss" scoped>
@import "src/styles/setting";
</style>
