<template>
  <div class="container">
    <div class="config-item-label">{{ $t('app.netDiskName') }}：
      <el-input :placeholder="$t('common.pleaseEnter')" v-model="netdiskName" minlength="1" maxlength="10" size="medium"
                :style="{width: inputNetdiskNameWidth+'px'}"
                @keyup.enter.native="updateNetdiskName" @input="inputNetdiskName">
        <el-button round v-if="showAckBtn" slot="append" icon="el-icon-check" @click="updateNetdiskName"></el-button>
      </el-input>
    </div>
    <div class="config-item-label logo">{{ $t('app.netDiskLogo') }}：
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <Logo v-model="logoFileName" width="80" class="avatar"></Logo>
      </el-upload>
    </div>
    <span class="instruction">{{ $t('app.clickChangeLogo') }}</span>

    <div class="config-item-label">登录页背景：</div>
    <upload-image-input v-model="loginBackgroundUrl" />
    <span class="instruction">在这里填入图片的URL地址, 以在登录页面显示。</span>

    <div class="config-item-label" style="margin-left: 75px;">
      <el-button round type="primary" size="small" :loading="saveConfigLoading" @click="saveConfig">保存配置</el-button>
    </div>
  </div>
</template>

<script>

import settingApi, { getSetting } from '@/api/setting-api'
import UploadImageInput from '@/components/input/UploadImageInput.vue'
import Logo from '@/components/Logo/index.vue'
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'

export default {
  name: 'personalizationConfig',
  components: { UploadImageInput, Logo },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  computed: {},
  data() {
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}/user/setting/upload_logo`,
      logoFileName: this.$store.state.user.netdiskLogo || '',
      logoFileTypeList: ['image/svg+xml', 'image/jpg', 'image/png', 'image/jpeg'],
      netdiskName: 'JmalCloud',
      showAckBtn: false,
      loginBackgroundUrl: '',
      loginBackgroundBlur: 10,
      inputNetdiskNameWidth: 150,
      saveConfigLoading: false,
    }
  },
  mounted() {
    this.getWebsiteSetting()
  },
  methods: {
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.logoFileName = res.data
        this.$store.dispatch('user/setLogo', {
          netdiskName: this.netdiskName,
          netdiskLogo: this.logoFileName,
        }).then(() => {
          store.dispatch('updateMessage', { event: 'updateLogo' })
        })
      } else {
        this.$message.error(res.message)
      }
    },
    beforeAvatarUpload(file) {
      const correctFormat = this.logoFileTypeList.includes(file.type)
      const isLtOneM = file.size / 1024 < 128
      if (!correctFormat) {
        this.$message.error(this.$t('msg.netDiskLogoRuleFormat').toString())
        return correctFormat && isLtOneM
      }
      if (!isLtOneM) {
        this.$message.error(this.$t('msg.netDiskLogoRuleSize').toString())
      }
      return correctFormat && isLtOneM
    },
    // 获取网站设置
    getWebsiteSetting() {
      getSetting({ userId: this.$store.state.user.userId }).then((res) => {
        const { netdiskLogo, netdiskName, personalization } = res.data
        if (netdiskLogo) {
          this.logoFileName = netdiskLogo
        }
        if (netdiskName) {
          this.netdiskName = netdiskName
        }
        if (personalization) {
          this.loginBackgroundUrl = personalization.loginBackgroundUrl
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
        this.$message.warning(this.$t('msg.netDiskNameRuleEmpty').toString())
        return
      }
      //中文，数字，字母，下划线
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
      if (reg.test(this.netdiskName)) {
        settingApi.updateNetdiskName({ netdiskName: this.netdiskName }).then(() => {
          this.updateGlobalNetdiskNameAndLogo()
          this.$message.success(`${this.$t('app.netDiskName')} ${this.$t('common.modifiedSuccessfully')}`)
          this.setInputBlur()
        }).catch(() => {
          this.setInputBlur()
        })
      } else {
        this.$message.warning(`${this.$t('msg.netDiskNameRule')}`)
      }
    },
    updateGlobalNetdiskNameAndLogo() {
      this.$store.dispatch('user/setLogo', {
        netdiskName: this.netdiskName,
        netdiskLogo: this.logoFileName,
      }).then(() => {
        store.dispatch('updateMessage', { event: 'updateLogo' })
        document.title = getPageTitle(this.$route.meta.title)
      })
    },
    saveConfig(){
      this.saveConfigLoading = true
      settingApi.updateNetdiskPersonalization({
        name: this.netdiskName,
        loginBackgroundUrl: this.loginBackgroundUrl
      }).then(() => {
        this.updateGlobalNetdiskNameAndLogo()
        this.$message.success('保存成功')
      }).finally(() => {
        this.saveConfigLoading = false
      })
    }
  },
}
</script>

<style lang="scss" scoped>
@import "src/styles/setting";

.container {
  padding: 0 !important;
}

.config-item-label.logo {
  display: flex;
  line-height: 80px;
}

.netdisk-name {
  width: 220px;
}

.avatar-uploader >>>.el-upload {
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
