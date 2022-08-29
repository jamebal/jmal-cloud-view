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
        <div class="config-itme-label">网盘名称：
          <el-input placeholder="请输入网盘名称" v-model="netdiskName" minlength="1" maxlength="8" size="medium" :style="{width: inputNetdiskNameWidth+'px'}"
                    @keyup.enter.native="updateNetdiskName" @input="inputNetdiskName">
            <el-button  v-if="showAckBtn" slot="append" icon="el-icon-check" @click="updateNetdiskName"></el-button>
          </el-input>
        </div>
        <div class="config-itme-label logo">网盘Logo：
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <Logo v-model="logoFileName" width="80" class="avatar"></Logo>
          </el-upload>
        </div>
        <span class="instruction">点击更换Logo</span>
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
          <el-button class="sync-button" size="mini" :loading="syncLoading" type="primary" @click="sync()"><i
            class="el-icon-refresh"></i></el-button>
        </div>
        <span class="instruction">一般用于初始化操作, 将文件数据同步到数据库</span>
        <div class="config-itme-label">重置角色、菜单：
          <el-button class="sync-button" size="mini" :loading="resetLoading" type="danger" @click="resetMenuAndRole()">
            <i class="el-icon-refresh-left"></i></el-button>
        </div>
        <span class="instruction">一般用于初始化角色、菜单数据</span>
      </div>
    </el-card>
  </div>
</template>

<script>

import settingApi, {getSetting} from "@/api/setting-api";
import Bus from "@/assets/js/bus";
import Logo from "@/components/Logo";

export default {
  components: {Logo},
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + '/user/setting/upload_logo?jmal-token=' + this.$store.state.user.token,
      title: '网盘管理',
      syncLoading: false,
      resetLoading: false,
      webpEnabled: false,
      logoFileName: '',
      netdiskName: 'jmalcloud',
      showAckBtn: false,
      inputNetdiskNameWidth: 150,
      logoFileTypeList: ['image/svg+xml', 'image/jpg', 'image/png', 'image/jpeg']
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
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.logoFileName = res.data
        this.$store.dispatch('user/setLogo', {netdiskName: this.netdiskName, netdiskLogo: this.logoFileName}).then(()=> {
          Bus.$emit('updateLogo')
        })
      } else {
        this.$message.error(res.message)
      }
    },
    beforeAvatarUpload(file) {
      const correctFormat = this.logoFileTypeList.includes(file.type);
      const isLtOneM = file.size / 1024 < 128;
      if (!correctFormat) {
        this.$message.error('网盘Logo只能是 SVG|JPG|JPEG|PNG 格式!');
      }
      if (!isLtOneM) {
        this.$message.error('网盘Logo大小不能超过 128k!');
      }
      return correctFormat && isLtOneM;
    },
    // 获取网站设置
    getWebsiteSetting() {
      getSetting({userId: this.$store.state.user.userId}).then((res) => {
        if (res.data) {
          if (res.data.netdiskLogo) {
            this.logoFileName = res.data.netdiskLogo
          }
          if (res.data.netdiskName) {
            this.netdiskName = res.data.netdiskName
          }
        }
      })
    },
    inputNetdiskName(input) {
      if (input) {
        this.showAckBtn = true
        this.inputNetdiskNameWidth = 206
      }
    },
    setInputBlur() {
      this.showAckBtn = false
      this.inputNetdiskNameWidth = 150
    },
    // 修改网盘名称
    updateNetdiskName() {
      if (!this.netdiskName) {
        this.$message.warning("网盘名称不能为空")
        return
      }
      //中文，数字，字母，下划线
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      if(reg.test(this.netdiskName)) {
        settingApi.updateNetdiskName({netdiskName: this.netdiskName}).then(() => {
          this.$store.dispatch('user/setLogo', {netdiskName: this.netdiskName, netdiskLogo: this.logoFileName}).then(()=> {
            Bus.$emit('updateLogo')
          })
          this.$message.success("网盘名称 修改成功")
          this.setInputBlur()
        }).catch(()=>{
          this.setInputBlur()
        })
      } else {
        this.$message.warning("网盘名称 只能包含中文，数字，字母，下划线")
      }
    },
    getInfo() {
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
          this.$message.success("开始同步...")
        })
      })
    },
    // 重置角色菜单
    resetMenuAndRole() {
      this.$confirm('您确定要删除当前角色、菜单吗? ', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetLoading = true
        settingApi.resetMenuAndRole().then(() => {
          this.$message.success("重置完成")
          this.resetLoading = false
        }).catch(() => {
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

.config-itme-label.logo {
  display: flex;
  line-height: 80px;
}

.netdisk-name {
  width: 220px;
}

.avatar-uploader >>> .el-upload {
  display: block;

  .avatar {
    width: 80px;
    height: 80px;
    display: block;

    &:hover {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      filter: gray;
    }
  }
}

</style>
