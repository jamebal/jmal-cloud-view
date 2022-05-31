<template>
  <div class="app-container" v-wechat-title="title">
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>网盘设置</span>
          </div>
        </div>
      </div>
      <div>
        <div class="config-itme-label">启用webp：
          <el-switch
            v-model="webpEnabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="webpChange"
          >
          </el-switch>
        </div>
        <span class="instruction">
          将图片转换为webp格式存储，在不降低图片质量的情况下，极大降低图片文件的体积，建议开启.
          <a href="https://baike.baidu.com/item/webp%E6%A0%BC%E5%BC%8F" target="_blank">什么是webp?</a>
        </span>
        <div class="config-itme-label">网盘同步：
          <el-button class="sync-button" size="mini" :loading="syncLoading" type="primary" @click="sync()"><i class="el-icon-refresh"></i></el-button>
        </div>
        <span class="instruction">一般用于初始化操作, 将文件数据同步到数据库</span>
        <div class="config-itme-label">重置角色、菜单：
          <el-button class="sync-button" size="mini" :loading="syncLoading" type="danger" @click="resetMenuAndRole()"><i class="el-icon-refresh-left"></i></el-button>
        </div>
        <span class="instruction">一般用于初始化角色、菜单数据</span>
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
      syncLoading: false,
      webpEnabled: false
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo(){
      settingApi.getWebp({userId: this.$store.state.user.userId}).then((res) => {
        this.webpEnabled = !res.data
      })
    },
    sync() {
      this.syncLoading = true
      settingApi.sync({username: this.$store.state.user.name}).then(() => {
        this.syncLoading = false
      }).catch(() => {
        this.syncLoading = false
      })
    },
    // 重置角色菜单
    resetMenuAndRole(){
      this.$confirm('您确定要删除此角色、菜单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        settingApi.resetMenuAndRole().then(() => {
          this.$message.success("重置完成")
        })
      })
    },
    webpChange(webpEnabled) {
      settingApi.disabledWebp({userId: this.$store.state.user.userId, disabled: !webpEnabled}).then(() => {
        webpEnabled ? this.$message.success('webp 已启用') : this.$message.warning('webp 已禁用')
      }).catch(() => {
        this.webpEnabled = !this.webpEnabled
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";
>>> .el-textarea {
  max-width: 1080px;
}
</style>
