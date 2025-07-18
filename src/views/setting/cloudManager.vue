<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <div class="box-card-header">
          <div class="clearfix card-header-back">
            <span>{{ $t('app.setting') }}</span>
          </div>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('app.generalSetting')" name="1">
            <div v-if="activeName === '1'">
              <div class="config-itme-label">{{ $t('app.netDiskName') }}：
                <el-input :placeholder="$t('common.pleaseEnter')" v-model="netdiskName" minlength="1" maxlength="10" size="medium"
                          :style="{width: inputNetdiskNameWidth+'px'}"
                          @keyup.enter.native="updateNetdiskName" @input="inputNetdiskName">
                  <el-button round v-if="showAckBtn" slot="append" icon="el-icon-check" @click="updateNetdiskName"></el-button>
                </el-input>
              </div>
              <div class="config-itme-label logo">{{ $t('app.netDiskLogo') }}：
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
              <div class="config-itme-label">{{ $t('app.enableWebP') }}：
                <el-switch
                  v-model="webpEnabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="webpChange"
                >
                </el-switch>
              </div>
              <span class="instruction">
                {{ $t('app.storageWebP') }}
              </span>
              <div class="config-itme-label">{{ $t('app.rebuildIndex') }}：
                <el-button round class="sync-button" size="mini" :loading="syncLoading" type="primary" @click="sync()"><i class="el-icon-refresh"></i></el-button>
                <span v-show="syncPercent < 100">{{ $t('app.rebuildIndexStep1') }}: {{ syncPercent }}%</span>
                <span v-show="indexingPercent > 0 && indexingPercent < 100">{{ $t('app.rebuildIndexStep2') }}: </span><span v-show="indexingPercent > 0 && indexingPercent < 100">{{ indexingPercent }}%</span>
              </div>
              <span class="instruction">{{ $t('app.rebuildIndexDesc') }}</span>

              <div class="config-itme-label">{{ $t('app.recalculateFolderSize') }}：
                <el-button round class="sync-button" size="mini" type="primary" :loading="calculateFolderSizeLoading" @click="recalculateFolderSize()"><i class="el-icon-refresh"></i></el-button>
                <span v-show="calculateFolderSizeProcessedPercent > 0 && calculateFolderSizeProcessedPercent < 100">{{ calculateFolderSizeProcessedPercent }}%</span>
              </div>
              <span class="instruction">{{ $t('app.recalculateFolderSizeDesc') }}</span>

              <div class="config-itme-label">{{ $t('app.resetMenuAndRole') }}：
                <el-button round class="sync-button" size="mini" :loading="resetLoading" type="danger"
                           @click="resetMenuAndRole()">
                  <i class="el-icon-refresh-left"></i></el-button>
              </div>
              <span class="instruction">{{ $t('app.resetMenuAndRoleDesc') }}</span>

              <div class="config-itme-label">{{ $t('app.currentVersion') }}：v{{currentVersion}}
                <el-badge v-if="newVersion" value="new" class="item"/>
              </div>
              <span class="instruction">{{ $t('app.latestVersion') }}：{{newVersion ? newVersion : 'v' + currentVersion}}
                <a href="https://github.com/jamebal/jmal-cloud-view/releases" target="_blank">{{ $t('app.updateOnGithub') }}</a>
              </span>

            </div>
          </el-tab-pane>
          <el-tab-pane label="OnlyOffice" name="2" class="setting-tab-panel">
            <div v-if="activeName === '2'">
              <office-config></office-config>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.videoTranscoding')" name="3" class="setting-tab-panel">
            <div v-if="activeName === '3'">
              <transcode-config></transcode-config>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.ocrConfig')" name="4" class="setting-tab-panel">
            <div v-if="activeName === '4'">
              <ocr-config></ocr-config>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.previewConfig')" name="5" class="setting-tab-panel">
            <div v-if="activeName === '5'">
              <preview-config></preview-config>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.ldapAuth')" name="6" class="setting-tab-panel">
            <div v-if="activeName === '6'">
              <ldap-config></ldap-config>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.mfaAuth')" name="7" class="setting-tab-panel">
            <div v-if="activeName === '7'">
              <mfa-config/>
            </div>
          </el-tab-pane>
<!--          <el-tab-pane :label="$t('common.lang')" name="7" class="setting-tab-panel">-->
<!--            <div v-if="activeName === '7'">-->
<!--              <language-config></language-config>-->
<!--            </div>-->
<!--          </el-tab-pane>-->
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>

import config from '@/../package.json'
import settingApi, { getSetting } from "@/api/setting-api";
import Logo from "@/components/Logo";
import getPageTitle from "@/utils/get-page-title";
import UploadImageInput from "@/components/input/UploadImageInput.vue";
import LanguageConfig from '@/views/setting/cloudSetting/languageConfig.vue'
import MfaConfig from '@/views/setting/cloudSetting/mfaConfig.vue'
import OcrConfig from '@/views/setting/cloudSetting/ocrConfig.vue'
import PreviewConfig from '@/views/setting/cloudSetting/previewConfig.vue'
import {mapGetters, mapState} from "vuex";
import store from "@/store";
import TaskProgress from "@/components/TaskProgress/index.vue";
import LdapConfig from "@/views/setting/cloudSetting/ldapConfig.vue";
import TranscodeConfig from "@/views/setting/cloudSetting/transcodeConfig.vue";
import OfficeConfig from "@/views/setting/cloudSetting/officeConfig.vue";

export default {
  components: { MfaConfig, OcrConfig, LanguageConfig, PreviewConfig, OfficeConfig, TranscodeConfig, LdapConfig, TaskProgress, UploadImageInput, Logo},
  data() {
    return {
      activeName: '1',
      uploadUrl: `${process.env.VUE_APP_BASE_API}/user/setting/upload_logo?jmal-token=${this.$store.state.user.token}&name=${this.$store.state.user.name}`,
      title: this.$t('app.setting'),
      syncLoading: false,
      clickSync: false,
      indexingPercent: 100,
      syncPercent: 100,
      calculateFolderSizeProcessedPercent: 100,
      calculateFolderSizeLoading: false,
      resetLoading: false,
      webpEnabled: false,
      logoFileName: this.$store.state.user.netdiskLogo || '',
      netdiskName: 'JmalCloud',
      showAckBtn: false,
      inputNetdiskNameWidth: 150,
      logoFileTypeList: ['image/svg+xml', 'image/jpg', 'image/png', 'image/jpeg'],
      currentVersion: config.version,
    }
  },
  mounted() {
    this.getWebsiteSetting()
    this.getInfo()
    this.getIsSync()
    if (this.$route.query.tab) {
      this.activeName = this.$route.query.tab
    }
  },
  computed: {
    ...mapState(['message']),
    ...mapGetters([
      'newVersion'
    ]),
  },
  watch: {
    message(msg) {
      if (msg.event === 'msg/synced') {
        this.updateSyncStatus(msg.data.body)
      } else if (msg.event === 'msg/calculateFolderSizeProcessed') {
        this.calculateFolderSizeProcessedStatus(msg.data.body)
      }
    }
  },
  methods: {
    handleClick(tab) {
      this.$router.push({query: {tab: tab.name}})
    },
    handleAvatarSuccess(res) {
      if (res.code === 0) {
        this.logoFileName = res.data
        this.$store.dispatch('user/setLogo', {
          netdiskName: this.netdiskName,
          netdiskLogo: this.logoFileName
        }).then(() => {
          store.dispatch('updateMessage', {event: 'updateLogo'})
        })
      } else {
        this.$message.error(res.message)
      }
    },
    beforeAvatarUpload(file) {
      const correctFormat = this.logoFileTypeList.includes(file.type);
      const isLtOneM = file.size / 1024 < 128;
      if (!correctFormat) {
        this.$message.error(this.$t('msg.netDiskLogoRuleFormat').toString());
        return correctFormat && isLtOneM;
      }
      if (!isLtOneM) {
        this.$message.error(this.$t('msg.netDiskLogoRuleSize').toString());
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
        this.$message.warning(this.$t('msg.netDiskNameRuleEmpty').toString())
        return
      }
      //中文，数字，字母，下划线
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      if (reg.test(this.netdiskName)) {
        settingApi.updateNetdiskName({netdiskName: this.netdiskName}).then(() => {
          this.$store.dispatch('user/setLogo', {
            netdiskName: this.netdiskName,
            netdiskLogo: this.logoFileName
          }).then(() => {
            store.dispatch('updateMessage', {event: 'updateLogo'})
            document.title = getPageTitle(this.$route.meta.title)
          })
          this.$message.success(`${this.$t('app.netDiskName')} ${this.$t('common.modifiedSuccessfully')}`)
          this.setInputBlur()
        }).catch(() => {
          this.setInputBlur()
        })
      } else {
        this.$message.warning(`${this.$t('msg.netDiskNameRule')}`)
      }
    },
    getInfo() {
      settingApi.getWebp({userId: this.$store.state.user.userId}).then((res) => {
        this.webpEnabled = !res.data
      })
    },
    getIsSync() {
      settingApi.isSync({username: this.$store.state.user.name}).then((res) => {
        this.updateSyncStatus(res.data)
      })
    },
    updateSyncStatus(dataPercent) {
      const {syncPercent, indexingPercent} = dataPercent
      if (syncPercent) {
        this.syncPercent = syncPercent
      } else {
        this.syncPercent = 0
      }
      if (indexingPercent) {
        this.indexingPercent = indexingPercent
      } else {
        this.indexingPercent = 0
      }
      this.syncLoading = !((this.syncPercent === 100 && this.indexingPercent === 100) || (this.syncPercent === 0 && this.indexingPercent === 0));
    },
    calculateFolderSizeProcessedStatus(calculateFolderSizeProcessedPercent) {
      this.calculateFolderSizeProcessedPercent = calculateFolderSizeProcessedPercent
      this.calculateFolderSizeLoading = !(this.calculateFolderSizeProcessedPercent === 100 || this.calculateFolderSizeProcessedPercent === 0);
    },
    sync() {
      this.$confirm(`${this.$t('app.startSync')}`, `${this.$t('common.tips')}`, {
        confirmButtonText: `${this.$t('common.confirm')}`,
        cancelButtonText: `${this.$t('common.cancel')}`,
        type: 'warning'
      }).then(() => {
        this.syncLoading = true
        this.syncPercent = 0
        this.clickSync = true
        settingApi.syncCloud({username: this.$store.state.user.name}).then(() => {
          this.clickSync = false
        }).catch(() => {
          this.clickSync = false
        })
      })
    },
    recalculateFolderSize() {
      this.$confirm(`${this.$t('app.confirmRecalculateFolderSize')}`, `${this.$t('common.tips')}`, {
        confirmButtonText: `${this.$t('common.confirm')}`,
        cancelButtonText: `${this.$t('common.cancel')}`,
        type: 'warning'
      }).then(() => {
        this.calculateFolderSizeLoading = true;
        settingApi.recalculateFolderSize()
          .catch(() => {
            this.$message.error('Failed to initiate folder size recalculation.');
            this.calculateFolderSizeLoading = false;
          });
      }).catch(() => {});
    },
    // 重置角色菜单
    resetMenuAndRole() {
      this.$confirm(`${this.$t('app.confirmDeleteMenuAndRole')}`, `${this.$t('common.tips')}`, {
        confirmButtonText: `${this.$t('common.confirm')}`,
        cancelButtonText: `${this.$t('common.cancel')}`,
        type: 'warning'
      }).then(() => {
        this.resetLoading = true
        settingApi.resetMenuAndRole().then(() => {
          this.$message.success(this.$t('app.resetSuccessfully').toString())
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
        webpEnabled ? this.$message.success(`WebP ${this.$t('msg.enabled')}`) : this.$message.warning(`WebP ${this.$t('msg.disabled')}`)
      }).catch(() => {
        this.webpEnabled = !this.webpEnabled
      })
    },
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

>>> .el-card__body {
  padding: 0;
}

>>> .el-tabs__header {
  margin: 0;
  @media screen and (min-width: 768px) {
    .el-tabs__nav {
      padding: 0 20px;
    }
    .el-tabs__active-bar {
      left: 20px;
    }
  }
}

>>> .el-form-item__content {
  .el-select {
    width: 100%;
  }
}

.setting-tab-panel {
  padding-top: 20px;

  >>> .el-loading-spinner .circular {
    width: 25px !important;
  }
}

.progress {
  margin-top: 5px;
  >>> .el-card__header {
    padding: 8px 20px;
  }
}

</style>
