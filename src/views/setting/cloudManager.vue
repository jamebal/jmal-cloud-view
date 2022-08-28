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
        <div>
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="logoUrl" :src="logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
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
          <el-button class="sync-button" size="mini" :loading="resetLoading" type="danger" @click="resetMenuAndRole()"><i class="el-icon-refresh-left"></i></el-button>
        </div>
        <span class="instruction">一般用于初始化角色、菜单数据</span>
      </div>
    </el-card>
  </div>
</template>

<script>

import settingApi from "@/api/setting-api";
import {getSetting} from '@/api/setting-api'
import Bus from "@/assets/js/bus";
import fileConfig from "@/utils/file-config";

export default {
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + '/user/setting/upload_logo?jmal-token=' + this.$store.state.user.token,
      title: '网盘管理',
      syncLoading: false,
      resetLoading: false,
      webpEnabled: false,
      logoUrl: ''
    }
  },
  mounted() {
    this.getWebsiteSetting()
    this.getInfo()
    this.getIsSync()
    Bus.$on('msg/synced', () => {
      this.syncLoading = false
    })
  },
  destroyed() {
    Bus.$off()
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.logoUrl = fileConfig.logoUrl(res.data)
      } else {
        this.$message.error(res.message)
      }
    },
    beforeAvatarUpload(file) {
      const isLtOneM = file.size / 1024 / 1024 < 1;
      if (!isLtOneM) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isLtOneM;
    },
    // 获取网站设置
    getWebsiteSetting() {
      getSetting({userId: this.$store.state.user.userId}).then((res) => {
        if(res.data) {
          this.logoUrl = fileConfig.logoUrl(res.data.netdiskLogo)
          // this.logoUrl = '../../icons/svg/jmal-cloud.svg'
        }
      })
    },
    getInfo(){
      settingApi.getWebp({userId: this.$store.state.user.userId}).then((res) => {
        this.webpEnabled = !res.data
      })
    },
    getIsSync() {
      settingApi.isSync().then((res) => {
        this.syncLoading = res.data
      })
    },
    sync() {
      this.$confirm('是否开始同步? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.syncLoading = true
        settingApi.sync({username: this.$store.state.user.name}).then(() => {
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    // 重置角色菜单
    resetMenuAndRole(){
      this.$confirm('您确定要删除当前角色、菜单吗? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetLoading = true
        settingApi.resetMenuAndRole().then(() => {
          this.$message.success("重置完成")
          this.resetLoading = false
        }).catch(()=> {
          this.resetLoading = false
        })
      }).catch(() => {
        this.resetLoading = false
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}

</style>
